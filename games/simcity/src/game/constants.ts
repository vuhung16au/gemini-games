import type { CityMilestoneInfo } from './milestones';
import type { ToolId } from './types';

export const GRID_SIZE = 20;
export const STARTING_TREASURY = 2500;
export const TICKS_PER_MONTH = 4;
export const MIN_TAX_RATE = 5;
export const MAX_TAX_RATE = 15;
export const DEFAULT_TAX_RATE = 9;

export const BRIDGE_COST = 30;
export const FOREST_CLEAR_SURCHARGE = 5;

export interface ToolMeta {
  id: ToolId;
  label: string;
  shortLabel: string;
  hotkey: string;
  cost: number;
  upkeep: number;
  icon: string;
  description: string;
}

export const TOOL_LIST: ToolMeta[] = [
  {
    id: 'inspect',
    label: 'Inspect',
    shortLabel: 'Inspect',
    hotkey: '1',
    cost: 0,
    upkeep: 0,
    icon: '🔍',
    description: 'Select any tile to inspect utilities, land value, and tax output.',
  },
  {
    id: 'road',
    label: 'Road / Bridge',
    shortLabel: 'Road',
    hotkey: '2',
    cost: 10,
    upkeep: 1,
    icon: '🛣️',
    description: 'Connects zones, conducts power & water, and carries traffic ($30 over water).',
  },
  {
    id: 'residential',
    label: 'Residential',
    shortLabel: 'Res',
    hotkey: '3',
    cost: 25,
    upkeep: 0,
    icon: '🏠',
    description: 'Houses citizens and generates property tax. Thrives near Parks & Civic hubs.',
  },
  {
    id: 'commercial',
    label: 'Commercial',
    shortLabel: 'Com',
    hotkey: '4',
    cost: 30,
    upkeep: 0,
    icon: '🏢',
    description: 'Provides retail/office jobs and strong tax revenue near populated districts.',
  },
  {
    id: 'industrial',
    label: 'Industrial',
    shortLabel: 'Ind',
    hotkey: '5',
    cost: 30,
    upkeep: 0,
    icon: '🏭',
    description: 'Supplies goods & jobs early on, but emits local pollution.',
  },
  {
    id: 'power',
    label: 'Power Plant',
    shortLabel: 'Power',
    hotkey: '6',
    cost: 250,
    upkeep: 15,
    icon: '⚡',
    description: 'Generates +35 MW of clean wind & solar power across connected roads.',
  },
  {
    id: 'water',
    label: 'Water Tower',
    shortLabel: 'Water',
    hotkey: '7',
    cost: 180,
    upkeep: 10,
    icon: '💧',
    description: 'Supplies +35 Water units through connected roads and adjacent zones.',
  },
  {
    id: 'park',
    label: 'Park',
    shortLabel: 'Park',
    hotkey: '8',
    cost: 50,
    upkeep: 3,
    icon: '🌳',
    description: 'Boosts land value (+18) and offsets pollution in a 3-tile radius.',
  },
  {
    id: 'civic',
    label: 'Civic Plaza',
    shortLabel: 'Civic',
    hotkey: '9',
    cost: 300,
    upkeep: 20,
    icon: '🏛️',
    description: 'Boosts safety & land value (radius 5) and unlocks L3–L4 skyscrapers.',
  },
  {
    id: 'bulldoze',
    label: 'Bulldoze',
    shortLabel: 'Clear',
    hotkey: 'B',
    cost: 5,
    upkeep: 0,
    icon: '🚜',
    description: 'Clears buildings, roads, or forest tiles.',
  },
];

export const TOOL_BY_ID: Record<ToolId, ToolMeta> = TOOL_LIST.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<ToolId, ToolMeta>,
);

export const POWER_PLANT_CAPACITY = 35;
export const WATER_TOWER_CAPACITY = 35;

export const POPULATION_BY_LEVEL = [0, 8, 22, 50, 95] as const;
export const COMMERCIAL_JOBS_BY_LEVEL = [0, 6, 16, 36, 70] as const;
export const INDUSTRIAL_JOBS_BY_LEVEL = [0, 10, 24, 48] as const;

export const MILESTONES: CityMilestoneInfo[] = [
  { name: 'Hamlet', minPop: 0 },
  { name: 'Village', minPop: 50 },
  { name: 'Town', minPop: 150 },
  { name: 'City', minPop: 400 },
  { name: 'Metropolis', minPop: 900 },
  { name: 'Megalopolis', minPop: 1800 },
];
