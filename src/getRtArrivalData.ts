import fetch from "node-fetch";

export async function getRtArrivalData(directionId: number, stopId: number) {
  const response = await fetch(
    `https://cruzmetro.com/Route/${directionId}/Stop/${stopId}/Arrivals`
  );
  const data = (await response.json()) as {
    Minutes: number;
    RouteName: string;
  }[];
  return data;
}
