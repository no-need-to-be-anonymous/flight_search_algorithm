import { GraphType } from "./AlgorithmTypes";
import { getDistanceFromLatLonInKm } from "./utilFunctions";


//creates Graph for airports
export const createGraph = (flights: any) => {
  const airportsGraph: GraphType = {};

  for (let flight of flights) {
    // Inserts each airport into {} and its neighbors with distances from source to destination airport.
    // Graph should look like {MIA: {CAL: 1000}, .....}

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

export function getAllPossibleRoutes(
  graph: GraphType,
  src: string,
  dest: string
) {
  const result: Array<Array<string | { distance: number }>> = [];
  const visited: any = new Set([]);
  function addPathesToResult(
    graph: GraphType,
    src: string,
    dest: string,
    currNode?: any,
    currPath: any[] = []
  ) {
    let current: any = !currNode ? src : currNode;
    if (currPath.length == 0) {
      currPath = [src];
    }
    if (!visited.has(src)) {
      visited.add(src);
    }
    for (let neighborAIR in graph[current]) {
      let distance: number = 0;
      for (let curr of currPath) {
        if (typeof curr === "object" && curr.distance) {
          distance = curr.distance;
        }
      }
      distance = distance + graph[current][neighborAIR];

      if (!visited.has(neighborAIR)) {
        if (neighborAIR === dest) {
          let currentPath: any = [...currPath, neighborAIR, { distance }];
          currentPath = currentPath.reduce(
            (acc: any, cur: any, i: number) => {
              if (typeof cur === "string") {
                acc.path.push(cur);
              }
              if (typeof cur === "object") {
                acc.distance = Number(cur.distance);
              }
              if (i === currentPath.length - 1) {
                const res = acc.path;

                acc = acc.path.push(Number(acc.distance));
                acc = res;
              }
              return acc;
            },
            { path: [], distance: 0 }
          );
          result.push(currentPath);
        } else {
          let currentPath = [...currPath, neighborAIR, { distance }];
          visited.add(neighborAIR);
          addPathesToResult(graph, src, dest, neighborAIR, currentPath);
        }
      }
    }
  }
  addPathesToResult(graph, dest, src);
  console.log("all paths", result);
  return result;
}
