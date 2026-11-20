
import { useState } from "react";
import {
  Clock,
  ArrowRightLeft,
  Footprints,
  TrainFront,
  CheckCircle2
} from "lucide-react";

export default function AlternativeRoutes({
  routes = [],
  onChooseRoute
}) {
  const [selectedPath, setSelectedPath] = useState(null);

  if (!routes.length) return null;

  const fastestRoute = [...routes].sort(
    (a, b) =>
      a.estimatedTravelTimeMinutes -
      b.estimatedTravelTimeMinutes
  )[0];

  const icons = {
    fastest: Clock,
    "fewest-transfers": ArrowRightLeft,
    "fewest-stops": Footprints
  };

  return (
    <section className="alternative-routes">
      <div className="alternative-heading">
        <div>
          <span className="section-eyebrow">
            SMART JOURNEY PLANNER
          </span>
          <h2>Choose Your Best Route</h2>
          <p>Compare different ways to reach your destination.</p>
        </div>

        <span className="route-count">
          {routes.length} options
        </span>
      </div>

      <div className="alternative-grid">
        {routes.map((route, index) => {
          const Icon = icons[route.id] || TrainFront;
          const pathKey = route.path.join("|");
          const isSelected = selectedPath === pathKey;
          const isRecommended =
            route.path.join("|") === fastestRoute.path.join("|");

          return (
            <article
              key={route.id || index}
              className={`alternative-card ${
                isSelected ? "selected-route" : ""
              }`}
            >
              {isRecommended && (
                <span className="recommended-label">
                  Recommended
                </span>
              )}

              <div className="alternative-card-title">
                <div className="route-icon">
                  <Icon size={21} />
                </div>
                <h3>{route.title}</h3>
              </div>

              <p className="route-description">
                {route.description}
              </p>

              <div className="route-time">
                {route.estimatedTravelTimeMinutes} min
              </div>

              <span className="estimate-label">
                Estimated travel time
              </span>

              <div className="route-stats">
                <div>
                  <strong>{route.totalStops}</strong>
                  <span>Station hops</span>
                </div>

                <div>
                  <strong>{route.transferCount}</strong>
                  <span>Transfers</span>
                </div>

                <div>
                  <strong>₹{route.estimatedFare ?? "—"}</strong>
                  <span>Est. fare</span>
                </div>
              </div>

              <div className="route-lines">
                {route.linesUsed.map((line) => (
                  <span key={line} className={`line-tag ${line}`}>
                    {line.toUpperCase()} LINE
                  </span>
                ))}
              </div>

              <button
                className="choose-route-button"
                onClick={() => {
                  setSelectedPath(pathKey);
                  onChooseRoute?.(route);
                }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 size={17} />
                    Route Selected
                  </>
                ) : (
                  <>
                    Choose This Route
                    <ArrowRightLeft size={17} />
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
