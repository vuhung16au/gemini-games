import * as THREE from 'three';
import { THEME_COLORS } from '../../../../styles/theme';
import type { CityTile, LightingMood } from '../game/types';

export interface BuildingMaterials {
  grassA: THREE.MeshStandardMaterial;
  grassB: THREE.MeshStandardMaterial;
  water: THREE.MeshStandardMaterial;
  trunk: THREE.MeshStandardMaterial;
  pineA: THREE.MeshStandardMaterial;
  pineB: THREE.MeshStandardMaterial;
  asphalt: THREE.MeshStandardMaterial;
  laneMark: THREE.MeshStandardMaterial;
  bridgeDeck: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  ivoryWall: THREE.MeshStandardMaterial;
  warmWall: THREE.MeshStandardMaterial;
  brickWall: THREE.MeshStandardMaterial;
  roofRed: THREE.MeshStandardMaterial;
  roofSlate: THREE.MeshStandardMaterial;
  roofPurple: THREE.MeshStandardMaterial;
  glassDay: THREE.MeshStandardMaterial;
  glassNight: THREE.MeshStandardMaterial;
  indMetal: THREE.MeshStandardMaterial;
  indAmber: THREE.MeshStandardMaterial;
  powerBlue: THREE.MeshStandardMaterial;
  waterCyan: THREE.MeshStandardMaterial;
  parkGrass: THREE.MeshStandardMaterial;
  fountainWater: THREE.MeshStandardMaterial;
  smokeMat: THREE.MeshStandardMaterial;
  lotRes: THREE.MeshStandardMaterial;
  lotCom: THREE.MeshStandardMaterial;
  lotInd: THREE.MeshStandardMaterial;
}

export function createBuildingMaterials(): BuildingMaterials {
  const std = (color: string | number, roughness = 0.78, metalness = 0.08) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      flatShading: true,
    });

  return {
    grassA: std('#88c46c', 0.9, 0.02),
    grassB: std('#7ebb62', 0.9, 0.02),
    water: new THREE.MeshStandardMaterial({
      color: '#4ea8de',
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: 0.9,
      flatShading: true,
    }),
    trunk: std('#6e4e37', 0.9, 0.02),
    pineA: std('#3b7a44', 0.85, 0.02),
    pineB: std('#2f6838', 0.85, 0.02),
    asphalt: std('#3d3a39', 0.88, 0.05),
    laneMark: std('#f6d55c', 0.6, 0.05),
    bridgeDeck: std('#c8c2ba', 0.75, 0.08),
    concrete: std('#a8a29b', 0.8, 0.05),
    ivoryWall: std(THEME_COLORS.softivory, 0.72, 0.05),
    warmWall: std('#eadbc8', 0.75, 0.05),
    brickWall: std('#c96f53', 0.78, 0.04),
    roofRed: std(THEME_COLORS.lawpurple, 0.7, 0.06),
    roofSlate: std('#4d5563', 0.7, 0.1),
    roofPurple: std(THEME_COLORS.bookpurple, 0.65, 0.12),
    glassDay: new THREE.MeshStandardMaterial({
      color: '#7cc6e8',
      roughness: 0.2,
      metalness: 0.45,
      flatShading: true,
    }),
    glassNight: new THREE.MeshStandardMaterial({
      color: '#ffe599',
      emissive: '#ffb703',
      emissiveIntensity: 0.85,
      roughness: 0.3,
      metalness: 0.2,
      flatShading: true,
    }),
    indMetal: std('#7f848c', 0.55, 0.35),
    indAmber: std('#d98a2b', 0.72, 0.1),
    powerBlue: std('#2b6cb0', 0.5, 0.25),
    waterCyan: std('#319795', 0.45, 0.2),
    parkGrass: std('#66b554', 0.88, 0.02),
    fountainWater: std('#63d2ff', 0.2, 0.15),
    smokeMat: new THREE.MeshStandardMaterial({
      color: '#d8d5d0',
      transparent: true,
      opacity: 0.65,
      roughness: 1,
      flatShading: true,
    }),
    lotRes: std('#66bb6a', 0.85, 0.02),
    lotCom: std('#42a5f5', 0.85, 0.02),
    lotInd: std('#ffa726', 0.85, 0.02),
  };
}

export function disposeBuildingMaterials(mats: BuildingMaterials): void {
  Object.values(mats).forEach((m) => m.dispose());
}

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitCone = new THREE.ConeGeometry(0.5, 1, 6);
const unitCyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);

function boxMesh(
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(unitBox, mat);
  m.scale.set(w, h, d);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function createTree(mats: BuildingMaterials, scale = 1, x = 0, z = 0): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(unitCyl, mats.trunk);
  trunk.scale.set(0.11 * scale, 0.25 * scale, 0.11 * scale);
  trunk.position.y = 0.125 * scale;
  trunk.castShadow = true;

  const crown1 = new THREE.Mesh(unitCone, mats.pineA);
  crown1.scale.set(0.36 * scale, 0.36 * scale, 0.36 * scale);
  crown1.position.y = 0.36 * scale;
  crown1.castShadow = true;

  const crown2 = new THREE.Mesh(unitCone, mats.pineB);
  crown2.scale.set(0.28 * scale, 0.32 * scale, 0.28 * scale);
  crown2.position.y = 0.54 * scale;
  crown2.castShadow = true;

  g.add(trunk, crown1, crown2);
  g.position.set(x, 0, z);
  return g;
}

export interface TileVisualResult {
  group: THREE.Group;
  turbineRotor?: THREE.Group;
  smokePuffs?: THREE.Mesh[];
}

export function buildRoadMask(
  tiles: CityTile[],
  gridSize: number,
  x: number,
  y: number,
): number {
  const isRoad = (nx: number, ny: number) =>
    nx >= 0 &&
    ny >= 0 &&
    nx < gridSize &&
    ny < gridSize &&
    tiles[ny * gridSize + nx].kind === 'road';
  let mask = 0;
  if (isRoad(x, y - 1)) mask |= 1; // North (-Z)
  if (isRoad(x + 1, y)) mask |= 2; // East (+X)
  if (isRoad(x, y + 1)) mask |= 4; // South (+Z)
  if (isRoad(x - 1, y)) mask |= 8; // West (-X)
  return mask;
}

export function createTileBuildingGroup(
  tile: CityTile,
  roadMask: number,
  mats: BuildingMaterials,
  lighting: LightingMood,
): TileVisualResult {
  const group = new THREE.Group();
  const glassMat = lighting === 'night' ? mats.glassNight : mats.glassDay;

  if (tile.kind === 'empty') {
    if (tile.terrain === 'forest') {
      group.add(createTree(mats, 0.9, -0.22, -0.18));
      group.add(createTree(mats, 1.05, 0.18, 0.14));
      group.add(createTree(mats, 0.78, -0.14, 0.24));
    }
    return { group };
  }

  if (tile.kind === 'road') {
    const isBridge = tile.terrain === 'water';
    const deckMat = isBridge ? mats.bridgeDeck : mats.asphalt;
    const baseY = isBridge ? 0.08 : 0.01;

    if (isBridge) {
      group.add(boxMesh(0.18, 0.24, 0.18, mats.concrete, -0.32, -0.16, -0.32));
      group.add(boxMesh(0.18, 0.24, 0.18, mats.concrete, 0.32, -0.16, 0.32));
      group.add(boxMesh(0.96, 0.06, 0.96, mats.concrete, 0, 0.02, 0));
    }

    // Center hub
    group.add(boxMesh(0.56, 0.03, 0.56, deckMat, 0, baseY, 0));
    if (roadMask & 1) {
      group.add(boxMesh(0.56, 0.03, 0.24, deckMat, 0, baseY, -0.38));
      group.add(boxMesh(0.06, 0.035, 0.22, mats.laneMark, 0, baseY, -0.36));
    }
    if (roadMask & 4) {
      group.add(boxMesh(0.56, 0.03, 0.24, deckMat, 0, baseY, 0.38));
      group.add(boxMesh(0.06, 0.035, 0.22, mats.laneMark, 0, baseY, 0.36));
    }
    if (roadMask & 2) {
      group.add(boxMesh(0.24, 0.03, 0.56, deckMat, 0.38, baseY, 0));
      group.add(boxMesh(0.22, 0.035, 0.06, mats.laneMark, 0.36, baseY, 0));
    }
    if (roadMask & 8) {
      group.add(boxMesh(0.24, 0.03, 0.56, deckMat, -0.38, baseY, 0));
      group.add(boxMesh(0.22, 0.035, 0.06, mats.laneMark, -0.36, baseY, 0));
    }
    return { group };
  }

  if (tile.kind === 'residential') {
    if (tile.level === 0) {
      group.add(boxMesh(0.84, 0.03, 0.84, mats.lotRes, 0, 0, 0));
      group.add(boxMesh(0.2, 0.08, 0.2, mats.ivoryWall, -0.22, 0.03, -0.22));
      return { group };
    }
    if (tile.level === 1) {
      group.add(boxMesh(0.56, 0.34, 0.5, mats.ivoryWall, 0, 0, 0));
      const roof = new THREE.Mesh(unitCone, mats.roofRed);
      roof.scale.set(0.68, 0.32, 0.68);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 0.5;
      roof.castShadow = true;
      group.add(roof);
      group.add(boxMesh(0.14, 0.14, 0.04, glassMat, 0, 0.14, 0.25));
      return { group };
    }
    if (tile.level === 2) {
      group.add(boxMesh(0.68, 0.62, 0.58, mats.warmWall, 0, 0, 0));
      group.add(boxMesh(0.72, 0.1, 0.62, mats.roofSlate, 0, 0.62, 0));
      group.add(boxMesh(0.45, 0.16, 0.04, glassMat, 0, 0.22, 0.29));
      group.add(boxMesh(0.45, 0.16, 0.04, glassMat, 0, 0.44, 0.29));
      return { group };
    }
    if (tile.level === 3) {
      group.add(boxMesh(0.72, 1.05, 0.72, mats.brickWall, 0, 0, 0));
      group.add(boxMesh(0.76, 0.08, 0.76, mats.concrete, 0, 1.05, 0));
      for (let f = 0; f < 3; f++) {
        group.add(boxMesh(0.52, 0.14, 0.75, glassMat, 0, 0.18 + f * 0.3, 0));
      }
      return { group };
    }
    // Level 4 High-Rise
    group.add(boxMesh(0.76, 1.55, 0.76, mats.ivoryWall, 0, 0, 0));
    group.add(boxMesh(0.54, 0.45, 0.54, mats.roofPurple, 0, 1.55, 0));
    for (let f = 0; f < 5; f++) {
      group.add(boxMesh(0.62, 0.15, 0.79, glassMat, 0, 0.18 + f * 0.28, 0));
      group.add(boxMesh(0.79, 0.15, 0.62, glassMat, 0, 0.18 + f * 0.28, 0));
    }
    return { group };
  }

  if (tile.kind === 'commercial') {
    if (tile.level === 0) {
      group.add(boxMesh(0.84, 0.03, 0.84, mats.lotCom, 0, 0, 0));
      return { group };
    }
    if (tile.level === 1) {
      group.add(boxMesh(0.64, 0.42, 0.6, mats.warmWall, 0, 0, 0));
      group.add(boxMesh(0.68, 0.08, 0.18, mats.roofPurple, 0, 0.22, 0.32));
      group.add(boxMesh(0.48, 0.18, 0.04, glassMat, 0, 0.1, 0.3));
      return { group };
    }
    if (tile.level === 2) {
      group.add(boxMesh(0.74, 0.8, 0.74, mats.concrete, 0, 0, 0));
      group.add(boxMesh(0.62, 0.56, 0.77, glassMat, 0, 0.14, 0));
      group.add(boxMesh(0.78, 0.08, 0.78, mats.roofPurple, 0, 0.8, 0));
      return { group };
    }
    if (tile.level === 3) {
      group.add(boxMesh(0.76, 1.38, 0.76, mats.roofSlate, 0, 0, 0));
      group.add(boxMesh(0.66, 1.18, 0.79, glassMat, 0, 0.12, 0));
      group.add(boxMesh(0.79, 1.18, 0.66, glassMat, 0, 0.12, 0));
      group.add(boxMesh(0.45, 0.2, 0.45, mats.roofPurple, 0, 1.38, 0));
      return { group };
    }
    // Level 4 Skyscraper
    group.add(boxMesh(0.78, 2.05, 0.78, mats.roofSlate, 0, 0, 0));
    group.add(boxMesh(0.68, 1.85, 0.81, glassMat, 0, 0.12, 0));
    group.add(boxMesh(0.81, 1.85, 0.68, glassMat, 0, 0.12, 0));
    group.add(boxMesh(0.42, 0.4, 0.42, mats.roofPurple, 0, 2.05, 0));
    group.add(boxMesh(0.08, 0.45, 0.08, mats.ivoryWall, 0, 2.45, 0));
    return { group };
  }

  if (tile.kind === 'industrial') {
    if (tile.level === 0) {
      group.add(boxMesh(0.84, 0.03, 0.84, mats.lotInd, 0, 0, 0));
      return { group };
    }
    const smokePuffs: THREE.Mesh[] = [];
    const height = 0.35 + tile.level * 0.22;
    group.add(boxMesh(0.8, height, 0.72, mats.indMetal, 0, 0, 0));
    group.add(boxMesh(0.82, 0.08, 0.2, mats.indAmber, 0, height, 0.22));
    // Smokestack
    const stackH = height + 0.45;
    const stack = new THREE.Mesh(unitCyl, mats.concrete);
    stack.scale.set(0.14, stackH, 0.14);
    stack.position.set(-0.24, stackH / 2, -0.2);
    stack.castShadow = true;
    group.add(stack);

    for (let s = 0; s < 2; s++) {
      const puff = new THREE.Mesh(unitBox, mats.smokeMat);
      puff.scale.set(0.14, 0.14, 0.14);
      puff.position.set(-0.24, stackH + 0.15 + s * 0.24, -0.2);
      group.add(puff);
      smokePuffs.push(puff);
    }
    return { group, smokePuffs };
  }

  if (tile.kind === 'power') {
    group.add(boxMesh(0.86, 0.22, 0.86, mats.concrete, 0, 0, 0));
    group.add(boxMesh(0.44, 0.36, 0.44, mats.powerBlue, -0.14, 0.22, 0.12));
    // Wind turbine mast + rotating rotor
    const mast = new THREE.Mesh(unitCyl, mats.ivoryWall);
    mast.scale.set(0.09, 1.1, 0.09);
    mast.position.set(0.22, 0.75, -0.16);
    mast.castShadow = true;
    group.add(mast);

    const rotor = new THREE.Group();
    rotor.position.set(0.22, 1.26, -0.1);
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(unitBox, mats.ivoryWall);
      blade.scale.set(0.07, 0.42, 0.02);
      blade.position.y = 0.21;
      const pivot = new THREE.Group();
      pivot.rotation.z = (i * Math.PI * 2) / 3;
      pivot.add(blade);
      rotor.add(pivot);
    }
    group.add(rotor);
    return { group, turbineRotor: rotor };
  }

  if (tile.kind === 'water') {
    group.add(boxMesh(0.76, 0.08, 0.76, mats.concrete, 0, 0, 0));
    for (const [lx, lz] of [
      [-0.18, -0.18],
      [0.18, -0.18],
      [-0.18, 0.18],
      [0.18, 0.18],
    ]) {
      group.add(boxMesh(0.06, 0.65, 0.06, mats.indMetal, lx, 0.08, lz));
    }
    const tank = new THREE.Mesh(unitCyl, mats.waterCyan);
    tank.scale.set(0.56, 0.42, 0.56);
    tank.position.y = 0.92;
    tank.castShadow = true;
    const cap = new THREE.Mesh(unitCone, mats.ivoryWall);
    cap.scale.set(0.62, 0.22, 0.62);
    cap.position.y = 1.22;
    group.add(tank, cap);
    return { group };
  }

  if (tile.kind === 'park') {
    group.add(boxMesh(0.92, 0.04, 0.92, mats.parkGrass, 0, 0, 0));
    group.add(boxMesh(0.36, 0.08, 0.36, mats.concrete, 0, 0.04, 0));
    group.add(boxMesh(0.24, 0.1, 0.24, mats.fountainWater, 0, 0.05, 0));
    group.add(createTree(mats, 0.75, -0.28, -0.26));
    group.add(createTree(mats, 0.82, 0.28, 0.24));
    return { group };
  }

  // Civic Plaza
  group.add(boxMesh(0.88, 0.1, 0.88, mats.concrete, 0, 0, 0));
  group.add(boxMesh(0.7, 0.52, 0.6, mats.ivoryWall, 0, 0.1, 0));
  group.add(boxMesh(0.76, 0.1, 0.66, mats.roofPurple, 0, 0.62, 0));
  group.add(boxMesh(0.26, 0.55, 0.26, mats.ivoryWall, 0, 0.72, 0));
  const spire = new THREE.Mesh(unitCone, mats.roofPurple);
  spire.scale.set(0.32, 0.32, 0.32);
  spire.position.y = 1.42;
  group.add(spire);
  return { group };
}
