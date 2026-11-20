
import { useMemo, useState } from "react";
import {
  BrainCircuit,
  Clock3,
  IndianRupee,
  ArrowRight,
  Repeat2,
  Users,
  Sparkles,
  CheckCircle2
} from "lucide-react";

const busyStations = [
  "Ameerpet",
  "MG Bus Station",
  "Parade Ground",
  "HITEC City",
  "Dilsukhnagar"
];

function getCrowdPeriod(time) {
  const hour = Number(time.split(":")[0]);

  if ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 20)) {
    return "rush";
  }

  if (hour >= 20 || hour < 6) {
    return "quiet";
  }

  return "normal";
}

function getPathStations(route) {
  if (!Array.isArray(route.path)) return [];

  return route.path.map((item) =>
    typeof item === "string" ? item : item?.station
  ).filter(Boolean);
}

function getCrowdPenalty(route, period) {
  const stationsOnRoute = getPathStations(route);
  const busyCount = stationsOnRoute.filter((station) =>
    busyStations.includes(station)
  ).length;

  if (period === "rush") return busyCount * 3;
  if (period === "quiet") return busyCount * 0.5;
  return busyCount * 1.5;
}

function getRecommendation(routes, period) {
  if (!routes.length) return null;

  const values = routes.map((route) => ({
    route,
    time: Number(route.estimatedTravelTimeMinutes) || 0,
    transfers: Number(route.transferCount) || 0,
    fare: Number(route.estimatedFare) || 0,
    crowd: getCrowdPenalty(route, period)
  }));

  const minMax = (key) => {
    const numbers = values.map((item) => item[key]);
    return {
      min: Math.min(...numbers),
      max: Math.max(...numbers)
    };
  };

  const ranges = {
    time: minMax("time"),
    transfers: minMax("transfers"),
    fare: minMax("fare"),
    crowd: minMax("crowd")
  };

  const normalize = (value, range) => {
    if (range.max === range.min) return 0;
    return (value - range.min) / (range.max - range.min);
  };

  const ranked = values.map((item) => {
    const score =
      normalize(item.time, ranges.time) * 0.4 +
      normalize(item.transfers, ranges.transfers) * 0.25 +
      normalize(item.crowd, ranges.crowd) * 0.25 +
      normalize(item.fare, ranges.fare) * 0.1;

    return { ...item, score };
  });

  ranked.sort((a, b) => a.score - b.score);
  return ranked[0];
}

export default function SmartJourneyRecommendations({
  routes = [],
  onChooseRoute
}) {
  const [departureTime, setDepartureTime] = useState("08:30");

  const period = getCrowdPeriod(departureTime);

  const recommendation = useMemo(
    () => getRecommendation(routes, period),
    [routes, period]
  );

  if (!routes.length || !recommendation) return null;

  const { route, crowd } = recommendation;

  const periodLabel =
    period === "rush"
      ? "Rush hour"
      : period === "quiet"
      ? "Quieter period"
      : "Regular hours";

  const routeStations = getPathStations(route);
  const busyCount = routeStations.filter((station) =>
    busyStations.includes(station)
  ).length;

  return (
    <section className="smart-journey-section">
      <div className="smart-journey-heading">
        <div>
          <span className="smart-journey-eyebrow">
            <Sparkles size={15} /> INTELLIGENT TRAVEL ASSISTANT
          </span>
          <h2>Smart Journey Recommendation</h2>
          <p>
            We compare your route options and suggest a balanced journey.
          </p>
        </div>

        <div className="smart-brain-icon">
          <BrainCircuit size={27} />
        </div>
      </div>

      <div className="smart-time-panel">
        <div>
          <strong>When are you travelling?</strong>
          <span>Change the time to update the crowd estimate.</span>
        </div>

        <input
          type="time"
          value={departureTime}
          onChange={(event) => setDepartureTime(event.target.value)}
          aria-label="Journey departure time"
        />
      </div>

      <div className="smart-period-label">
        <span className={`smart-period-dot ${period}`} />
        {periodLabel} · {departureTime}
      </div>

      <div className="smart-recommendation-card">
        <div className="smart-recommended-label">
          <CheckCircle2 size={16} />
          BEST BALANCED ROUTE
        </div>

        <h3>{route.title || "Recommended route"}</h3>
        <p className="smart-route-description">
          {route.description ||
            "This route offers a good balance of time, transfers, fare and estimated crowd conditions."}
        </p>

        <div className="smart-metrics">
          <div className="smart-metric">
            <Clock3 size={19} />
            <strong>{route.estimatedTravelTimeMinutes ?? "—"} min</strong>
            <span>Estimated time</span>
          </div>

          <div className="smart-metric">
            <Repeat2 size={19} />
            <strong>{route.transferCount ?? 0}</strong>
            <span>Transfers</span>
          </div>

          <div className="smart-metric">
            <IndianRupee size={19} />
            <strong>{route.estimatedFare ?? "—"}</strong>
            <span>Estimated fare</span>
          </div>

          <div className="smart-metric">
            <Users size={19} />
            <strong>{crowd === 0 ? "Lower" : crowd <= 3 ? "Moderate" : "Higher"}</strong>
            <span>Estimated crowd</span>
          </div>
        </div>

        <div className="smart-reason">
          <Sparkles size={17} />
          <span>
            This option scores well across travel time, transfers, fare and
            estimated crowd conditions for your selected departure time.
          </span>
        </div>

        <button
          className="smart-choose-button"
          onClick={() => onChooseRoute?.(route)}
        >
          Choose this route <ArrowRight size={17} />
        </button>
      </div>

      <p className="smart-demo-note">
        Demo feature: crowd levels are simulated using selected time and
        example busy stations. They are not live passenger counts or official
        metro predictions.
      </p>
    </section>
  );
}
