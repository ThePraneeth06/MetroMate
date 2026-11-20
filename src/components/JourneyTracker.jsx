
import { useEffect, useState } from "react";

import {
  TrainFront,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Clock3,
  CheckCircle2,
  Circle,
  Repeat2,
  Flag,
  Zap
} from "lucide-react";

export default function JourneyTracker({ route }) {
  const path = route?.path || [];
  const transfers = route?.transfers || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [route]);

  if (path.length < 2) {
    return null;
  }

  const currentStation = path[currentIndex];
  const nextStation = path[currentIndex + 1];
  const isJourneyComplete = currentIndex === path.length - 1;

  const totalStops = path.length - 1;
  const remainingStops = path.length - 1 - currentIndex;
  const progress = (currentIndex / totalStops) * 100;

  // Demo estimate: approximately 3 minutes per remaining station hop.
  const remainingMinutes = remainingStops * 3;

  const isNextStopInterchange =
    nextStation && transfers.includes(nextStation);

  const formatTime = (minutes) => {
    if (minutes <= 0) return "Arrived";
    if (minutes < 60) return `${minutes} min`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  };

  function goToNextStation() {
    setCurrentIndex((previous) =>
      Math.min(previous + 1, path.length - 1)
    );
  }

  function goToPreviousStation() {
    setCurrentIndex((previous) =>
      Math.max(previous - 1, 0)
    );
  }

  function resetJourney() {
    setCurrentIndex(0);
  }

  return (
    <section className="journey-tracker-section" id="journey-tracker">
      <div className="journey-tracker-heading">
        <div>
          <span className="section-eyebrow">YOUR JOURNEY COMPANION</span>
          <h2>Journey Tracker</h2>
          <p>Follow your route, one station at a time.</p>
        </div>

        <div className="journey-tracker-live-label">
          <span />
          DEMO TRACKING
        </div>
      </div>

      <div className="journey-tracker-card">
        <div className="journey-tracker-top">
          <div className="journey-tracker-route">
            <span>{route.source}</span>
            <ArrowRight size={18} />
            <span>{route.destination}</span>
          </div>

          <div className="journey-tracker-badge">
            <TrainFront size={15} />
            Metro Journey
          </div>
        </div>

        <div className="journey-tracker-progress-area">
          <div className="journey-tracker-progress-info">
            <span>JOURNEY PROGRESS</span>
            <strong>{Math.round(progress)}%</strong>
          </div>

          <div
            className="journey-tracker-progress-track"
            role="progressbar"
            aria-label="Journey progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="journey-tracker-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="journey-tracker-progress-labels">
            <span>{route.source}</span>
            <span>{route.destination}</span>
          </div>
        </div>

        <div className="journey-tracker-current">
          <div className="journey-tracker-current-icon">
            {isJourneyComplete ? (
              <Flag size={25} />
            ) : (
              <TrainFront size={25} />
            )}
          </div>

          <div className="journey-tracker-current-info">
            <span>
              {isJourneyComplete ? "DESTINATION REACHED" : "CURRENT STATION"}
            </span>

            <h3>{currentStation}</h3>

            <p>
              {isJourneyComplete
                ? "You've completed your demo journey. Enjoy your destination!"
                : `Next stop: ${nextStation}`}
            </p>
          </div>

          <div className="journey-tracker-remaining">
            <strong>{remainingStops}</strong>
            <span>stops left</span>
          </div>
        </div>

        {isNextStopInterchange && !isJourneyComplete && (
          <div className="journey-tracker-interchange-alert">
            <div className="journey-tracker-alert-icon">
              <Repeat2 size={20} />
            </div>

            <div>
              <strong>Interchange coming up!</strong>
              <p>
                Your next stop, {nextStation}, is a transfer station.
                Check the connected metro lines before continuing.
              </p>
            </div>
          </div>
        )}

        <div className="journey-tracker-metrics">
          <div>
            <Clock3 size={20} />
            <strong>{formatTime(remainingMinutes)}</strong>
            <span>Estimated time left</span>
          </div>

          <div>
            <MapPin size={20} />
            <strong>{currentIndex + 1}/{path.length}</strong>
            <span>Station progress</span>
          </div>

          <div>
            <Zap size={20} />
            <strong>{transfers.length}</strong>
            <span>Total transfers</span>
          </div>
        </div>

        <div className="journey-tracker-stop-list">
          <div className="journey-tracker-stop-heading">
            <h4>Your station sequence</h4>
            <span>{path.length} stations</span>
          </div>

          <div className="journey-tracker-stops">
            {path.map((station, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isTransfer = transfers.includes(station);

              return (
                <div
                  className={`journey-tracker-stop ${
                    isCompleted ? "stop-completed" : ""
                  } ${isCurrent ? "stop-current" : ""}`}
                  key={`${station}-${index}`}
                >
                  <div className="journey-tracker-stop-marker">
                    {isCompleted ? (
                      <CheckCircle2 size={19} />
                    ) : isCurrent ? (
                      <span className="current-stop-dot" />
                    ) : (
                      <Circle size={17} />
                    )}

                    {index !== path.length - 1 && (
                      <span className="journey-tracker-stop-line" />
                    )}
                  </div>

                  <div className="journey-tracker-stop-name">
                    <strong>{station}</strong>

                    {isCurrent && (
                      <span className="stop-status-label">
                        CURRENT
                      </span>
                    )}

                    {isTransfer && (
                      <span className="stop-transfer-label">
                        <Repeat2 size={12} />
                        INTERCHANGE
                      </span>
                    )}
                  </div>

                  {isCompleted && (
                    <span className="stop-done-label">Passed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="journey-tracker-controls">
          <button
            className="journey-tracker-previous"
            onClick={goToPreviousStation}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={17} />
            Previous stop
          </button>

          {isJourneyComplete ? (
            <button
              className="journey-tracker-next"
              onClick={resetJourney}
            >
              <TrainFront size={17} />
              Restart demo
            </button>
          ) : (
            <button
              className="journey-tracker-next"
              onClick={goToNextStation}
            >
              Next stop
              <ArrowRight size={17} />
            </button>
          )}
        </div>

        <p className="journey-tracker-disclaimer">
          Demo mode: Use the controls to simulate progress. Remaining
          time is an approximate estimate, not a live train arrival prediction.
        </p>
      </div>
    </section>
  );
}
