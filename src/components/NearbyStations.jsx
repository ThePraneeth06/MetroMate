
import { useState } from "react";
import { stations, getStationDetails } from "../data/metroData";
import {
  MapPin,
  Navigation,
  LocateFixed,
  TrainFront,
  ArrowRight
} from "lucide-react";

// HMRL GTFS station coordinates.
// Names are matched to the station names used in MetroMate.
const stationCoordinates = {
  "Miyapur": [17.4965452, 78.3730262],
  "JNTU College": [17.4987037, 78.3888668],
  "KPHB Colony": [17.4937602, 78.4018258],
  "Kukatpally": [17.4849033, 78.4117896],
  "Dr. B. R. Ambedkar Balanagar": [17.4767464, 78.4221082],
  "Moosapet": [17.4718855, 78.4261182],
  "Bharat Nagar": [17.4629092, 78.4305364],
  "Erragadda": [17.4570487, 78.4335811],
  "ESI Hospital": [17.4486969, 78.4376283],
  "S.R. Nagar": [17.4431205, 78.4407241],
  "Ameerpet": [17.4357214, 78.4447933],
  "Punjagutta": [17.4289362, 78.450955],
  "Irrum Manzil": [17.4202292, 78.4563489],
  "Khairatabad": [17.4116323, 78.4608678],
  "Lakdi-ka-pul": [17.4040433, 78.4649442],
  "Assembly": [17.3979907, 78.4708797],
  "Nampally": [17.392222, 78.4701612],
  "Gandhi Bhavan": [17.3858253, 78.4733347],
  "Osmania Medical College": [17.3820769, 78.4817011],
  "MG Bus Station": [17.3797886, 78.4861571],
  "Malakpet": [17.3771888, 78.4939356],
  "New Market": [17.3734454, 78.5031791],
  "Musarambagh": [17.3710873, 78.5119545],
  "Dilsukhnagar": [17.3685493, 78.5253873],
  "Chaitanyapuri": [17.3681501, 78.5381335],
  "Victoria Memorial": [17.3618565, 78.5439622],
  "LB Nagar": [17.349846, 78.5479412],
  "Sultan Bazaar": [17.3844473, 78.4840241],
  "Narayanaguda": [17.3943658, 78.4899578],
  "Chikkadpally": [17.4003634, 78.4948964],
  "RTC Cross Roads": [17.4070321, 78.4968023],
  "Musheerabad": [17.4178744, 78.4995051],
  "Gandhi Hospital": [17.4255155, 78.501956],
  "Secunderabad West": [17.4338034, 78.4995181],
  "JBS Parade Ground": [17.4444775, 78.497584],
  "Nagole": [17.3907683, 78.5588222],
  "Uppal": [17.4000665, 78.5601868],
  "Stadium": [17.4074002, 78.5542531],
  "NGRI": [17.4148264, 78.5463345],
  "Habsiguda": [17.42018, 78.540548],
  "Tarnaka": [17.4274418, 78.5300079],
  "Mettuguda": [17.4355207, 78.5195754],
  "Secunderabad East": [17.4357184, 78.5054623],
  "Parade Ground": [17.4431943, 78.4974687],
  "Paradise": [17.4434668, 78.4862436],
  "Rasoolpura": [17.443612, 78.4764053],
  "Prakash Nagar": [17.4448889, 78.4658749],
  "Begumpet": [17.4375661, 78.4569341],
  "Madhura Nagar": [17.4369652, 78.4390993],
  "Yusufguda": [17.4351132, 78.4273216],
  "Road No. 5 Jubilee Hills": [17.4300489, 78.4232069],
  "Jubilee Hills Check Post": [17.4281969, 78.4137145],
  "Peddamma Gudi": [17.4306512, 78.4083721],
  "Madhapur": [17.4372637, 78.4004257],
  "Durgam Cheruvu": [17.4429466, 78.3875721],
  "HITEC City": [17.4490055, 78.3831376],
  "Raidurg": [17.442, 78.3772038]
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;
  const toRadians = (degrees) => degrees * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return earthRadius * 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}

export default function NearbyStations({ onChooseStation }) {
  const [location, setLocation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function findNearbyStations() {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setLoading(true);
    setError("");
    setNearbyStations([]);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        setLocation({ lat: userLat, lon: userLon });

        const results = stations
          .filter((station) => stationCoordinates[station])
          .map((station) => {
            const [lat, lon] = stationCoordinates[station];

            return {
              name: station,
              distance: calculateDistance(
                userLat,
                userLon,
                lat,
                lon
              ),
              details: getStationDetails(station)
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 8);

        setNearbyStations(results);
        setLoading(false);
      },
      (locationError) => {
        setLoading(false);

        if (locationError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access in your browser settings."
          );
        } else if (locationError.code === 2) {
          setError("Your location could not be determined. Please try again.");
        } else {
          setError("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  }

  return (
    <section
      id="nearby-stations"
      style={{
        padding: "75px 6%",
        background: "#ffffff"
      }}
    >
      <div className="section-heading">
        <span className="eyebrow">LOCATION BASED DISCOVERY</span>
        <h2>Metro Stations Near You</h2>
        <p>
          Discover the closest Hyderabad Metro stations to your current location.
        </p>
      </div>

      <div
        style={{
          maxWidth: "760px",
          margin: "30px auto",
          padding: "30px",
          borderRadius: "20px",
          background: "#f5f7fb",
          textAlign: "center",
          border: "1px solid #e2e8f0"
        }}
      >
        <div
          style={{
            width: "65px",
            height: "65px",
            margin: "0 auto 18px",
            borderRadius: "50%",
            background: "#dbeafe",
            color: "#2563eb",
            display: "grid",
            placeItems: "center"
          }}
        >
          <LocateFixed size={32} />
        </div>

        <h3 style={{ color: "#172554", marginBottom: "10px" }}>
          Find your nearest metro station
        </h3>

        <p style={{ color: "#64748b", marginBottom: "22px" }}>
          Allow location access to discover nearby stations and their approximate distances.
        </p>

        <button
          onClick={findNearbyStations}
          disabled={loading}
          style={{
            padding: "14px 25px",
            borderRadius: "12px",
            border: "none",
            background: loading ? "#94a3b8" : "#172554",
            color: "white",
            fontWeight: "bold",
            cursor: loading ? "wait" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <Navigation size={18} />
          {loading ? "Finding stations..." : "Use My Current Location"}
        </button>

        {error && (
          <p
            role="alert"
            style={{
              color: "#dc2626",
              marginTop: "18px",
              fontSize: "14px"
            }}
          >
            {error}
          </p>
        )}

        {location && (
          <p style={{ color: "#64748b", fontSize: "12px", marginTop: "15px" }}>
            Location received. Your coordinates are only used in this browser session to calculate distances.
          </p>
        )}
      </div>

      {nearbyStations.length > 0 && (
        <div style={{ maxWidth: "900px", margin: "35px auto 0" }}>
          <h3 style={{ color: "#172554", marginBottom: "18px" }}>
            <MapPin
              size={20}
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
            Your 8 nearest stations
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "15px"
            }}
          >
            {nearbyStations.map((station, index) => (
              <div
                key={station.name}
                style={{
                  padding: "20px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "15px",
                  background: "white",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <strong style={{ color: "#172554" }}>
                    {index + 1}. {station.name}
                  </strong>

                  <span
                    style={{
                      color: "#2563eb",
                      fontWeight: "bold",
                      fontSize: "14px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {station.distance < 1
                      ? `${Math.round(station.distance * 1000)} m`
                      : `${station.distance.toFixed(2)} km`}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "7px",
                    margin: "13px 0"
                  }}
                >
                  {(station.details?.lines || []).map((lineName) => (
                    <span
                      key={lineName}
                      style={{
                        background:
                          lineName === "Red Line"
                            ? "#E53935"
                            : lineName === "Blue Line"
                              ? "#2879D8"
                              : "#20A477",
                        color: "white",
                        padding: "5px 9px",
                        borderRadius: "20px",
                        fontSize: "11px"
                      }}
                    >
                      {lineName}
                    </span>
                  ))}
                </div>

                {station.details?.isInterchange && (
                  <small style={{ color: "#b45309", fontWeight: "bold" }}>
                    Interchange station
                  </small>
                )}

                <button
                  onClick={() => onChooseStation?.(station.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    marginTop: "15px",
                    padding: "10px 13px",
                    borderRadius: "9px",
                    border: "none",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Use as starting station
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>

          <p style={{ color: "#64748b", fontSize: "12px", marginTop: "18px" }}>
            Distances are straight-line estimates, not walking or road distances.
          </p>
        </div>
      )}

      <p
        style={{
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "11px",
          marginTop: "30px"
        }}
      >
        Contains data provided by Hyderabad Metro Rail Ltd.
      </p>
    </section>
  );
}
