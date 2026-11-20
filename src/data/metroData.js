
export const metroLines = [
  {
    id: "red",
    name: "Red Line",
    color: "#E53935",
    from: "Miyapur",
    to: "LB Nagar",
    stations: [
      "Miyapur",
      "JNTU College",
      "KPHB Colony",
      "Kukatpally",
      "Dr. B. R. Ambedkar Balanagar",
      "Moosapet",
      "Bharat Nagar",
      "Erragadda",
      "ESI Hospital",
      "S.R. Nagar",
      "Ameerpet",
      "Punjagutta",
      "Irrum Manzil",
      "Khairatabad",
      "Lakdi-ka-pul",
      "Assembly",
      "Nampally",
      "Gandhi Bhavan",
      "Osmania Medical College",
      "MG Bus Station",
      "Malakpet",
      "New Market",
      "Musarambagh",
      "Dilsukhnagar",
      "Chaitanyapuri",
      "Victoria Memorial",
      "LB Nagar"
    ]
  },

  {
    id: "blue",
    name: "Blue Line",
    color: "#2879D8",
    from: "Nagole",
    to: "Raidurg",
    stations: [
      "Nagole",
      "Uppal",
      "Stadium",
      "NGRI",
      "Habsiguda",
      "Tarnaka",
      "Mettuguda",
      "Secunderabad East",
      "Parade Ground",
      "Paradise",
      "Rasoolpura",
      "Prakash Nagar",
      "Begumpet",
      "Ameerpet",
      "Madhura Nagar",
      "Yusufguda",
      "Road No. 5 Jubilee Hills",
      "Jubilee Hills Check Post",
      "Peddamma Gudi",
      "Madhapur",
      "Durgam Cheruvu",
      "HITEC City",
      "Raidurg"
    ]
  },

  {
    id: "green",
    name: "Green Line",
    color: "#20A477",
    from: "JBS Parade Ground",
    to: "MG Bus Station",
    stations: [
      "JBS Parade Ground",
      "Secunderabad West",
      "Gandhi Hospital",
      "Musheerabad",
      "RTC X Roads",
      "Chikkadpally",
      "Narayanaguda",
      "Sultan Bazaar",
      "MG Bus Station"
    ]
  }
];

// Get all unique stations from all three lines.
export const stations = [
  ...new Set(
    metroLines.flatMap((line) => line.stations)
  )
].sort((a, b) => a.localeCompare(b));

// Get details about every station.
export const stationDetails = stations.map((station) => {
  const connectedLines = metroLines.filter((line) =>
    line.stations.includes(station)
  );

  return {
    id: station
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),

    name: station,

    lines: connectedLines.map((line) => line.name),

    lineColors: connectedLines.map((line) => line.color),

    isInterchange: connectedLines.length > 1
  };
});

// Find a station by its name.
export function getStationDetails(stationName) {
  return stationDetails.find(
    (station) => station.name === stationName
  );
}

// Get all stations belonging to a particular line.
export function getStationsByLine(lineId) {
  const line = metroLines.find(
    (item) => item.id === lineId
  );

  return line ? line.stations : [];
}

// Get all interchange stations.
export const interchangeStations = stationDetails.filter(
  (station) => station.isInterchange
);
