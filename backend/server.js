import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

console.log("ANTHROPIC KEY LOADED:", !!process.env.ANTHROPIC_API_KEY);

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper: strip markdown fences Claude sometimes wraps around JSON
function safeParseClaude(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse failed:", e.message);
    return null;
  }
}

app.post("/api/suggestions", async (req, res) => {
  try {
    const { events = [], calendars = [], today = new Date().toISOString().slice(0, 10) } = req.body || {};

    // Build a human-readable today string for the prompt
    const todayReadable = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `
You are a smart calendar AI assistant.

TODAY'S DATE: ${todayReadable} (${today})

IMPORTANT DATE RULES:
- Never suggest events on dates that have already passed.
- All suggested event dates must be on or after today (${today}).
- Use specific future dates in the "time" field, e.g. "Monday, April 21, 2026, 9:00 AM - 10:00 AM".
- Do NOT use vague references like "last Tuesday" or any past date.

User's current events:
${JSON.stringify(events, null, 2)}

User's calendars:
${JSON.stringify(calendars, null, 2)}

Based on the user's schedule, suggest 3 to 5 helpful calendar events they should add.
Spread suggestions across different upcoming days — do not cluster them all on the same day.

Return ONLY a valid JSON array. No markdown. No backticks. No explanation. Just the raw JSON array.

Format:
[
  {
    "id": 1,
    "title": "string",
    "type": "OPTIMAL TIME SLOT | SCHEDULE GAP | TASK REMINDER",
    "priority": "HIGH | MEDIUM | LOW",
    "time": "Weekday, Month Day, Year, H:MM AM - H:MM AM",
    "duration": "X hours" or "X minutes",
    "reason": "string",
    "confidence": 0.0
  }
]
`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    console.log("Claude raw response:", text);

    const parsed = safeParseClaude(text);

    if (!parsed) {
      return res.json([
        {
          id: 1,
          title: "Fallback Suggestion",
          type: "TASK REMINDER",
          priority: "MEDIUM",
          time: `Tomorrow, 9:00 AM - 10:00 AM`,
          duration: "1 hour",
          reason: "AI returned invalid format. Please try refreshing.",
          confidence: 0.5,
        },
      ]);
    }

    res.json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});