import { UpdatedRoute, routesType, airport } from "./App";
import { GraphType } from "./AlgorithmTypes";
import airportsJSON from "./data/airports";

type NumberOrUndef = number | undefined;

//helper function for getDistanceFromLatLonInKm
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

export function getAirportLatAndLong(airport: string): {
  lat: number | undefined;
  long: number | undefined;
} {
  const airports: airport[] = airportsJSON;
  const destinationAirport: airport | undefined = airports.find(
    (air) => air.IATA === airport
  );
  return {
    lat: destinationAirport?.Lat,
    long: destinationAirport?.Long,
  };
}

export function addCoordinatesToRoutesObject(
  routes: routesType
): UpdatedRoute[] {
  const newRoutes = routes.map((route) => {
    const sourceAirportCoordinates = getAirportLatAndLong(
      route["source airport"]
    );
    const destinationAirportCoordinates = getAirportLatAndLong(
      route["destination apirport"]
    );
    return {
      ...route,
      destinationCoords: destinationAirportCoordinates,
      sourceCoords: sourceAirportCoordinates,
    };
  });

  // console.log(newRoutes);
  return newRoutes;
}
