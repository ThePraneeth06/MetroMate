
import { useState } from "react";
import { metroLines, getStationDetails } from "../data/metroData";
import { TrainFront, X, ArrowLeftRight } from "lucide-react";

const LINE_Y = {
  red: 170,
  blue: 410,
  green: 650
};

const START_X = 100;
const GAP = 64;

function getPoint(lineId, stationName) {
  const line = metroLines.find((item) => item.id === lineId);
  if (!line) return null;

  const index = line.stations.indexOf(stationName);
  if (index === -1) return null;

  return {
    x: START_X + index * GAP,
    y: LINE_Y[lineId]
  };
}

export default function MetroNetworkMap() {
  const [style, setStyle] = useState("classic");
  const [selectedStation, setSelectedStation] = useState(null);

  const modern = style === "modern";

  const colors = {
    red: "#E53935",
    blue: "#2879D8",
    green: "#20A477"
  };

  const background = modern ? "#101827" : "#ffffff";
  const textColor = modern ? "#f8fafc" : "#172554";
  const mutedColor = modern ? "#a8b5c9" : "#64748b";
  const borderColor = modern ? "#334155" : "#e2e8f0";

  const interchangeLinks = [
    {
      fromLine: "red",
      from: "Ameerpet",
      toLine: "blue",
      to: "Ameerpet",
      label: "Ameerpet"
    },
    {
      fromLine: "red",
      from: "MG Bus Station",
      toLine: "green",
      to: "MG Bus Station",
      label: "MG Bus Station"
    },
    {
      fromLine: "blue",
      from: "Parade Ground",
      toLine: "green",
      to: "JBS Parade Ground",
      label: "Parade Ground / JBS"
    }
  ];

  const stationInfo = selectedStation
    ? getStationDetails(selectedStation)
    : null;

  return (
    <section
      id="network-map"
      style={{
        padding: "70px 5%",
        background: modern ? "#0b1220" : "#f5f7fb",
        color: textColor,
        transition: "background 0.25s ease"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <div className="section-heading">
          <span className="eyebrow">METRO NETWORK</span>
          <h2 style={{ color: textColor }}>
            Explore the Hyderabad Metro Map
          </h2>
          <p style={{ color: mutedColor }}>
            View all three lines and click any station to explore it.
          </p>
        </div>

        {/* MAP STYLE SWITCH */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "28px 0"
          }}
        >
          <button
            onClick={() => setStyle("classic")}
            style={{
              padding: "11px 20px",
              borderRadius: "25px",
              border: "1px solid " + borderColor,
              cursor: "pointer",
              background: !modern ? "#172554" : "transparent",
              color: !modern ? "#fff" : textColor,
              fontWeight: "bold"
            }}
          >
            ☀ Classic Map
          </button>

          <button
            onClick={() => setStyle("modern")}
            style={{
              padding: "11px 20px",
              borderRadius: "25px",
              border: "1px solid " + borderColor,
              cursor: "pointer",
              background: modern ? "#2563eb" : "transparent",
              color: modern ? "#fff" : textColor,
              fontWeight: "bold"
            }}
          >
            ✨ Modern Map
          </button>
        </div>

        {/* LINE LEGEND */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "22px",
            marginBottom: "22px"
          }}
        >
          {metroLines.map((line) => (
            <div
              key={line.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: textColor,
                fontWeight: "bold",
                fontSize: "13px"
              }}
            >
              <span
                style={{
                  width: "25px",
                  height: "6px",
                  borderRadius: "10px",
                  background: line.color
                }}
              />
              {line.name}
            </div>
          ))}
        </div>

        {/* SCROLLABLE NETWORK MAP */}
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            borderRadius: "18px",
            border: "1px solid " + borderColor,
            background,
            boxShadow: modern
              ? "0 0 30px rgba(37,99,235,0.12)"
              : "0 8px 30px rgba(15,23,42,0.06)"
          }}
        >
          <svg
            viewBox="0 0 1900 790"
            style={{
              display: "block",
              width: "1900px",
              maxWidth: "none",
              height: "auto"
            }}
            role="img"
            aria-label="Schematic Hyderabad Metro network map"
          >
            {/* INTERCHANGE CONNECTIONS */}
            {interchangeLinks.map((link) => {
              const from = getPoint(link.fromLine, link.from);
              const to = getPoint(link.toLine, link.to);

              if (!from || !to) return null;

              return (
                <g key={link.label}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={modern ? "#facc15" : "#64748b"}
                    strokeWidth="4"
                    strokeDasharray="9 8"
                    opacity="0.9"
                  />

                  <circle
                    cx={(from.x + to.x) / 2}
                    cy={(from.y + to.y) / 2}
                    r="6"
                    fill={modern ? "#facc15" : "#64748b"}
                  />
                </g>
              );
            })}

            {/* METRO LINES */}
            {metroLines.map((line) => {
              const y = LINE_Y[line.id];

              const points = line.stations
                .map((station, index) =>
                  `${START_X + index * GAP},${y}`
                )
                .join(" ");

              return (
                <g key={line.id}>
                  <text
                    x={START_X}
                    y={y - 75}
                    fill={textColor}
                    fontSize="25"
                    fontWeight="bold"
                  >
                    {line.name}
                  </text>

                  <polyline
                    points={points}
                    fill="none"
                    stroke={line.color}
                    strokeWidth={modern ? "12" : "9"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      filter: modern
                        ? `drop-shadow(0 0 9px ${line.color})`
                        : "none"
                    }}
                  />

                  {/* STATIONS */}
                  {line.stations.map((station, index) => {
                    const x = START_X + index * GAP;
                    const stationDetails = getStationDetails(station);
                    const isInterchange =
                      stationDetails?.isInterchange ||
                      interchangeLinks.some(
                        (link) =>
                          (link.fromLine === line.id &&
                            link.from === station) ||
                          (link.toLine === line.id &&
                            link.to === station)
                      );

                    const labelY =
                      index % 2 === 0 ? y - 24 : y + 36;

                    const isSelected = selectedStation === station;

                    return (
                      <g
                        key={`${line.id}-${station}`}
                        onClick={() => setSelectedStation(station)}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            setSelectedStation(station);
                          }
                        }}
                        role="button"
                        tabIndex="0"
                        aria-label={`View ${station} station`}
                        style={{ cursor: "pointer" }}
                      >
                        {isInterchange && (
                          <circle
                            cx={x}
                            cy={y}
                            r="13"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="3"
                          />
                        )}

                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "10" : "7"}
                          fill={modern ? "#ffffff" : "#ffffff"}
                          stroke={line.color}
                          strokeWidth="4"
                        />

                        {isSelected && (
                          <circle
                            cx={x}
                            cy={y}
                            r="17"
                            fill="none"
                            stroke={line.color}
                            strokeWidth="2"
                          />
                        )}

                        <text
                          x={x}
                          y={labelY}
                          fill={textColor}
                          fontSize="11"
                          fontWeight={isInterchange ? "bold" : "500"}
                          textAnchor="middle"
                        >
                          {station}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* INTERCHANGE KEY */}
            <g transform="translate(100, 755)">
              <circle
                cx="0"
                cy="0"
                r="9"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
              />
              <text
                x="20"
                y="5"
                fill={mutedColor}
                fontSize="13"
              >
                Interchange station
              </text>

              <line
                x1="220"
                y1="0"
                x2="270"
                y2="0"
                stroke={modern ? "#facc15" : "#64748b"}
                strokeWidth="4"
                strokeDasharray="8 6"
              />
              <text
                x="282"
                y="5"
                fill={mutedColor}
                fontSize="13"
              >
                Walking connection
              </text>
            </g>
          </svg>
        </div>

        <p
          style={{
            color: mutedColor,
            textAlign: "center",
            fontSize: "12px",
            marginTop: "12px"
          }}
        >
          This is a schematic, horizontally scrollable network diagram,
          not a geographically accurate map.
        </p>

        {/* SELECTED STATION DETAILS */}
        {selectedStation && (
          <div
            style={{
              margin: "25px auto 0",
              maxWidth: "650px",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid " + borderColor,
              background,
              color: textColor
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: mutedColor,
                    letterSpacing: "1px"
                  }}
                >
                  SELECTED METRO STATION
                </span>

                <h3 style={{ margin: "7px 0" }}>
                  <TrainFront
                    size={20}
                    style={{
                      display: "inline",
                      verticalAlign: "middle",
                      marginRight: "8px"
                    }}
                  />
                  {selectedStation}
                </h3>
              </div>

              <button
                onClick={() => setSelectedStation(null)}
                aria-label="Close station details"
                style={{
                  border: "1px solid " + borderColor,
                  background: "transparent",
                  color: textColor,
                  borderRadius: "50%",
                  padding: "8px",
                  cursor: "pointer"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: mutedColor, fontSize: "14px" }}>
              {stationInfo?.isInterchange
                ? "This station connects multiple metro lines."
                : "This station is served by the following metro line."}
            </p>

            <div
              style={{
                display: "flex",
                gap: "9px",
                flexWrap: "wrap",
                marginTop: "15px"
              }}
            >
              {(stationInfo?.lines || []).map((lineName) => {
                const line = metroLines.find(
                  (item) => item.name === lineName
                );

                return (
                  <span
                    key={lineName}
                    style={{
                      background: line?.color || "#64748b",
                      color: "white",
                      padding: "8px 13px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    {lineName}
                  </span>
                );
              })}
            </div>

            {stationInfo?.isInterchange && (
              <p
                style={{
                  marginTop: "16px",
                  color: "#d97706",
                  fontSize: "13px",
                  fontWeight: "bold"
                }}
              >
                ★ Interchange station
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
