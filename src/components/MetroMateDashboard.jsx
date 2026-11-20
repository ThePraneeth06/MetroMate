
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  Route,
  TrainFront,
  Wallet,
  Zap,
  Users,
  Map
} from "lucide-react";

import {
  stations,
  metroLines,
  interchangeStations
} from "../data/metroData";

export default function MetroMateDashboard() {
  const quickActions = [
    {
      title: "Plan a Journey",
      description: "Find the best route between stations.",
      icon: Route,
      link: "#planner",
      className: "dashboard-action-primary"
    },
    {
      title: "Nearby Stations",
      description: "Discover metro stations around you.",
      icon: MapPin,
      link: "#nearby-stations"
    },
    {
      title: "Check Crowd Levels",
      description: "Explore estimated station crowd levels.",
      icon: Users,
      link: "#crowd-indicator"
    },
    {
      title: "Explore Metro Map",
      description: "See how the metro lines connect.",
      icon: Map,
      link: "#network-map"
    }
  ];

  const stats = [
    {
      label: "Metro Lines",
      value: metroLines.length,
      icon: TrainFront,
      note: "Red, Blue and Green"
    },
    {
      label: "Stations",
      value: stations.length,
      icon: MapPin,
      note: "In the current dataset"
    },
    {
      label: "Interchange Stations",
      value: interchangeStations.length,
      icon: ArrowUpRight,
      note: "Connect multiple lines"
    },
    {
      label: "Travel Companion",
      value: "AI",
      icon: Zap,
      note: "MetroMate Assistant"
    }
  ];

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="section-eyebrow">YOUR METRO OVERVIEW</span>
          <h2>Your journey starts here.</h2>
          <p>
            Everything you need to explore Hyderabad Metro,
            all in one place.
          </p>
        </div>

        <a href="#planner" className="dashboard-heading-link">
          Plan a journey <ArrowRight size={17} />
        </a>
      </div>

      <div className="dashboard-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="dashboard-stat-card" key={stat.label}>
              <div className="dashboard-stat-top">
                <span>{stat.label}</span>
                <div className="dashboard-stat-icon">
                  <Icon size={20} />
                </div>
              </div>

              <strong className="dashboard-stat-value">
                {stat.value}
              </strong>

              <span className="dashboard-stat-note">
                {stat.note}
              </span>
            </article>
          );
        })}
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-quick-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span className="section-eyebrow">QUICK ACCESS</span>
              <h3>What would you like to do?</h3>
            </div>
            <Zap size={21} />
          </div>

          <div className="dashboard-actions-grid">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <a
                  href={action.link}
                  className={`dashboard-action-card ${action.className || ""}`}
                  key={action.title}
                >
                  <div className="dashboard-action-icon">
                    <Icon size={21} />
                  </div>

                  <div>
                    <strong>{action.title}</strong>
                    <p>{action.description}</p>
                  </div>

                  <ArrowUpRight
                    className="dashboard-action-arrow"
                    size={18}
                  />
                </a>
              );
            })}
          </div>
        </div>

        <div className="dashboard-tip-panel">
          <div className="dashboard-tip-icon">
            <TrainFront size={25} />
          </div>

          <span className="section-eyebrow">METROMATE TIP</span>

          <h3>Travel smarter, not harder.</h3>

          <p>
            Compare alternative routes before starting your journey.
            A route with fewer transfers may make your trip simpler.
          </p>

          <a href="#metromate-assistant">
            Ask MetroMate Assistant <ArrowRight size={17} />
          </a>

          <div className="dashboard-tip-decoration">
            <Route size={100} />
          </div>
        </div>
      </div>

      <div className="dashboard-lines-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span className="section-eyebrow">EXPLORE THE NETWORK</span>
            <h3>Hyderabad Metro Lines</h3>
          </div>

          <a href="#network-map" className="dashboard-view-map">
            View network map <ArrowRight size={16} />
          </a>
        </div>

        <div className="dashboard-line-grid">
          {metroLines.map((line) => (
            <article
              className="dashboard-line-card"
              key={line.id}
              style={{ "--dashboard-line-color": line.color }}
            >
              <div className="dashboard-line-card-top">
                <span className="dashboard-line-dot" />
                <span>{line.name}</span>
                <span className="dashboard-line-count">
                  {line.stations.length} stations
                </span>
              </div>

              <div className="dashboard-line-endpoints">
                <div>
                  <span>START</span>
                  <strong>{line.from}</strong>
                </div>

                <ArrowRight size={19} />

                <div>
                  <span>END</span>
                  <strong>{line.to}</strong>
                </div>
              </div>

              <div className="dashboard-line-progress">
                <span
                  style={{
                    width: "100%",
                    backgroundColor: line.color
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="dashboard-bottom-note">
        <div className="dashboard-bottom-icon">
          <Clock3 size={19} />
        </div>
        <p>
          <strong>Plan before you travel.</strong>
          Journey times, fares and crowd levels shown in MetroMate
          are estimates or demo data, not official live metro information.
        </p>
        <a href="#planner" aria-label="Go to journey planner">
          <ArrowRight size={19} />
        </a>
      </div>
    </section>
  );
}
