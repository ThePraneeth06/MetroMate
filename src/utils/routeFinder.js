
import { metroLines } from "../data/metroData";
import { calculateFare } from "../fareRules";

const interchangeConnections = [
  ["Parade Ground", "JBS Parade Ground"]
];

const MINUTES_PER_STATION_HOP = 3;
const MINUTES_PER_INTERCHANGE = 5;

function buildGraph() {
  const graph = new Map();

  function addStation(station) {
    if (!graph.has(station)) {
      graph.set(station, []);
    }
  }

  function addConnection(from, to, weight, line, type) {
    addStation(from);
    addStation(to);

    graph.get(from).push({ station: to, weight, line, type });
    graph.get(to).push({ station: from, weight, line, type });
  }

  metroLines.forEach((line) => {
    line.stations.forEach((station, index) => {
      addStation(station);

      if (index < line.stations.length - 1) {
        addConnection(
          station,
          line.stations[index + 1],
          1,
          line.id,
          "train"
        );
      }
    });
  });

  interchangeConnections.forEach(([from, to]) => {
    addConnection(from, to, 0.5, null, "interchange");
  });

  return graph;
}

function buildRouteResult(source, destination, path, pathEdges) {
  const trainEdges = pathEdges.filter(
    (edge) => edge.type === "train"
  );

  const totalStops = trainEdges.length;
  const linesUsed = [];

  pathEdges.forEach((edge) => {
    if (
      edge.type === "train" &&
      !linesUsed.includes(edge.line)
    ) {
      linesUsed.push(edge.line);
    }
  });

  const transfers = [];

  for (let i = 1; i < pathEdges.length; i++) {
    const previousEdge = pathEdges[i - 1];
    const currentEdge = pathEdges[i];

    if (
      previousEdge.type === "train" &&
      currentEdge.type === "train" &&
      previousEdge.line !== currentEdge.line
    ) {
      transfers.push(path[i]);
    }
  }

  pathEdges.forEach((edge, index) => {
    if (edge.type === "interchange") {
      transfers.push(path[index]);
    }
  });

  const estimatedDistanceKm = totalStops * 1.5;

  const estimatedFare = calculateFare(estimatedDistanceKm);

  const estimatedTravelTimeMinutes =
    totalStops * MINUTES_PER_STATION_HOP +
    transfers.length * MINUTES_PER_INTERCHANGE;

  return {
    source,
    destination,
    path,
    pathEdges,
    totalStops,
    transferCount: transfers.length,
    transfers,
    linesUsed,
    estimatedDistanceKm,
    estimatedFare,
    estimatedTravelTimeMinutes
  };
}

// Existing shortest route function
export function findShortestRoute(source, destination) {
  if (!source || !destination || source === destination) {
    return null;
  }

  const graph = buildGraph();

  if (!graph.has(source) || !graph.has(destination)) {
    return null;
  }

  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set(graph.keys());

  graph.forEach((_, station) => {
    distances.set(station, Infinity);
  });

  distances.set(source, 0);

  while (unvisited.size > 0) {
    let current = null;
    let shortestDistance = Infinity;

    for (const station of unvisited) {
      if (distances.get(station) < shortestDistance) {
        shortestDistance = distances.get(station);
        current = station;
      }
    }

    if (current === null) break;
    if (current === destination) break;

    unvisited.delete(current);

    for (const edge of graph.get(current)) {
      if (!unvisited.has(edge.station)) continue;

      const newDistance = distances.get(current) + edge.weight;

      if (newDistance < distances.get(edge.station)) {
        distances.set(edge.station, newDistance);

        previous.set(edge.station, {
          station: current,
          edge
        });
      }
    }
  }

  if (!previous.has(destination)) {
    return null;
  }

  const path = [destination];
  const pathEdges = [];
  let current = destination;

  while (current !== source) {
    const previousStep = previous.get(current);

    if (!previousStep) return null;

    pathEdges.unshift(previousStep.edge);
    current = previousStep.station;
    path.unshift(current);
  }

  return buildRouteResult(source, destination, path, pathEdges);
}

// Find the best path for a particular travel preference
function findRouteByPreference(source, destination, preference) {
  const graph = buildGraph();

  if (!graph.has(source) || !graph.has(destination)) {
    return null;
  }

  const queue = [{
    station: source,
    path: [source],
    pathEdges: [],
    currentLine: null,
    score: 0
  }];

  let expansions = 0;
  const MAX_EXPANSIONS = 5000;

  while (queue.length > 0 && expansions < MAX_EXPANSIONS) {
    queue.sort((a, b) => a.score - b.score);

    const current = queue.shift();
    expansions++;

    if (current.station === destination) {
      return buildRouteResult(
        source,
        destination,
        current.path,
        current.pathEdges
      );
    }

    for (const edge of graph.get(current.station)) {
      // Avoid loops in a candidate journey
      if (current.path.includes(edge.station)) {
        continue;
      }

      let extraCost = 0;
      let nextLine = current.currentLine;

      if (edge.type === "train") {
        if (
          current.currentLine &&
          current.currentLine !== edge.line
        ) {
          if (preference === "transfers") {
            extraCost += 100;
          } else if (preference === "time") {
            extraCost += MINUTES_PER_INTERCHANGE;
          }
        }

        if (preference === "time") {
          extraCost += MINUTES_PER_STATION_HOP;
        } else {
          extraCost += 1;
        }

        nextLine = edge.line;
      } else {
        if (preference === "transfers") {
          extraCost += 100;
        } else if (preference === "time") {
          extraCost += MINUTES_PER_INTERCHANGE;
        } else {
          extraCost += 0.5;
        }

        nextLine = null;
      }

      queue.push({
        station: edge.station,
        path: [...current.path, edge.station],
        pathEdges: [...current.pathEdges, edge],
        currentLine: nextLine,
        score: current.score + extraCost
      });
    }
  }

  return null;
}

// NEW: Generate alternative route suggestions
export function findAlternativeRoutes(source, destination) {
  if (!source || !destination || source === destination) {
    return [];
  }

  const preferences = [
    {
      id: "fastest",
      title: "Fastest Route",
      description: "Prioritizes estimated travel time",
      preference: "time"
    },
    {
      id: "fewest-transfers",
      title: "Fewest Transfers",
      description: "Prioritizes fewer line changes",
      preference: "transfers"
    },
    {
      id: "fewest-stops",
      title: "Fewest Station Hops",
      description: "Prioritizes fewer station hops",
      preference: "stops"
    }
  ];

  const results = [];
  const seenPaths = new Set();

  preferences.forEach((item) => {
    const result = findRouteByPreference(
      source,
      destination,
      item.preference
    );

    if (!result) return;

    const pathKey = result.path.join("|");

    // Avoid displaying duplicate journeys
    if (seenPaths.has(pathKey)) return;

    seenPaths.add(pathKey);

    results.push({
      ...result,
      id: item.id,
      title: item.title,
      description: item.description
    });
  });

  return results;
}
