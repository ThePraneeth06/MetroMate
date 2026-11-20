
import { useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock3,
  MapPin,
  TrainFront,
  Wrench,
  X
} from "lucide-react";

const alertsData = [
  {
    id: 1,
    line: "Red Line",
    color: "#E53935",
    station: "Ameerpet",
    type: "Crowd Advisory",
    severity: "Moderate",
    time: "Demo update",
    title: "High passenger activity expected",
    description:
      "Ameerpet is a busy interchange station. Allow extra time when changing lines, especially during peak hours.",
    icon: AlertTriangle
  },
  {
    id: 2,
    line: "Blue Line",
    color: "#2879D8",
    station: "HITEC City",
    type: "Travel Advisory",
    severity: "Info",
    time: "Demo update",
    title: "Plan ahead for your journey",
    description:
      "Passengers travelling towards HITEC City can check alternative routes before starting their journey.",
    icon: Info
  },
  {
    id: 3,
    line: "Green Line",
    color: "#20A477",
    station: "JBS Parade Ground",
    type: "Maintenance Notice",
    severity: "Notice",
    time: "Demo update",
    title: "Scheduled maintenance notice",
    description:
      "This sample maintenance announcement demonstrates how station-specific notices could appear in MetroMate.",
    icon: Wrench
  },
  {
    id: 4,
    line: "Red Line",
    color: "#E53935",
    station: "Dilsukhnagar",
    type: "Station Advisory",
    severity: "Info",
    time: "Demo update",
    title: "Check station information",
    description:
      "Review your boarding and destination stations before travelling. Keep extra time for busy stations.",
    icon: MapPin
  }
];

const filters = ["All", "Red Line", "Blue Line", "Green Line"];

export default function ServiceAlerts() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [dismissed, setDismissed] = useState([]);

  const visibleAlerts = alertsData.filter((alert) => {
    const matchesFilter =
      activeFilter === "All" || alert.line === activeFilter;

    return matchesFilter && !dismissed.includes(alert.id);
  });

  const dismissAlert = (id) => {
    setDismissed((previous) => [...previous, id]);
  };

  const restoreAlerts = () => {
    setDismissed([]);
    setActiveFilter("All");
  };

  return (
    <section className="service-alerts-section" id="service-alerts">
      <div className="service-alerts-heading">
        <span className="service-alerts-eyebrow">
          <Bell size={15} />
          METRO UPDATES
        </span>

        <h2>Service Alerts & Notifications</h2>

        <p>
          Stay informed about station advisories, maintenance notices
          and travel updates.
        </p>
      </div>

      <div className="service-alerts-summary">
        <div className="alerts-summary-icon">
          <Bell size={23} />
        </div>

        <div>
          <strong>{visibleAlerts.length} Demo Alerts</strong>
          <span>Explore sample passenger notifications</span>
        </div>

        <div className="alerts-demo-label">
          DEMO MODE
        </div>
      </div>

      <div className="service-alerts-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="service-alerts-list">
        {visibleAlerts.length > 0 ? (
          visibleAlerts.map((alert) => {
            const AlertIcon = alert.icon;

            return (
              <article className="service-alert-card" key={alert.id}>
                <div
                  className="service-alert-line"
                  style={{ background: alert.color }}
                />

                <div className="service-alert-icon">
                  <AlertIcon size={21} />
                </div>

                <div className="service-alert-content">
                  <div className="service-alert-meta">
                    <span>{alert.line}</span>
                    <span className={`alert-severity ${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <h3>{alert.title}</h3>

                  <p>{alert.description}</p>

                  <div className="service-alert-location">
                    <span>
                      <MapPin size={14} />
                      {alert.station}
                    </span>

                    <span>
                      <Clock3 size={14} />
                      {alert.time}
                    </span>
                  </div>

                  <small>{alert.type}</small>
                </div>

                <button
                  className="dismiss-alert"
                  onClick={() => dismissAlert(alert.id)}
                  aria-label="Dismiss alert"
                  title="Dismiss alert"
                >
                  <X size={17} />
                </button>
              </article>
            );
          })
        ) : (
          <div className="service-alerts-empty">
            <CheckCircle2 size={35} />
            <h3>No alerts in this view</h3>
            <p>
              All sample alerts are dismissed or there are no alerts
              for the selected line.
            </p>
            <button onClick={restoreAlerts}>
              Restore demo alerts
            </button>
          </div>
        )}
      </div>

      <div className="service-alerts-note">
        <Info size={17} />
        <p>
          Hackathon demo: These are sample notifications, not verified
          live Hyderabad Metro service updates. No real-time alert feed
          is connected.
        </p>
      </div>
    </section>
  );
}
