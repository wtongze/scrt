export interface Stop {
  id: number;
  rtpi: number;
  name: string;
  lat: number;
  lon: number;
  routes: {
    id: number;
    directionId: number;
    name: string;
  }[];
}
