import geolib from 'geolib';
import fs from 'fs';
import { Stop } from './types';

const stops = JSON.parse(
  fs.readFileSync('./data/stops.json', { encoding: 'utf8' })
);

export function getNearestStops(lat: number, lon: number, limit: number): Stop[] {
  const temp = geolib.orderByDistance({lat, lon}, stops) as Stop[];
  return temp.slice(0, limit);
}