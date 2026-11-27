import * as THREE from 'three';
import { THEME_COLORS } from '../../../../styles/theme';
import { canPlaceTool, isZoneKind } from '../game/engine';
import type { CityState, CityTile, DataOverlay, LightingMood, ToolId } from '../game/types';
import {
  buildRoadMask,
  type BuildingMaterials,
  createBuildingMaterials,
  createTileBuildingGroup,
  disposeBuildingMaterials,
} from './BuildingFactory';
import { TrafficSystem } from './TrafficSystem';

interface AnimatedTileRef {
  group: THREE.Group;
  popProgress: number;
  turbineRotor?: THREE.Group;
  smokePuffs?: THREE.Mesh[];
}

interface DustParticle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
}

export interface CitySceneCallbacks {
  onTileInteract: (x: number, y: number, isDrag: boolean) => void;
  onHoverTile: (tile: { x: number; y: number } | null) => void;
  onWebGLError?: (message: string) => void;
}

function makeWarningSpriteTexture(symbol: string, bg: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(symbol, 32, 34);
  }
  return new THREE.CanvasTexture(canvas);
}

export class CityScene {
  private container: HTMLElement;
  private callbacks: CitySceneCallbacks;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private mats: BuildingMaterials;
  private traffic: TrafficSystem;

  private hemiLight: THREE.HemisphereLight;
  private sunLight: THREE.DirectionalLight;

  private groundMeshes: THREE.Mesh[] = [];
  private groundGeo: THREE.BoxGeometry;
  private waterGroundGeo: THREE.BoxGeometry;
  private baseBoardGeo: THREE.BoxGeometry;
  private baseBoardMat: THREE.MeshStandardMaterial;

  private buildingLayer = new THREE.Group();
  private warningLayer = new THREE.Group();
  private dustLayer = new THREE.Group();

  private tileVisuals = new Map<number, AnimatedTileRef>();
  private lastRevisions: number[] = [];
  private lastLighting: LightingMood = 'day';
  private lastOverlay: DataOverlay = 'none';

  private hoverMesh: THREE.Mesh;
  private hoverGeo: THREE.BoxGeometry;
  private hoverMat: THREE.MeshBasicMaterial;

  private selectedMesh: THREE.Mesh;
  private selectedMat: THREE.MeshBasicMaterial;

  private dustGeo: THREE.BoxGeometry;
  private dustMat: THREE.MeshStandardMaterial;
  private dustParticles: DustParticle[] = [];

  private badgeTexPower: THREE.CanvasTexture;
  private badgeTexWater: THREE.CanvasTexture;
  private badgeTexRoad: THREE.CanvasTexture;

  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private pointerNdc = new THREE.Vector2();

  // Camera spherical orbit state
  private target = new THREE.Vector3(0, 0, 0);
  private yaw = Math.PI / 4;
  private pitch = 0.78;
  private distance = 22;
  private desiredTarget = new THREE.Vector3(0, 0, 0);
  private desiredYaw = Math.PI / 4;
  private desiredPitch = 0.78;
  private desiredDistance = 22;

  private currentState: CityState;
  private activeTool: ToolId = 'road';
  private activeLighting: LightingMood = 'day';
  private selectedTileCoord: { x: number; y: number } | null = null;

  private isLeftDown = false;
  private isOrbitDown = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private lastPaintedKey = '';
  private keysHeld = new Set<string>();

  private rafId = 0;
  private lastTime = 0;
  private elapsed = 0;
  private resizeObserver: ResizeObserver;
  private disposed = false;

  constructor(
    container: HTMLElement,
    initialState: CityState,
    callbacks: CitySceneCallbacks,
  ) {
    this.container = container;
    this.currentState = initialState;
    this.callbacks = callbacks;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#dfe8ee');

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 160);

    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.domElement.className = 'simcity-webgl-canvas';
      this.renderer.domElement.setAttribute('aria-label', 'SimCity 3D Interactive World');
      container.appendChild(this.renderer.domElement);
    } catch (err) {
      this.callbacks.onWebGLError?.(
        err instanceof Error ? err.message : 'WebGL initialization failed',
      );
    }

    this.mats = createBuildingMaterials();
    this.traffic = new TrafficSystem();

    this.hemiLight = new THREE.HemisphereLight('#fffdf8', '#6b655e', 0.85);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight('#fff6e5', 1.35);
    this.sunLight.position.set(16, 26, 14);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 70;
    const d = 14;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    const gridSize = initialState.gridSize;
    this.baseBoardGeo = new THREE.BoxGeometry(gridSize + 0.6, 0.5, gridSize + 0.6);
    this.baseBoardMat = new THREE.MeshStandardMaterial({
      color: '#bfb8af',
      roughness: 0.9,
      flatShading: true,
    });
    const board = new THREE.Mesh(this.baseBoardGeo, this.baseBoardMat);
    board.position.set(0, -0.42, 0);
    board.receiveShadow = true;
    this.scene.add(board);

    this.groundGeo = new THREE.BoxGeometry(0.98, 0.2, 0.98);
    this.waterGroundGeo = new THREE.BoxGeometry(0.98, 0.1, 0.98);
    this.buildTerrainGrid(initialState);

    this.scene.add(this.buildingLayer);
    this.scene.add(this.traffic.group);
    this.scene.add(this.warningLayer);
    this.scene.add(this.dustLayer);

    this.hoverGeo = new THREE.BoxGeometry(0.98, 0.06, 0.98);
    this.hoverMat = new THREE.MeshBasicMaterial({
      color: THEME_COLORS.bookpurple,
      transparent: true,
      opacity: 0.45,
    });
    this.hoverMesh = new THREE.Mesh(this.hoverGeo, this.hoverMat);
    this.hoverMesh.visible = false;
    this.scene.add(this.hoverMesh);

    this.selectedMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      wireframe: true,
    });
    this.selectedMesh = new THREE.Mesh(this.hoverGeo, this.selectedMat);
    this.selectedMesh.visible = false;
    this.scene.add(this.selectedMesh);

    this.dustGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    this.dustMat = new THREE.MeshStandardMaterial({
      color: '#d8d2c9',
      roughness: 0.95,
      flatShading: true,
    });

    this.badgeTexPower = makeWarningSpriteTexture('⚡', '#d97706');
    this.badgeTexWater = makeWarningSpriteTexture('💧', '#0284c7');
    this.badgeTexRoad = makeWarningSpriteTexture('!', '#b51825');

    this.applyLighting(this.activeLighting);
    this.syncState(initialState, 'none', 'day', null);
    this.updateCameraTransform();

    this.bindEvents();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    this.lastTime = performance.now();
    this.animate(this.lastTime);
  }

  private buildTerrainGrid(state: CityState): void {
    const half = state.gridSize / 2 - 0.5;
    for (const m of this.groundMeshes) {
      this.scene.remove(m);
      (m.material as THREE.Material).dispose();
    }
    this.groundMeshes = [];

    for (const tile of state.tiles) {
      const isWater = tile.terrain === 'water';
      const geo = isWater ? this.waterGroundGeo : this.groundGeo;
      const mat = new THREE.MeshStandardMaterial({
        color: isWater
          ? '#4ea8de'
          : (tile.x + tile.y) % 2 === 0
            ? '#88c46c'
            : '#7ebb62',
        roughness: isWater ? 0.25 : 0.9,
        metalness: isWater ? 0.12 : 0.02,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(tile.x - half, isWater ? -0.14 : -0.1, tile.y - half);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.groundMeshes.push(mesh);
    }
  }

  public setActiveTool(tool: ToolId): void {
    this.activeTool = tool;
  }

  public zoomBy(delta: number): void {
    this.desiredDistance = Math.max(8, Math.min(34, this.desiredDistance + delta));
  }

  public rotateBy(deltaYaw: number): void {
    this.desiredYaw += deltaYaw;
  }

  public resetCamera(): void {
    this.desiredTarget.set(0, 0, 0);
    this.desiredYaw = Math.PI / 4;
    this.desiredPitch = 0.78;
    this.desiredDistance = 22;
  }

  public spawnBulldozeDust(x: number, y: number): void {
    const half = this.currentState.gridSize / 2 - 0.5;
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(this.dustGeo, this.dustMat);
      mesh.position.set(x - half, 0.15, y - half);
      this.dustLayer.add(mesh);
      this.dustParticles.push({
        mesh,
        vx: (Math.random() - 0.5) * 1.8,
        vy: 1.2 + Math.random() * 1.4,
        vz: (Math.random() - 0.5) * 1.8,
        life: 0.45,
      });
    }
  }

  public syncState(
    state: CityState,
    overlay: DataOverlay,
    lighting: LightingMood,
    selectedTile: { x: number; y: number } | null,
  ): void {
    const presetChanged = state.preset !== this.currentState.preset || this.groundMeshes.length === 0;
    this.currentState = state;
    this.selectedTileCoord = selectedTile;

    if (presetChanged) {
      this.buildTerrainGrid(state);
      this.lastRevisions = [];
    }

    if (lighting !== this.lastLighting) {
      this.applyLighting(lighting);
      this.lastLighting = lighting;
    }

    const forceRebuildAll =
      this.lastRevisions.length !== state.tiles.length || lighting !== this.activeLighting;
    this.activeLighting = lighting;

    // Identify tiles that changed or neighbor a changed road
    const dirty = new Set<number>();
    for (let i = 0; i < state.tiles.length; i++) {
      if (forceRebuildAll || this.lastRevisions[i] !== state.tiles[i].revision) {
        dirty.add(i);
        const t = state.tiles[i];
        for (const [dx, dy] of [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ]) {
          const nx = t.x + dx;
          const ny = t.y + dy;
          if (nx >= 0 && ny >= 0 && nx < state.gridSize && ny < state.gridSize) {
            dirty.add(ny * state.gridSize + nx);
          }
        }
      }
    }

    const half = state.gridSize / 2 - 0.5;
    for (const idx of dirty) {
      const tile = state.tiles[idx];
      const existing = this.tileVisuals.get(idx);
      if (existing) {
        this.buildingLayer.remove(existing.group);
      }

      const roadMask =
        tile.kind === 'road' ? buildRoadMask(state.tiles, state.gridSize, tile.x, tile.y) : 0;
      const built = createTileBuildingGroup(tile, roadMask, this.mats, lighting);
      built.group.position.set(tile.x - half, 0, tile.y - half);

      const shouldPop =
        !forceRebuildAll &&
        this.lastRevisions[idx] !== undefined &&
        this.lastRevisions[idx] !== tile.revision &&
        tile.kind !== 'empty';
      if (shouldPop) {
        built.group.scale.set(1, 0.15, 1);
      }
      this.buildingLayer.add(built.group);
      this.tileVisuals.set(idx, {
        ...built,
        popProgress: shouldPop ? 0.15 : 1,
      });
    }

    this.lastRevisions = state.tiles.map((t) => t.revision);

    // Update ground overlay colors
    this.updateGroundColors(state, overlay);

    // Update warning badges
    this.rebuildWarningBadges(state);

    // Update selection highlight
    if (this.selectedTileCoord) {
      this.selectedMesh.visible = true;
      this.selectedMesh.position.set(
        this.selectedTileCoord.x - half,
        0.05,
        this.selectedTileCoord.y - half,
      );
    } else {
      this.selectedMesh.visible = false;
    }

    this.traffic.sync(state.tiles, state.gridSize, state.metrics.population, lighting);
    this.lastOverlay = overlay;
  }

  private updateGroundColors(state: CityState, overlay: DataOverlay): void {
    for (let i = 0; i < state.tiles.length; i++) {
      const tile = state.tiles[i];
      const mesh = this.groundMeshes[i];
      if (!mesh) continue;
      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (overlay === 'none') {
        if (tile.terrain === 'water') {
          mat.color.set('#4ea8de');
        } else {
          mat.color.set((tile.x + tile.y) % 2 === 0 ? '#88c46c' : '#7ebb62');
        }
      } else if (overlay === 'power') {
        if (tile.kind === 'power') mat.color.set('#f59e0b');
        else if (tile.powered) mat.color.set('#fde047');
        else if (tile.kind !== 'empty') mat.color.set('#ef4444');
        else mat.color.set('#cbd5e1');
      } else if (overlay === 'water') {
        if (tile.kind === 'water') mat.color.set('#0284c7');
        else if (tile.watered) mat.color.set('#38bdf8');
        else if (tile.kind !== 'empty') mat.color.set('#ef4444');
        else mat.color.set('#cbd5e1');
      } else {
        // landValue
        if (tile.terrain === 'water') {
          mat.color.set('#4ea8de');
        } else if (tile.landValue >= 72) {
          mat.color.set('#16a34a');
        } else if (tile.landValue >= 52) {
          mat.color.set('#84cc16');
        } else if (tile.landValue >= 35) {
          mat.color.set('#f59e0b');
        } else {
          mat.color.set('#dc2626');
        }
      }
    }
    void this.lastOverlay;
  }

  private rebuildWarningBadges(state: CityState): void {
    while (this.warningLayer.children.length > 0) {
      this.warningLayer.remove(this.warningLayer.children[0]);
    }
    const half = state.gridSize / 2 - 0.5;
    for (const tile of state.tiles) {
      if (!isZoneKind(tile.kind)) continue;
      let tex: THREE.CanvasTexture | null = null;
      if (!tile.hasRoadAccess) tex = this.badgeTexRoad;
      else if (!tile.powered) tex = this.badgeTexPower;
      else if (!tile.watered) tex = this.badgeTexWater;
      if (!tex) continue;

      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.42, 0.42, 0.42);
      sprite.position.set(tile.x - half, 0.85 + tile.level * 0.35, tile.y - half);
      this.warningLayer.add(sprite);
    }
  }

  private applyLighting(mood: LightingMood): void {
    if (mood === 'day') {
      this.scene.background = new THREE.Color('#dfe8ee');
      this.hemiLight.color.set('#fffdf8');
      this.hemiLight.groundColor.set('#6b655e');
      this.hemiLight.intensity = 0.85;
      this.sunLight.color.set('#fff6e5');
      this.sunLight.intensity = 1.35;
      this.sunLight.position.set(16, 26, 14);
    } else if (mood === 'sunset') {
      this.scene.background = new THREE.Color('#f4c7a1');
      this.hemiLight.color.set('#ffd5b8');
      this.hemiLight.groundColor.set('#4a3548');
      this.hemiLight.intensity = 0.72;
      this.sunLight.color.set('#ff8f5c');
      this.sunLight.intensity = 1.5;
      this.sunLight.position.set(-22, 12, 16);
    } else {
      this.scene.background = new THREE.Color('#19172b');
      this.hemiLight.color.set('#555a8f');
      this.hemiLight.groundColor.set('#1c1926');
      this.hemiLight.intensity = 0.55;
      this.sunLight.color.set('#8aa4ff');
      this.sunLight.intensity = 0.75;
      this.sunLight.position.set(12, 22, -16);
    }
  }

  private bindEvents(): void {
    const dom = this.renderer?.domElement;
    if (!dom) return;

    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onPointerDown = (e: PointerEvent) => {
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
        this.isOrbitDown = true;
        return;
      }

      if (e.button === 0) {
        this.isLeftDown = true;
        this.lastPaintedKey = '';
        const coord = this.raycastGrid(e.clientX, e.clientY);
        if (coord) {
          this.lastPaintedKey = `${coord.x},${coord.y}`;
          this.callbacks.onTileInteract(coord.x, coord.y, false);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (this.isOrbitDown) {
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;
        this.desiredYaw -= dx * 0.008;
        this.desiredPitch = Math.max(0.42, Math.min(1.28, this.desiredPitch + dy * 0.006));
        return;
      }

      const coord = this.raycastGrid(e.clientX, e.clientY);
      this.updateHoverCursor(coord);
      this.callbacks.onHoverTile(coord);

      if (this.isLeftDown && coord && this.activeTool !== 'inspect') {
        const key = `${coord.x},${coord.y}`;
        if (key !== this.lastPaintedKey) {
          this.lastPaintedKey = key;
          this.callbacks.onTileInteract(coord.x, coord.y, true);
        }
      }
    };

    const onPointerUp = () => {
      this.isLeftDown = false;
      this.isOrbitDown = false;
      this.lastPaintedKey = '';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.zoomBy(e.deltaY * 0.012);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      this.keysHeld.add(e.code);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      this.keysHeld.delete(e.code);
    };

    dom.addEventListener('contextmenu', onContextMenu);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    this.unbindFns.push(() => {
      dom.removeEventListener('contextmenu', onContextMenu);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    });
  }

  private unbindFns: Array<() => void> = [];

  private raycastGrid(clientX: number, clientY: number): { x: number; y: number } | null {
    const dom = this.renderer?.domElement;
    if (!dom) return null;
    const rect = dom.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    this.pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);

    const hit = new THREE.Vector3();
    if (!this.raycaster.ray.intersectPlane(this.groundPlane, hit)) return null;

    const half = this.currentState.gridSize / 2 - 0.5;
    const gx = Math.round(hit.x + half);
    const gy = Math.round(hit.z + half);
    if (gx < 0 || gy < 0 || gx >= this.currentState.gridSize || gy >= this.currentState.gridSize) {
      return null;
    }
    return { x: gx, y: gy };
  }

  private updateHoverCursor(coord: { x: number; y: number } | null): void {
    if (!coord) {
      this.hoverMesh.visible = false;
      return;
    }
    const tile: CityTile = this.currentState.tiles[coord.y * this.currentState.gridSize + coord.x];
    const half = this.currentState.gridSize / 2 - 0.5;
    this.hoverMesh.visible = true;
    this.hoverMesh.position.set(coord.x - half, 0.03, coord.y - half);

    const check = canPlaceTool(tile, this.activeTool);
    this.hoverMat.color.set(check.ok ? THEME_COLORS.bookpurple : THEME_COLORS.bookred);
  }

  private updateCameraTransform(): void {
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);
    this.camera.position.set(
      this.target.x + this.distance * cosP * Math.sin(this.yaw),
      this.target.y + this.distance * sinP,
      this.target.z + this.distance * cosP * Math.cos(this.yaw),
    );
    this.camera.lookAt(this.target);
  }

  private handleResize(): void {
    if (!this.renderer || this.disposed) return;
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private animate = (now: number): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);

    const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
    this.lastTime = now;
    this.elapsed += dt;

    // Keyboard camera pan & orbit
    const panSpeed = 10 * dt;
    const fwdX = -Math.sin(this.yaw);
    const fwdZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw);
    const rightZ = -Math.sin(this.yaw);

    if (this.keysHeld.has('KeyW') || this.keysHeld.has('ArrowUp')) {
      this.desiredTarget.x += fwdX * panSpeed;
      this.desiredTarget.z += fwdZ * panSpeed;
    }
    if (this.keysHeld.has('KeyS') || this.keysHeld.has('ArrowDown')) {
      this.desiredTarget.x -= fwdX * panSpeed;
      this.desiredTarget.z -= fwdZ * panSpeed;
    }
    if (this.keysHeld.has('KeyD') || this.keysHeld.has('ArrowRight')) {
      this.desiredTarget.x += rightX * panSpeed;
      this.desiredTarget.z += rightZ * panSpeed;
    }
    if (this.keysHeld.has('KeyA') || this.keysHeld.has('ArrowLeft')) {
      this.desiredTarget.x -= rightX * panSpeed;
      this.desiredTarget.z -= rightZ * panSpeed;
    }
    if (this.keysHeld.has('KeyQ')) this.desiredYaw -= 1.5 * dt;
    if (this.keysHeld.has('KeyE')) this.desiredYaw += 1.5 * dt;

    this.desiredTarget.x = Math.max(-10, Math.min(10, this.desiredTarget.x));
    this.desiredTarget.z = Math.max(-10, Math.min(10, this.desiredTarget.z));

    const damp = 1 - Math.exp(-10 * dt);
    this.target.lerp(this.desiredTarget, damp);
    this.yaw += (this.desiredYaw - this.yaw) * damp;
    this.pitch += (this.desiredPitch - this.pitch) * damp;
    this.distance += (this.desiredDistance - this.distance) * damp;
    this.updateCameraTransform();

    // Animate tile pop-in, wind turbines, and factory smoke
    for (const ref of this.tileVisuals.values()) {
      if (ref.popProgress < 1) {
        ref.popProgress = Math.min(1, ref.popProgress + dt * 5.5);
        ref.group.scale.y = ref.popProgress;
      }
      if (ref.turbineRotor) {
        ref.turbineRotor.rotation.z += dt * 2.4;
      }
      if (ref.smokePuffs) {
        ref.smokePuffs.forEach((puff, idx) => {
          const phase = (this.elapsed * 0.7 + idx * 0.5) % 1;
          puff.position.y = 1.05 + phase * 0.65;
          const s = 0.12 + phase * 0.12;
          puff.scale.set(s, s, s);
        });
      }
    }

    // Update bulldoze dust
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.dustLayer.remove(p.mesh);
        this.dustParticles.splice(i, 1);
      } else {
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.vy -= 4.5 * dt;
        const s = Math.max(0.01, p.life * 2);
        p.mesh.scale.set(s, s, s);
      }
    }

    this.traffic.update(dt, this.currentState.tiles, this.currentState.gridSize);

    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.unbindFns.forEach((fn) => fn());
    this.traffic.dispose();
    disposeBuildingMaterials(this.mats);

    this.groundMeshes.forEach((m) => (m.material as THREE.Material).dispose());
    this.groundGeo.dispose();
    this.waterGroundGeo.dispose();
    this.baseBoardGeo.dispose();
    this.baseBoardMat.dispose();
    this.hoverGeo.dispose();
    this.hoverMat.dispose();
    this.selectedMat.dispose();
    this.dustGeo.dispose();
    this.dustMat.dispose();
    this.badgeTexPower.dispose();
    this.badgeTexWater.dispose();
    this.badgeTexRoad.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
      this.renderer = null;
    }
  }
}
