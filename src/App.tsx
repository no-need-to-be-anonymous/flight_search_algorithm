import "./App.css";
import airportsJSON from "./data/airports";
import { routesJSON } from "./data/routes_updated";
import { GraphType } from "./AlgorithmTypes";
import {createGraph, getAllPossibleRoutes} from './Algorithm'
import {getAirportLatAndLong,addCoordinatesToRoutesObject,deg2rad,getDistanceFromLatLonInKm} from './utilFunctions'
export interface Route {
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

export type routesType = Route[];

export type airport =
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

  const pipe =
    (...fns: any): any =>
    (args: any) =>
      fns.reduce((arg: any, fn: any) => {
        return fn(arg);
      }, args);

  const pipelineResult: any = pipe(
    addCoordinatesToRoutesObject,
    createGraph,
    (x: any) => getAllPossibleRoutes(x, "PCL", "IQT")
  )(routes.slice(0, 10));

  console.log("pipeline result", pipelineResult);

  // getAllPossibleRoutes(createGraph(addCoordinatesToRoutesObject(routes)), "PCL", "IQT")

  return <div className='App'></div>;
}

export default App;
