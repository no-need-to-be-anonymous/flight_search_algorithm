import { UpdatedRoute } from "./App";

export function deg2rad(deg: any): any {
  return deg * (Math.PI / 180);
}

export function getDistanceFromLatLonInKm(
  lat1: NumberOrUndef,
  lon1: NumberOrUndef,
  lat2: NumberOrUndef,
  lon2: NumberOrUndef
) {
  var R = 6371; // Radius of the earth in km
  var dLat: any = deg2rad(lat2! - lat1!); // deg2rad below
  var dLon: any = deg2rad(lon2! - lon1!);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

type NumberOrUndef = number | undefined;

interface Graph {
  [key: string]: { [key: string]: number };
}

export const createGraph = (flights: UpdatedRoute[]) => {
  console.log(flights);
  const airportsGraph: Graph = {};

  for (let flight of flights) {
    // const {"destination apirport", "source airport",destinationCoords,sourceCoords} = flight
    if (!(flight["source airport"] in airportsGraph)) {
      airportsGraph[flight["source airport"]] = {};
    }
    if (!(flight["destination apirport"] in airportsGraph)) {
      airportsGraph[flight["destination apirport"]] = {};
    }
    airportsGraph[flight["destination apirport"]] = {
      ...airportsGraph[flight["destination apirport"]],
      [flight["source airport"]]: getDistanceFromLatLonInKm(
        flight["destinationCoords"]["lat"],
        flight["destinationCoords"]["long"],
        flight["sourceCoords"]["lat"],
        flight["sourceCoords"]["long"]
      ),
    };
    airportsGraph[flight["source airport"]] = {
      ...airportsGraph[flight["source airport"]],
      [flight["destination apirport"]]: getDistanceFromLatLonInKm(
        flight["destinationCoords"]["lat"],
        flight["destinationCoords"]["long"],
        flight["sourceCoords"]["lat"],
        flight["sourceCoords"]["long"]
      ),
    };
  }

  return airportsGraph;
};
