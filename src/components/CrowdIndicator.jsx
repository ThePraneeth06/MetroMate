
import { useState } from "react";
import {
  Users,
  Activity,
  Clock,
  Info,
  Sun,
  Moon,
  Sunrise
} from "lucide-react";
import { stationDetails } from "../data/metroData";

const demoCrowdData = {
  "Ameerpet": "High",
  "MG Bus Station": "High",
  "Parade Ground": "High",
  "HITEC City": "High",
  "Miyapur": "Medium",
  "Kukatpally": "Medium",
  "Raidurg": "Medium",
  "Secunderabad East": "Medium",
  "Nagole": "Low",
  "Uppal": "Low",
  "JBS Parade Ground": "Medium",
  "Dilsukhnagar": "High"
};

const levels = ["Low", "Medium", "High"];

function getTimePeriod(time) {
  const hour = Number(time.split(":")[0]);

  if ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 20)) {
    return {
      name: "Rush Hour",
      description: "Higher passenger demand expected",
      adjustment: 1,
      icon: "rush"
    };
  }

  if ((hour >= 11 && hour < 16) || hour >= 20 || hour < 6) {
    return {
      name: "Off-Peak Hours",
      description: "Lower passenger demand expected",
      adjustment: -1,
      icon: "offpeak"
    };
  }

  return {
    name: "Regular Hours",
    description: "Normal passenger demand expected",
    adjustment: 0,
    icon: "regular"
  };
}

function getCrowdLevel(station, adjustment) {
  const baseLevel = demoCrowdData[station] || "Low";
  const baseIndex = levels.indexOf(baseLevel);
  const adjustedIndex = Math.max(
    0,
    Math.min(2, baseIndex + adjustment)
  );

  return levels[adjustedIndex];
}

export default function CrowdIndicator() {
  const [filter, setFilter] = useState("All");
  const [selectedTime, setSelectedTime] = useState("08:30");

  const period = getTimePeriod(selectedTime);

  const crowdStations = stationDetails
    .map((station) => ({
      ...station,
      crowd: getCrowdLevel(station.name, period.adjustment)
    }))
    .filter(
      (station) => filter === "All" || station.crowd === filter
    );

  const counts = {
    Low: crowdStations.filter((station) => station.crowd === "Low").length,
    Medium: crowdStations.filter((station) => station.crowd === "Medium").length,
    High: crowdStations.filter((station) => station.crowd === "High").length
  };

  return (
    <section className="crowd-section" id="crowd">
      <div className="section-heading">
        <span className="eyebrow">SMART STATION INSIGHTS</span>
        <h2>Metro Crowd Monitor</h2>
        <p>Explore estimated crowd levels at different times of day.</p>
      </div>

      <div className="crowd-demo-notice">
        <Info size={18} />
        <span>
          Hackathon demo: Crowd levels are simulated estimates,
          not live passenger counts.
        </span>
      </div>

      <div className="crowd-time-panel">
        <div className="crowd-time-title">
          <div className="crowd-time-icon">
            <Clock size={22} />
          </div>
          <div>
            <h3>Select Journey Time</h3>
            <p>Change the time to see estimated crowd levels update.</p>
          </div>
        </div>

        <input
          type="time"
          value={selectedTime}
          onChange={(event) => {
            setSelectedTime(event.target.value);
            setFilter("All");
          }}
          className="crowd-time-input"
        />

        <div className={`crowd-period ${period.icon}`}>
          {period.icon === "rush" ? (
            <Sunrise size={20} />
          ) : period.icon === "offpeak" ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}

          <div>
            <strong>{period.name}</strong>
            <span>{period.description}</span>
          </div>
        </div>
      </div>

      <div className="crowd-summary">
        <div className="crowd-summary-card">
          <Users size={22} />
          <strong>{stationDetails.length}</strong>
          <span>Stations monitored</span>
        </div>

        <div className="crowd-summary-card low">
          <span className="crowd-dot" />
          <strong>{counts.Low}</strong>
          <span>Low crowd</span>
        </div>

        <div className="crowd-summary-card medium">
          <span className="crowd-dot" />
          <strong>{counts.Medium}</strong>
          <span>Medium crowd</span>
        </div>

        <div className="crowd-summary-card high">
          <span className="crowd-dot" />
          <strong>{counts.High}</strong>
          <span>High crowd</span>
        </div>
      </div>

      <div className="crowd-list-header">
        <div>
          <h3>Station Crowd Levels</h3>
          <p>Estimated crowd at {selectedTime}</p>
        </div>
        <Activity size={25} />
      </div>

      <div className="crowd-filters">
        {["All", "Low", "Medium", "High"].map((level) => (
          <button
            key={level}
            className={filter === level ? "active-crowd-filter" : ""}
            onClick={() => setFilter(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="crowd-station-grid">
        {crowdStations.map((station) => (
          <article className="crowd-station-card" key={station.id}>
            <div className="crowd-station-top">
              <div className="crowd-station-icon">
                <Users size={19} />
              </div>

              <span className={`crowd-badge ${station.crowd.toLowerCase()}`}>
                {station.crowd}
              </span>
            </div>

            <h4>{station.name}</h4>

            <div className="crowd-line-tags">
              {station.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>

            <div className="crowd-meter">
              <div
                className={`crowd-meter-fill ${station.crowd.toLowerCase()}`}
                style={{
                  width:
                    station.crowd === "High"
                      ? "90%"
                      : station.crowd === "Medium"
                        ? "55%"
                        : "25%"
                }}
              />
            </div>

            <div className="crowd-card-footer">
              <Clock size={13} />
              <span>Simulated estimate · {selectedTime}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
