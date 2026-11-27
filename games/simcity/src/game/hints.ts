import { MILESTONES } from './constants';
import type { CityHint, CityState } from './types';

export function getCityHint(state: CityState): CityHint {
  const { metrics, tiles } = state;

  const hasPowerPlant = tiles.some((t) => t.kind === 'power');
  const hasWaterTower = tiles.some((t) => t.kind === 'water');

  if (!hasPowerPlant) {
    return {
      title: 'Build a Power Plant',
      message:
        'Place a Power Plant (⚡, key 6) next to the entry road so your zones can light up and grow.',
      recommendedTool: 'power',
    };
  }

  if (!hasWaterTower) {
    return {
      title: 'Supply Clean Water',
      message:
        'Place a Water Tower (💧, key 7) beside a road to bring water to your future neighborhoods.',
      recommendedTool: 'water',
    };
  }

  if (metrics.unroadedCount > 0) {
    return {
      title: 'Connect Isolated Zones',
      message: `${metrics.unroadedCount} zoned tile(s) have no road access. Lay Roads (🛣️, key 2) right beside them.`,
      recommendedTool: 'road',
    };
  }

  if (metrics.powerUsed > metrics.powerCapacity || (metrics.unpoweredCount > 0 && metrics.powerCapacity > 0)) {
    return {
      title: 'Expand Your Power Grid',
      message:
        metrics.powerUsed > metrics.powerCapacity
          ? `Power demand (${metrics.powerUsed} MW) exceeds capacity (${metrics.powerCapacity} MW). Build another Power Plant or connect disconnected roads.`
          : `${metrics.unpoweredCount} zone(s) are cut off from power. Connect their roads to your Power Plant.`,
      recommendedTool: metrics.powerUsed > metrics.powerCapacity ? 'power' : 'road',
    };
  }

  if (metrics.waterUsed > metrics.waterCapacity || (metrics.unwateredCount > 0 && metrics.waterCapacity > 0)) {
    return {
      title: 'Boost Water Supply',
      message:
        metrics.waterUsed > metrics.waterCapacity
          ? `Water demand (${metrics.waterUsed}) exceeds capacity (${metrics.waterCapacity}). Add another Water Tower.`
          : `${metrics.unwateredCount} zone(s) are cut off from water. Link them via Roads.`,
      recommendedTool: metrics.waterUsed > metrics.waterCapacity ? 'water' : 'road',
    };
  }

  if (metrics.demand.residential >= 35) {
    return {
      title: 'Housing Demand High',
      message:
        'Citizens want to move in! Zone Residential lots (🏠, key 3) along powered & watered roads.',
      recommendedTool: 'residential',
    };
  }

  if (metrics.demand.commercial >= 30) {
    return {
      title: 'Shops & Offices Needed',
      message:
        'Commercial demand is rising. Zone Commercial districts (🏢, key 4) for jobs and tax revenue.',
      recommendedTool: 'commercial',
    };
  }

  if (metrics.demand.industrial >= 30) {
    return {
      title: 'Industrial Demand Rising',
      message:
        'Zone Industrial lots (🏭, key 5) away from homes—and buffer them with Parks to reduce pollution.',
      recommendedTool: 'industrial',
    };
  }

  if (metrics.happiness < 65) {
    return {
      title: 'Boost Citizen Happiness',
      message:
        'Add Parks (🌳, key 8) or a Civic Plaza (🏛️, key 9), or nudge the Tax Rate down a notch.',
      recommendedTool: 'park',
    };
  }

  const nextMilestone = MILESTONES.find((m) => m.minPop > metrics.population);
  if (nextMilestone) {
    return {
      title: `Grow Toward ${nextMilestone.name}`,
      message: `Your city is humming along! Reach ${nextMilestone.minPop} residents (currently ${metrics.population}) and add a Civic Plaza for L3–L4 skyscrapers.`,
      recommendedTool: 'civic',
    };
  }

  return {
    title: 'Megalopolis Achieved!',
    message:
      'Your skyline is thriving. Experiment with Sunset/Night lighting or check the Land Value overlay!',
  };
}
