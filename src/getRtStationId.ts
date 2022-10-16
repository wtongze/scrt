import fetch from 'node-fetch';
import fs from 'fs';
import type { Stop } from './types';

const stops: { [id: string]: Stop } = {};

async function fetchRoute() {
  const response = await fetch('https://cruzmetro.com/Region/0/Routes');
  const data = (await response.json()) as { ID: number; ShortName: string }[];
  const routes = data.map((i) => ({ ID: i.ID, Name: i.ShortName }));
  await Promise.all(
    routes.map(async (routeItem) => {
      const response = await fetch(
        `https://cruzmetro.com/Route/${routeItem.ID}/Directions/`
      );
      const directions = (await response.json()) as {
        RouteID: number;
        Name: string;
        Directionality: string;
        Stops: {
          ID: number;
          RtpiNumber: number;
          Name: string;
          Latitude: number;
          Longitude: number;
        }[];
      }[];
      directions.forEach((directionItem) => {
        directionItem.Stops.forEach((stop) => {
          const id = stop.ID;
          if (!(id in stops)) {
            stops[id] = {
              id: stop.ID,
              rtpi: stop.RtpiNumber,
              lat: stop.Latitude,
              lon: stop.Longitude,
              name: stop.Name,
              routes: [
                {
                  id: routeItem.ID,
                  directionId: directionItem.RouteID,
                  name: routeItem.Name,
                },
              ],
            };
          } else {
            if (
              !stops[id].routes.some(
                (i) => i.directionId === directionItem.RouteID
              )
            ) {
              stops[id].routes.push({
                id: routeItem.ID,
                directionId: directionItem.RouteID,
                name: routeItem.Name,
              });
            }
          }
        });
      });
    })
  );

  const out = Object.values(stops);
  fs.writeFile(
    './data/stops.json',
    JSON.stringify(out),
    { encoding: 'utf8' },
    () => {
      console.log(`${out.length} stops processed`);
    }
  );
}

fetchRoute();
