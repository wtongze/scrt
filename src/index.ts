import express from 'express';
import { getNearestStops } from './getNearestStops.js';
import { getRtArrivalData } from './getRtArrivalData.js';
import _ from 'lodash';

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World from SCRT');
});

app.get('/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const nearestStopsRaw = getNearestStops(parseFloat(lat), parseFloat(lon), 5);
  const nearestStops: any = [];
  nearestStopsRaw.forEach((stop) => {
    stop.routes.forEach((route) => {
      nearestStops.push({
        stopId: stop.id,
        stopName: stop.name,
        directionId: route.directionId
      });
    });
  });
  const stops = _.uniqBy(nearestStops, 'directionId');
  const results = await Promise.all(
    stops.map(async (stop: any) => ({
      ...stop,
      result: await getRtArrivalData(stop.directionId, stop.stopId),
    }))
  );
  const arrivals = results
    .filter((i) => i.result.length > 0)
    .map((i) => ({
      stopId: i.stopId,
      directionId: i.directionId,
      stopName: i.stopName,
      minute: i.result[0].Minutes,
      routeName: i.result[0].RouteName,
      realTime: !i.result[0].SchedulePrediction,
      arrivalTime: i.result[0].ArriveTime,
    }));
  res.json(arrivals);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
