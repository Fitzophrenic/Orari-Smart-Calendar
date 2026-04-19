import React, { useState, useEffect } from "react";

const mockSuggestions = [
  {
    id: 1,
    title: "Schedule Deep Work Session",
    type: "OPTIMAL TIME SLOT",
    priority: "HIGH",
    time: "Tomorrow, 9:00 AM - 11:00 AM",
    duration: "2 hours",
    reason:
      "Based on your productivity patterns, this is your most focused time.",
    confidence: 0.85
  },
  {
    id: 2,
    title: "Add Break Between Meetings",
    type: "SCHEDULE GAP",
    priority: "MEDIUM",
    time: "Today, 2:00 PM - 2:15 PM",
    duration: "15 minutes",
    reason: "You have 4 consecutive meetings. Prevent burnout.",
    confidence: 0.65
  },
  {
    id: 3,
    title: "Review Weekly Goals",
    type: "TASK REMINDER",
    priority: "LOW",
    time: "Friday, 4:00 PM",
    duration: "30 minutes",
    reason: "You haven't reviewed your goals this week.",
    confidence: 0.5
  }
];

const motivationalQuotes = [
  "Small progress is still progress.",
  "Focus on what moves the needle.",
  "Consistency beats intensity.",
  "You don't need more time, just more focus.",
  "Win the morning, win the day."
];

export default function Suggestions() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateBars(true), 200);
  }, []);

  const getSuggestions = () => {
    setLoading(true);
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      const random =
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ];
      setQuote(random);
      setLoading(false);
    }, 800);
  };

  const priorityStyles = {
    HIGH: "bg-black text-white",
    MEDIUM: "bg-gray-300 text-black",
    LOW: "bg-gray-200 text-black"
  };

  const productivityData = [
    { day: "Mon", val: 40 },
    { day: "Tue", val: 60 },
    { day: "Wed", val: 55 },
    { day: "Thu", val: 90 },
    { day: "Fri", val: 65 },
    { day: "Sat", val: 50 },
    { day: "Sun", val: 78 }
  ];

  const maxVal = Math.max(...productivityData.map((d) => d.val));

  return (
    <div className="w-full flex gap-8">

      {/* LEFT */}
      <div className="flex-1 max-w-3xl">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Suggestions</h1>
            <p className="text-gray-500 text-sm">
              Smart scheduling recommendations powered by AI
            </p>
          </div>
          <button
            onClick={getSuggestions}
            className="bg-black text-white px-4 py-2 text-sm font-bold uppercase"
          >
            Refresh Suggestions
          </button>
        </div>

        {loading && (
          <p className="text-gray-500 text-sm mb-4">
            Orari is thinking...
          </p>
        )}

        <div className="space-y-6">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    {item.type}
                  </p>
                  <h2 className="text-lg font-semibold">
                    {item.title}
                  </h2>
                </div>
                <span
                  className={`text-xs px-3 py-1 font-bold ${priorityStyles[item.priority]}`}
                >
                  {item.priority}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">
                {item.reason}
              </p>
              <div className="flex gap-10 mt-4 text-sm">
                <div>
                  <p className="font-semibold">Time</p>
                  <p>{item.time}</p>
                </div>
                <div>
                  <p className="font-semibold">Duration</p>
                  <p>{item.duration}</p>
                </div>
                <div>
                  <p className="font-semibold">Confidence</p>
                  <div className="w-24 h-2 bg-gray-200 mt-1 overflow-hidden">
                    <div
                      className="h-2 bg-black transition-all duration-700"
                      style={{ width: `${item.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="bg-black text-white px-4 py-2 text-sm font-bold">
                  Accept & Schedule
                </button>
                <button className="border px-4 py-2 text-sm">
                  Modify
                </button>
                <button className="border px-4 py-2 text-sm">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-80 space-y-6">

        {/* PRODUCTIVITY CARD */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Productivity Score</h3>
          <div
            className="flex items-end justify-between px-2"
            style={{ height: "128px" }}
          >
            {productivityData.map((d, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-end w-full"
                style={{ height: "100%" }}
              >
                {/* ANIMATED BAR */}
                <div
                  className={`w-5 rounded-sm transition-all duration-1000 ease-out ${
                    d.val === maxVal ? "bg-black" : "bg-gray-400"
                  }`}
                  style={{
                    height: animateBars ? `${(d.val / maxVal) * 100}%` : "0%"
                  }}
                />
                {/* DAY LABEL */}
                <span className="text-[10px] text-gray-500 mt-1">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* KEY PATTERNS CARD */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold mb-3">Key Patterns</h4>
          <p className="text-sm">Most Productive: 9AM - 11AM</p>
          <p className="text-sm">Avg Meeting: 45 min</p>
          <p className="text-sm">Busiest: Tue, Thu</p>
        </div>

        {/* MOTIVATION CARD */}
        <div className="border rounded-lg p-4 shadow-sm bg-black text-white">
          <h4 className="font-semibold mb-2">Motivation</h4>
          <p className="text-sm italic">"{quote}"</p>
        </div>

        {/* QUICK TIPS CARD */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold mb-3">Quick Tips</h4>
          <ul className="text-sm list-disc pl-4 space-y-1">
            <li>Block morning for deep work</li>
            <li>Add breaks between meetings</li>
            <li>Limit meetings to 30 min</li>
          </ul>
        </div>

      </div>
    </div>
  );
}