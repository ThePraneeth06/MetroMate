
import { useState } from "react";
import MetroMateDashboard from "./components/MetroMateDashboard";
import JourneyTracker from "./components/JourneyTracker";
import SmartTravelPass from "./components/SmartTravelPass";
import ServiceAlerts from "./components/ServiceAlerts";
import {
  TrainFront,
  MapPin,
  ArrowRight,
  ArrowUpDown,
  Search,
  Clock,
  Wallet,
  Navigation,
  Menu,
  Map,
  Ticket,
  Route,
  X,
  ArrowRightLeft
} from "lucide-react";

import "./index.css";

import {
  stations,
  metroLines,
  stationDetails
} from "./data/metroData";

import {
  findShortestRoute,
  findAlternativeRoutes
} from "./utils/routeFinder";

import CrowdIndicator from "./components/CrowdIndicator";
import SmartJourneyRecommendations from "./components/SmartJourneyRecommendations";
import MetroMateAssistant from "./components/MetroMateAssistant";
import NearbyStations from "./components/NearbyStations";
import MetroNetworkMap from "./components/MetroNetworkMap";
import AlternativeRoutes from "./components/AlternativeRoutes";

export default function App() {
  const [source, setSource] = useState("Miyapur");
  const [destination, setDestination] = useState("HITEC City");

  const [routeResult, setRouteResult] = useState(null);
  const [routeOptions, setRouteOptions] = useState([]);

  const [message, setMessage] = useState("");

  const [stationSearch, setStationSearch] = useState("");
  const [selectedLine, setSelectedLine] = useState("all");
  const [selectedStation, setSelectedStation] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  function clearRouteResults() {
    setRouteResult(null);
    setRouteOptions([]);
    setMessage("");
  }

  function calculateRoute() {
    setMessage("");
    setRouteResult(null);
    setRouteOptions([]);

    if (!source || !destination) {
      setMessage("Please select both starting and destination stations.");
      return;
    }

    if (source === destination) {
      setMessage("Starting station and destination cannot be the same.");
      return;
    }

    const result = findShortestRoute(source, destination);

    if (!result) {
      setMessage("No route found between these stations.");
      return;
    }

    const alternatives = findAlternativeRoutes(source, destination);

    setRouteResult(result);
    setRouteOptions(
      alternatives?.length ? alternatives : [result]
    );

    setTimeout(() => {
      document.getElementById("route-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  function swapStations() {
    setSource(destination);
    setDestination(source);
    clearRouteResults();
  }

  function chooseStationAsSource(station) {
    setSource(station);
    clearRouteResults();

    document.getElementById("planner")?.scrollIntoView({
      behavior: "smooth"
    });
  }

  function chooseAlternativeRoute(route) {
    setRouteResult(route);

    setTimeout(() => {
      document.getElementById("route-details")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  const filteredStations = stationDetails.filter((station) => {
    const matchesSearch = station.name
      .toLowerCase()
      .includes(stationSearch.toLowerCase());

    const matchesLine =
      selectedLine === "all" ||
      station.lines.some((line) =>
        line.toLowerCase().includes(selectedLine)
      );

    return matchesSearch && matchesLine;
  });

  function getStationLineNames(stationName) {
    const details = stationDetails.find(
      (station) => station.name === stationName
    );

    return details?.lines || [];
  }

  return (
    <div className="app">
     
      {/* NAVIGATION */}

      <nav className="navbar">
        <a href="#home" className="brand">
          <div className="brand-icon">
            <TrainFront size={25} />
          </div>
          <span>MetroMate</span>
        </a>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
           <a href="#dashboard" onClick={() => setMenuOpen(false)}>
  Dashboard
</a>
          <a href="#planner" onClick={() => setMenuOpen(false)}>Plan Journey</a>
          <a href="#stations" onClick={() => setMenuOpen(false)}>Stations</a>
          <a href="#nearby-stations" onClick={() => setMenuOpen(false)}>Nearby</a>
          <a href="#network-map" onClick={() => setMenuOpen(false)}>Metro Map</a>
          <a href="#metromate-assistant" onClick={() => setMenuOpen(false)}>AI Assistant</a>
          <a href="#journey-tracker" onClick={() => setMenuOpen(false)}>
  Journey Tracker
</a>
        </div>
      </nav>

      {/* HERO */}

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-tag">
            <TrainFront size={15} />
            YOUR SMART HYDERABAD METRO COMPANION
          </span>

          <h1>
            Your City.
            <br />
            Your Journey.
            <br />
            <span>Made Smarter.</span>
          </h1>

          <p>
            Explore Hyderabad Metro, find the best routes,
            discover nearby stations and make every journey easier
            with MetroMate.
          </p>

          <div className="hero-buttons">
            <a href="#planner" className="primary-button">
              Plan Your Journey <ArrowRight size={18} />
            </a>

            <a href="#network-map" className="secondary-button">
              Explore Metro Map
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>3</strong>
              <span>Metro Lines</span>
            </div>

            <div>
              <strong>{stations.length}</strong>
              <span>Stations in Dataset</span>
            </div>

            <div>
              <strong>1</strong>
              <span>Smart Companion</span>
            </div>
          </div>
        </div>
      </section>
       {/* SMART DASHBOARD */}

      <MetroMateDashboard />

      {/* JOURNEY PLANNER */}

      <section className="planner-section" id="planner">
        <div className="section-heading">
          <span className="section-eyebrow">PLAN YOUR RIDE</span>
          <h2>Where do you want to go?</h2>
          <p>Choose your starting point and destination.</p>
        </div>

        <div className="planner-card">
          <div className="planner-inputs">
            <div className="station-input-group">
              <label>
                <MapPin size={17} />
                FROM
              </label>

              <select
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  clearRouteResults();
                }}
              >
                <option value="">Select starting station</option>

                {stations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="swap-button"
              onClick={swapStations}
              title="Swap stations"
              aria-label="Swap stations"
            >
              <ArrowUpDown size={20} />
            </button>

            <div className="station-input-group">
              <label>
                <Navigation size={17} />
                TO
              </label>

              <select
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  clearRouteResults();
                }}
              >
                <option value="">Select destination station</option>

                {stations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="calculate-button"
            onClick={calculateRoute}
          >
            <Route size={19} />
            Find My Route
            <ArrowRight size={19} />
          </button>

          {message && (
            <p className="error-message">{message}</p>
          )}
        </div>
      </section>

      {/* ROUTE RESULTS */}

      {routeResult && (
        <section className="route-results-section" id="route-results">

          <div className="section-heading">
            <span className="section-eyebrow">YOUR JOURNEY</span>
            <h2>Route Found!</h2>
            <p>
              {routeResult.source} to {routeResult.destination}
            </p>
          </div>

          {/* ALTERNATIVE ROUTES */}

          <AlternativeRoutes
            routes={routeOptions}
            onChooseRoute={chooseAlternativeRoute}
          />

          {/* SMART RECOMMENDATIONS */}

          <SmartJourneyRecommendations
            routes={routeOptions}
            onChooseRoute={chooseAlternativeRoute}
          />

          {/* SELECTED ROUTE DETAILS */}

          <div className="route-detail-card" id="route-details">
            <div className="route-detail-heading">
              <div>
                <span className="section-eyebrow">SELECTED JOURNEY</span>

                <h3>
                  {routeResult.source} <ArrowRight size={18} />{" "}
                  {routeResult.destination}
                </h3>
              </div>

              <span className="route-status">
                <TrainFront size={15} />
                Route Selected
              </span>
            </div>

            <div className="route-summary-grid">
              <div className="route-summary-item">
                <Clock size={22} />
                <strong>
                  {routeResult.estimatedTravelTimeMinutes} min
                </strong>
                <span>Estimated Time</span>
              </div>

              <div className="route-summary-item">
                <Wallet size={22} />
                <strong>₹{routeResult.estimatedFare}</strong>
                <span>Estimated Fare</span>
              </div>

              <div className="route-summary-item">
                <Route size={22} />
                <strong>{routeResult.estimatedDistanceKm} km</strong>
                <span>Estimated Distance</span>
              </div>

              <div className="route-summary-item">
                <ArrowRightLeft size={22} />
                <strong>{routeResult.transferCount}</strong>
                <span>Transfers</span>
              </div>
            </div>

            <div className="route-lines-used">
              <h4>Metro lines used</h4>

              <div className="route-lines">
                {(routeResult.linesUsed || []).map((lineId) => {
                  const line = metroLines.find(
                    (item) => item.id === lineId
                  );

                  if (!line) return null;

                  return (
                    <span
                      key={lineId}
                      className={`line-tag ${lineId}`}
                    >
                      {line.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="journey-timeline">
              <h4>Station-by-station journey</h4>

              {(routeResult.path || []).map((station, index) => {
                const details = getStationLineNames(station);
                const isFirst = index === 0;
                const isLast = index === routeResult.path.length - 1;
                const transfers = routeResult.transfers || [];

                return (
                  <div
                    className="timeline-item"
                    key={`${station}-${index}`}
                  >
                    <div className="timeline-marker">
                      <span
                        className={
                          isFirst
                            ? "start-marker"
                            : isLast
                              ? "end-marker"
                              : "normal-marker"
                        }
                      />

                      {!isLast && (
                        <span className="timeline-line" />
                      )}
                    </div>

                    <div className="timeline-content">
                      <strong>{station}</strong>

                      {isFirst && (
                        <span className="station-direction">
                          START STATION
                        </span>
                      )}

                      {isLast && (
                        <span className="station-direction">
                          DESTINATION
                        </span>
                      )}

                      {details.length > 0 && (
                        <div className="station-line-tags">
                          {details.map((lineName) => (
                            <span key={lineName}>{lineName}</span>
                          ))}
                        </div>
                      )}

                      {transfers.includes(station) && (
                        <span className="transfer-notice">
                          Change line here
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="fare-note">
              * Fare, distance and journey time are estimates based on
              simplified route calculations. Actual fares and travel
              times may vary.
            </p>
          </div>
          {/* JOURNEY TRACKER */}

          <JourneyTracker route={routeResult} />
          <SmartTravelPass
  route={routeResult}
  source={source}
  destination={destination}
/>

        </section>
      )}

      {/* METROMATE ASSISTANT */}

      <section className="assistant-section" id="metromate-assistant">
        <div className="section-heading">
          <span className="section-eyebrow">YOUR SMART TRAVEL HELPER</span>
          <h2>Meet MetroMate Assistant</h2>
          <p>
            Ask for a cheaper route, a faster journey or fewer transfers.
          </p>
        </div>

        <MetroMateAssistant
          routes={routeOptions}
          source={source}
          destination={destination}
          onChooseRoute={chooseAlternativeRoute}
        />
      </section>

      {/* STATION EXPLORER */}

      <section className="stations-section" id="stations">
        <div className="section-heading">
          <span className="section-eyebrow">EXPLORE THE NETWORK</span>
          <h2>Discover Metro Stations</h2>
          <p>Search stations and explore the Hyderabad Metro network.</p>
        </div>

        <div className="station-search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search for a station..."
            value={stationSearch}
            onChange={(event) => setStationSearch(event.target.value)}
          />
        </div>

        <div className="station-filter-buttons">
          {["all", "red", "blue", "green"].map((line) => (
            <button
              key={line}
              className={selectedLine === line ? "active-filter" : ""}
              onClick={() => setSelectedLine(line)}
            >
              {line === "all" ? "All Lines" : `${line} Line`}
            </button>
          ))}
        </div>

        <div className="station-explorer-layout">
          <div className="station-grid">
            {filteredStations.map((station) => (
              <button
                key={station.id}
                className={`station-card ${
                  selectedStation?.name === station.name
                    ? "active-station"
                    : ""
                }`}
                onClick={() => setSelectedStation(station)}
              >
                <div className="station-card-icon">
                  <TrainFront size={19} />
                </div>

                <strong>{station.name}</strong>

                {station.isInterchange && (
                  <span className="interchange-label">
                    Interchange
                  </span>
                )}

                <div className="station-card-lines">
                  {station.lines.map((lineName) => (
                    <span key={lineName}>{lineName}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {filteredStations.length === 0 && (
            <p>No stations found. Try another search.</p>
          )}

          {selectedStation && (
            <div className="selected-station-panel">
              <button
                className="close-station-panel"
                onClick={() => setSelectedStation(null)}
                aria-label="Close station details"
              >
                <X size={18} />
              </button>

              <span className="section-eyebrow">STATION DETAILS</span>
              <h3>{selectedStation.name}</h3>

              <p>
                {selectedStation.isInterchange
                  ? "This station connects multiple metro lines."
                  : "This station is part of the Hyderabad Metro network."}
              </p>

              <h4>Connected lines</h4>

              <div className="station-card-lines">
                {selectedStation.lines.map((lineName) => (
                  <span key={lineName}>{lineName}</span>
                ))}
              </div>

              <button
                className="calculate-button"
                onClick={() => chooseStationAsSource(selectedStation.name)}
              >
                Use as starting station
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* NEARBY STATIONS */}

      <section className="nearby-section" id="nearby-stations">
        <NearbyStations
          onChooseStation={chooseStationAsSource}
        />
      </section>

      {/* METRO NETWORK MAP */}

      <section className="network-section" id="network-map">
        <div className="section-heading">
          <span className="section-eyebrow">VISUALIZE YOUR CITY</span>
          <h2>Hyderabad Metro Network</h2>
          <p>Explore the metro lines and connected stations.</p>
        </div>

        <MetroNetworkMap />
      </section>

      {/* CROWD INDICATOR */}

      <CrowdIndicator />
      <ServiceAlerts />

      {/* FEATURES */}

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="section-eyebrow">WHY METROMATE?</span>
          <h2>Your Smarter Metro Companion</h2>
          <p>Useful tools to make travelling around Hyderabad easier.</p>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">
              <Route size={25} />
            </div>

            <h3>Smart Route Finder</h3>
            <p>
              Find routes between metro stations and explore
              alternative journey options.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <Wallet size={25} />
            </div>

            <h3>Fare Estimation</h3>
            <p>
              Get an estimated fare for your selected metro journey.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <MapPin size={25} />
            </div>

            <h3>Nearby Stations</h3>
            <p>
              Discover nearby metro stations using your device location.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <Map size={25} />
            </div>

            <h3>Metro Network Map</h3>
            <p>
              Explore metro lines and understand station connections.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <Clock size={25} />
            </div>

            <h3>Journey Time Estimate</h3>
            <p>
              Understand approximate journey duration before travelling.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <Ticket size={25} />
            </div>

            <h3>Station Explorer</h3>
            <p>
              Search and explore stations across the metro network.
            </p>
          </article>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer">
        <div className="footer-brand">
          <TrainFront size={24} />
          <strong>MetroMate</strong>
        </div>

        <p>
          Making Hyderabad Metro journeys smarter, simpler and easier.
        </p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#planner">Plan Journey</a>
          <a href="#stations">Stations</a>
          <a href="#network-map">Metro Map</a>
          <a href="#metromate-assistant">Assistant</a>
        </div>

        <span className="footer-copy">
          © {new Date().getFullYear()} MetroMate. Built with ❤️ for Hyderabad.
        </span>
      </footer>

    </div>
  );
}
