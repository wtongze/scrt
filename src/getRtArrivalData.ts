import fetch from "node-fetch";

export async function getRtArrivalData(directionId: number, stopId: number) {
  const response = await fetch(
    `https://cruzmetro.com/Route/${directionId}/Stop/${stopId}/Arrivals`
  );
  const data = (await response.json()) as {
    Minutes: number;
    RouteName: string;
    SchedulePrediction: boolean;
    IsLastStop: boolean;
    ArriveTime: string;
  }[];
  return data.filter(i => !i.IsLastStop);
}
