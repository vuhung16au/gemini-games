import * as THREE from 'three';
import { THEME_COLORS } from '../../../../styles/theme';
import type { CityTile, LightingMood } from '../game/types';

interface CarAgent {
  mesh: THREE.Group;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  headlights: THREE.Mesh;
}

const CAR_COLORS = [
  THEME_COLORS.bookpurple,
  THEME_COLORS.lawpurple,
  '#2b6cb0',
  '#d98a2b',
  '#38a169',
  '#ffffff',
];

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export class TrafficSystem {
  public readonly group = new THREE.Group();
  private cars: CarAgent[] = [];
  private bodyGeometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];
  private headlightMat: THREE.MeshBasicMaterial;
  private wheelMat: THREE.MeshStandardMaterial;

  constructor() {
    this.headlightMat = new THREE.MeshBasicMaterial({ color: '#fff3b0' });
    this.wheelMat = new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.9 });
    this.materials.push(this.headlightMat, this.wheelMat);
  }

  public sync(tiles: CityTile[], gridSize: number, population: number, lighting: LightingMood): void {
    const roadTiles = tiles.filter((t) => t.kind === 'road');
    const desiredCount = Math.min(24, Math.max(0, Math.floor(roadTiles.length / 2) + Math.floor(population / 35)));

    this.headlightMat.color.set(lighting === 'night' ? '#fff3b0' : '#d6d2cc');

    if (roadTiles.length < 2) {
      this.clearCars();
      return;
    }

    while (this.cars.length > desiredCount) {
      const removed = this.cars.pop();
      if (removed) this.group.remove(removed.mesh);
    }

    while (this.cars.length < desiredCount) {
      const start = roadTiles[(this.cars.length * 7) % roadTiles.length];
      const next = this.pickNeighborRoad(tiles, gridSize, start.x, start.y, -1, -1) ?? start;
      const car = this.createCarMesh(this.cars.length);
      this.group.add(car.mesh);
      this.cars.push({
        ...car,
        x: start.x,
        y: start.y,
        targetX: next.x,
        targetY: next.y,
        progress: (this.cars.length % 5) * 0.2,
        speed: 1.4 + (this.cars.length % 4) * 0.25,
      });
    }
  }

  public update(dt: number, tiles: CityTile[], gridSize: number): void {
    if (this.cars.length === 0) return;
    const half = gridSize / 2 - 0.5;

    for (const car of this.cars) {
      // Ensure current target is still a road
      const tIdx = car.targetY * gridSize + car.targetX;
      if (!tiles[tIdx] || tiles[tIdx].kind !== 'road') {
        const fallback = tiles.find((t) => t.kind === 'road');
        if (!fallback) continue;
        car.x = fallback.x;
        car.y = fallback.y;
        car.targetX = fallback.x;
        car.targetY = fallback.y;
        car.progress = 0;
      }

      car.progress += dt * car.speed;
      if (car.progress >= 1) {
        const prevX = car.x;
        const prevY = car.y;
        car.x = car.targetX;
        car.y = car.targetY;
        const next = this.pickNeighborRoad(tiles, gridSize, car.x, car.y, prevX, prevY);
        if (next) {
          car.targetX = next.x;
          car.targetY = next.y;
        }
        car.progress = 0;
      }

      const wx = (car.x + (car.targetX - car.x) * car.progress) - half;
      const wz = (car.y + (car.targetY - car.y) * car.progress) - half;
      const curTile = tiles[car.y * gridSize + car.x];
      const baseY = curTile?.terrain === 'water' ? 0.13 : 0.05;

      const dx = car.targetX - car.x;
      const dz = car.targetY - car.y;
      // Offset slightly right-hand lane
      const laneOffset = 0.09;
      let ox = 0;
      let oz = 0;
      if (dx !== 0 || dz !== 0) {
        const angle = Math.atan2(dx, dz);
        car.mesh.rotation.y = angle;
        ox = -dz * laneOffset;
        oz = dx * laneOffset;
      }

      car.mesh.position.set(wx + ox, baseY, wz + oz);
    }
  }

  private pickNeighborRoad(
    tiles: CityTile[],
    gridSize: number,
    x: number,
    y: number,
    avoidX: number,
    avoidY: number,
  ): CityTile | null {
    const candidates: CityTile[] = [];
    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) continue;
      const tile = tiles[ny * gridSize + nx];
      if (tile.kind === 'road') {
        candidates.push(tile);
      }
    }
    if (candidates.length === 0) return null;
    const nonBacktrack = candidates.filter((c) => c.x !== avoidX || c.y !== avoidY);
    const pool = nonBacktrack.length > 0 ? nonBacktrack : candidates;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private createCarMesh(index: number): { mesh: THREE.Group; headlights: THREE.Mesh } {
    const mesh = new THREE.Group();
    const color = CAR_COLORS[index % CAR_COLORS.length];
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.5,
      metalness: 0.15,
      flatShading: true,
    });
    this.materials.push(bodyMat);

    const bodyGeo = new THREE.BoxGeometry(0.14, 0.08, 0.24);
    const cabGeo = new THREE.BoxGeometry(0.12, 0.06, 0.12);
    const lightGeo = new THREE.BoxGeometry(0.11, 0.03, 0.02);
    this.bodyGeometries.push(bodyGeo, cabGeo, lightGeo);

    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.04;
    body.castShadow = true;

    const cab = new THREE.Mesh(cabGeo, this.wheelMat);
    cab.position.set(0, 0.1, -0.01);

    const headlights = new THREE.Mesh(lightGeo, this.headlightMat);
    headlights.position.set(0, 0.04, 0.125);

    mesh.add(body, cab, headlights);
    return { mesh, headlights };
  }

  private clearCars(): void {
    for (const car of this.cars) {
      this.group.remove(car.mesh);
    }
    this.cars = [];
  }

  public dispose(): void {
    this.clearCars();
    this.bodyGeometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
  }
}
