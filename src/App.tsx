import "./App.css";
import airportsJSON from "./airports";
import { routesJSON } from "./routes_updated";
import { createGraph } from "./getDistance";
interface Route {
  "source airport": string;
  "destination apirport": string;
}

export interface UpdatedRoute extends Route {
  destinationCoords: {
    lat: number | undefined;
    long: number | undefined;
  };
  sourceCoords: {
    lat: number | undefined;
    long: number | undefined;
  };
}

type routesType = Route[];

type airport =
  | {
      Number: number;
      "Facility name": string;
      City: string;
      Country: string;
      IATA: string;
      ICAO: string;
      Lat: number;
      Long: number;
    }
  | {
      Number: number;
      "Facility name": string;
      City: string;
      Country: string;
      IATA: number;
      ICAO: string;
      Lat: number;
      Long: number;
    };

function App() {
  const airports: airport[] = airportsJSON;
  const routes: Route[] = routesJSON;
  console.log(routes.slice(0, 10));

  function getAirportLatAndLong(airport: string): {
    lat: number | undefined;
    long: number | undefined;
  } {
    const destinationAirport: airport | undefined = airports.find(
      (air) => air.IATA === airport
    );
    // console.log(destinationAirport);
    return {
      lat: destinationAirport?.Lat,
      long: destinationAirport?.Long,
    };
  }

  function addCoordinatesToRoutesObject(routes: routesType): UpdatedRoute[] {
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

    console.log(newRoutes);
    return newRoutes;
  }

  console.log(createGraph(addCoordinatesToRoutesObject(routes.slice(0, 10))));

  // addCoordinatesToRoutesObject(routes.slice(0, 10));

  console.log(getAirportLatAndLong("GKA"));

  return <div className='App'></div>;
}

export default App;
