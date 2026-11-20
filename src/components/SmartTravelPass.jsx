
import { useState } from "react";
import {
  Ticket,
  TrainFront,
  MapPin,
  ArrowRight,
  Clock3,
  IndianRupee,
  Repeat2,
  Download,
  ShieldCheck,
  Sparkles
} from "lucide-react";

function DemoQR() {
  const size = 11;

  const isFinder = (row, col, startRow, startCol) => {
    const r = row - startRow;
    const c = col - startCol;

    if (r < 0 || r > 2 || c < 0 || c > 2) return false;
    return (
      r === 0 || r === 2 || c === 0 || c === 2 ||
      (r === 1 && c === 1)
    );
  };

  return (
    <div className="smart-pass-qr" aria-label="Decorative demo QR graphic">
      {Array.from({ length: size * size }, (_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;

        const finder =
          isFinder(row, col, 0, 0) ||
          isFinder(row, col, 0, 8) ||
          isFinder(row, col, 8, 0);

        const filled =
          finder ||
          ((row * 7 + col * 3 + row * col) % 5 < 2);

        return (
          <span
            key={index}
            className={filled ? "qr-cell filled" : "qr-cell"}
          />
        );
      })}
    </div>
  );
}

export default function SmartTravelPass({
  route,
  source,
  destination
}) {
  const [passId] = useState(
    () => `MM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );

  if (!route) return null;

  const estimatedFare = route.estimatedFare ?? 0;
  const estimatedTime = route.estimatedTravelTimeMinutes ?? 0;
  const transferCount = route.transferCount ?? 0;

  const handleDownload = () => {
    window.print();
  };

  return (
    <section className="smart-pass-section" id="smart-travel-pass">
      <div className="smart-pass-heading">
        <span className="smart-pass-eyebrow">
          <Sparkles size={15} />
          YOUR DIGITAL METRO TICKET
        </span>

        <h2>Your MetroMate Travel Pass</h2>
        <p>
          Your journey details, neatly packed into one digital pass.
        </p>
      </div>

      <div className="smart-pass-card">
        <div className="smart-pass-top">
          <div className="smart-pass-brand">
            <div className="smart-pass-logo">
              <TrainFront size={25} />
            </div>

            <div>
              <h3>MetroMate</h3>
              <span>HYDERABAD METRO</span>
            </div>
          </div>

          <div className="smart-pass-status">
            <span className="status-dot" />
            DEMO PASS
          </div>
        </div>

        <div className="smart-pass-ticket-label">
          <Ticket size={17} />
          SMART JOURNEY TICKET
        </div>

        <div className="smart-pass-route">
          <div className="pass-station">
            <span>FROM</span>
            <h2>{source || "Starting Station"}</h2>
            <small>Boarding station</small>
          </div>

          <div className="pass-route-arrow">
            <ArrowRight size={25} />
          </div>

          <div className="pass-station destination">
            <span>TO</span>
            <h2>{destination || "Destination"}</h2>
            <small>Destination station</small>
          </div>
        </div>

        <div className="smart-pass-divider">
          <span />
          <span />
        </div>

        <div className="smart-pass-details">
          <div>
            <IndianRupee size={18} />
            <span>ESTIMATED FARE</span>
            <strong>₹{estimatedFare}</strong>
          </div>

          <div>
            <Clock3 size={18} />
            <span>TRAVEL TIME</span>
            <strong>{estimatedTime} min</strong>
          </div>

          <div>
            <Repeat2 size={18} />
            <span>TRANSFERS</span>
            <strong>{transferCount}</strong>
          </div>
        </div>

        <div className="smart-pass-bottom">
          <div className="smart-pass-id">
            <span>PASS REFERENCE</span>
            <strong>{passId}</strong>

            <div className="pass-demo-note">
              <ShieldCheck size={14} />
              Hackathon demonstration pass
            </div>
          </div>

          <DemoQR />
        </div>

        <div className="smart-pass-footer">
          <TrainFront size={16} />
          Travel smarter. Travel with MetroMate.
        </div>
      </div>

      <div className="smart-pass-actions">
        <button onClick={handleDownload}>
          <Download size={18} />
          Download / Save as PDF
        </button>

        <p>
          This is a demo travel pass, not a valid Hyderabad Metro ticket.
          The QR-style graphic is decorative and cannot be scanned for travel.
        </p>
      </div>
    </section>
  );
}
