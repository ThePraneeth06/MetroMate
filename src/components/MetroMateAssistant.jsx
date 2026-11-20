
import { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Clock3,
  IndianRupee,
  Repeat2,
  Users,
  TrainFront,
  Zap,
  ShieldCheck,
  MessageCircle,
  ArrowRight
} from "lucide-react";

const suggestions = [
  { label: "Cheapest route", icon: IndianRupee, prompt: "Find me the cheapest route" },
  { label: "Fastest route", icon: Zap, prompt: "Find me the fastest route" },
  { label: "Avoid crowds", icon: Users, prompt: "Find a less crowded route" },
  { label: "Fewer transfers", icon: Repeat2, prompt: "Find a route with fewer transfers" }
];

const busyStations = [
  "Ameerpet",
  "MG Bus Station",
  "Parade Ground",
  "HITEC City",
  "Dilsukhnagar"
];

function getCrowdScore(route, departureTime) {
  const hour = Number(departureTime.split(":")[0]);

  let score = (route.path || []).filter((station) =>
    busyStations.includes(station)
  ).length;

  if (
    (hour >= 8 && hour < 11) ||
    (hour >= 17 && hour < 20)
  ) {
    score += 2;
  }

  return score;
}

function getCrowdLabel(score) {
  if (score >= 4) return "High";
  if (score >= 2) return "Moderate";
  return "Low";
}

function getRouteMetrics(route) {
  return {
    time: Number(route.estimatedTravelTimeMinutes) || 0,
    fare: Number(route.estimatedFare) || 0,
    transfers: Number(route.transferCount) || 0,
    crowd: getCrowdScore(route, "08:30")
  };
}

function selectBestRoute(routes, request, departureTime) {
  const text = request.toLowerCase();

  const wantsCheap =
    text.includes("cheap") ||
    text.includes("budget") ||
    text.includes("afford") ||
    text.includes("low cost");

  const wantsFast =
    text.includes("fast") ||
    text.includes("quick") ||
    text.includes("time") ||
    text.includes("soon");

  const wantsFewTransfers =
    text.includes("transfer") ||
    text.includes("interchange") ||
    text.includes("change train") ||
    text.includes("direct");

  const wantsLessCrowd =
    text.includes("crowd") ||
    text.includes("busy") ||
    text.includes("quiet") ||
    text.includes("packed") ||
    text.includes("people");

  const scoredRoutes = routes.map((route) => {
    const crowd = getCrowdScore(route, departureTime);

    const score =
      (wantsCheap ? route.estimatedFare * 2 : 0) +
      (wantsFast ? route.estimatedTravelTimeMinutes * 2 : 0) +
      (wantsFewTransfers ? route.transferCount * 20 : 0) +
      (wantsLessCrowd ? crowd * 15 : 0);

    return { route, score, crowd };
  });

  if (!wantsCheap && !wantsFast && !wantsFewTransfers && !wantsLessCrowd) {
    scoredRoutes.sort((a, b) => {
      const scoreA =
        a.route.estimatedTravelTimeMinutes * 0.4 +
        a.route.transferCount * 8 +
        a.route.estimatedFare * 0.15 +
        a.crowd * 5;

      const scoreB =
        b.route.estimatedTravelTimeMinutes * 0.4 +
        b.route.transferCount * 8 +
        b.route.estimatedFare * 0.15 +
        b.crowd * 5;

      return scoreA - scoreB;
    });
  } else {
    scoredRoutes.sort((a, b) => a.score - b.score);
  }

  return {
    selected: scoredRoutes[0],
    preferences: {
      wantsCheap,
      wantsFast,
      wantsFewTransfers,
      wantsLessCrowd
    }
  };
}

function buildExplanation(preferences, route, crowd) {
  const reasons = [];

  if (preferences.wantsCheap) {
    reasons.push("it has the lowest estimated fare among the available options");
  }

  if (preferences.wantsFast) {
    reasons.push("it prioritizes a shorter estimated journey time");
  }

  if (preferences.wantsFewTransfers) {
    reasons.push("it prioritizes fewer line changes");
  }

  if (preferences.wantsLessCrowd) {
    reasons.push(`its estimated crowd level is ${crowd.toLowerCase()}`);
  }

  if (reasons.length === 0) {
    reasons.push("it offers a balanced combination of travel time, fare, transfers and estimated crowd level");
  }

  return `I recommend this route because ${reasons.join(" and ")}.`;
}

export default function MetroMateAssistant({
  routes = [],
  source,
  destination,
  onChooseRoute
}) {
  const [departureTime, setDepartureTime] = useState("08:30");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey there! I'm your MetroMate travel assistant. Tell me what matters most for your journey, and I'll help you choose a suitable route."
    }
  ]);
  const [recommended, setRecommended] = useState(null);

  function handleRequest(request) {
    const trimmedRequest = request.trim();

    if (!trimmedRequest) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: trimmedRequest }
    ]);

    setInput("");

    if (!routes.length) {
      setRecommended(null);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: "First, choose your starting station and destination in the Journey Planner, then tap Find My Route. I'll compare the available routes for you!"
        }
      ]);

      return;
    }

    const result = selectBestRoute(
      routes,
      trimmedRequest,
      departureTime
    );

    const selected = result.selected;

    if (!selected) return;

    const crowdScore = getCrowdScore(
      selected.route,
      departureTime
    );

    const crowd = getCrowdLabel(crowdScore);

    const explanation = buildExplanation(
      result.preferences,
      selected.route,
      crowd
    );

    setRecommended({
      route: selected.route,
      crowd,
      explanation
    });

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text: `I've compared ${routes.length} available route option(s) for your journey. ${explanation}`
      }
    ]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleRequest(input);
  }

  function chooseSuggestion(prompt) {
    handleRequest(prompt);
  }

  return (
    <div className="mm-ai-shell">

      {/* ASSISTANT HEADER */}

      <div className="mm-ai-header">
        <div className="mm-ai-profile">
          <div className="mm-ai-avatar">
            <Bot size={28} />
            <span className="mm-ai-online-dot" />
          </div>

          <div>
            <div className="mm-ai-name">
              MetroMate AI
              <span className="mm-ai-version">SMART ASSISTANT</span>
            </div>
            <p>Your personal Hyderabad Metro travel companion</p>
          </div>
        </div>

        <div className="mm-ai-status">
          <span />
          READY TO HELP
        </div>
      </div>

      {/* JOURNEY CONTEXT */}

      <div className="mm-ai-context">
        <div className="mm-ai-context-item">
          <span>YOUR JOURNEY</span>
          <strong>{source || "Choose source"} <ArrowRight size={14} /> {destination || "Choose destination"}</strong>
        </div>

        <div className="mm-ai-context-item">
          <label htmlFor="mm-ai-time">
            <Clock3 size={14} />
            DEPARTURE TIME
          </label>
          <input
            id="mm-ai-time"
            type="time"
            value={departureTime}
            onChange={(event) => {
              setDepartureTime(event.target.value);
              setRecommended(null);
            }}
          />
        </div>
      </div>

      {/* CHAT AREA */}

      <div className="mm-ai-chat">

        <div className="mm-ai-welcome">
          <div className="mm-ai-sparkle">
            <Sparkles size={21} />
          </div>

          <div>
            <h3>How can I make your journey better?</h3>
            <p>
              Tell me your travel preference. I'll compare the routes
              and suggest an option.
            </p>
          </div>
        </div>

        <div className="mm-ai-suggestions">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;

            return (
              <button
                key={suggestion.label}
                onClick={() => chooseSuggestion(suggestion.prompt)}
              >
                <Icon size={16} />
                {suggestion.label}
              </button>
            );
          })}
        </div>

        <div className="mm-ai-message-list">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mm-ai-message ${
                message.role === "user" ? "mm-ai-user-message" : "mm-ai-bot-message"
              }`}
            >
              {message.role === "assistant" && (
                <div className="mm-ai-message-avatar">
                  <Bot size={17} />
                </div>
              )}

              <div className="mm-ai-message-bubble">
                <span>
                  {message.role === "user" ? "YOU" : "METROMATE AI"}
                </span>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RECOMMENDED ROUTE */}

        {recommended && (
          <div className="mm-ai-recommendation">
            <div className="mm-ai-recommendation-top">
              <div>
                <span className="mm-ai-recommendation-label">
                  <Sparkles size={14} />
                  RECOMMENDED FOR YOU
                </span>
                <h3>{recommended.route.source} → {recommended.route.destination}</h3>
              </div>

              <div className="mm-ai-best-icon">
                <ShieldCheck size={23} />
              </div>
            </div>

            <p className="mm-ai-recommendation-reason">
              {recommended.explanation}
            </p>

            <div className="mm-ai-metrics">
              <div>
                <Clock3 size={18} />
                <strong>{recommended.route.estimatedTravelTimeMinutes} min</strong>
                <span>Estimated time</span>
              </div>

              <div>
                <IndianRupee size={18} />
                <strong>₹{recommended.route.estimatedFare}</strong>
                <span>Estimated fare</span>
              </div>

              <div>
                <Repeat2 size={18} />
                <strong>{recommended.route.transferCount}</strong>
                <span>Transfers</span>
              </div>

              <div>
                <Users size={18} />
                <strong>{recommended.crowd}</strong>
                <span>Estimated crowd</span>
              </div>
            </div>

            <button
              className="mm-ai-use-route"
              onClick={() => onChooseRoute?.(recommended.route)}
            >
              Use this route
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        <div className="mm-ai-demo-note">
          <ShieldCheck size={15} />
          Demo assistant: route selection uses rule-based comparisons.
          Crowd levels are simulated estimates, not live passenger data.
        </div>
      </div>

      {/* MESSAGE INPUT */}

      <form className="mm-ai-input-area" onSubmit={handleSubmit}>
        <div className="mm-ai-input-icon">
          <MessageCircle size={19} />
        </div>

        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask something like: Find me the cheapest route..."
          aria-label="Ask MetroMate Assistant"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send size={19} />
        </button>
      </form>

      <div className="mm-ai-footer">
        POWERED BY METROMATE SMART ROUTE LOGIC
      </div>
    </div>
  );
}
