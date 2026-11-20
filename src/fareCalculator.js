
const fareSlabs = [
  { max: 2, fare: 11 },
  { max: 4, fare: 17 },
  { max: 6, fare: 28 },
  { max: 9, fare: 37 },
  { max: 12, fare: 47 },
  { max: 15, fare: 51 },
  { max: 18, fare: 56 },
  { max: 21, fare: 61 },
  { max: 24, fare: 65 },
  { max: Infinity, fare: 69 }
];

export function calculateFare(distanceKm) {
  if (typeof distanceKm !== "number" || distanceKm < 0) {
    return null;
  }

  return fareSlabs.find(slab => distanceKm <= slab.max)?.fare ?? null;
}
