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
// Suggestions route 

app.post("/api/suggestions", async (req, res) => {
  try {
    const {
      events = [],
      calendars = [],
      today = new Date().toISOString().slice(0, 10),
    } = req.body || {};

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
Each suggestion MUST be on a different calendar day. No two suggestions may share the same date.

Return ONLY a valid JSON array. No markdown. No backticks. No explanation. Just the raw JSON array.

Format:
[
  {
    "id": 1,
    "title": "string",
    "type": "OPTIMAL TIME SLOT | SCHEDULE GAP | TASK REMINDER",
    "priority": "HIGH | MEDIUM | LOW",
    "time": "Weekday, Month Day, Year, H:MM AM - H:MM AM",
    "duration": "X hours or X minutes",
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
    console.log("Claude suggestions response:", text);

    const parsed = safeParseClaude(text);

    if (!parsed) {
      return res.json([
        {
          id: 1,
          title: "Fallback Suggestion",
          type: "TASK REMINDER",
          priority: "MEDIUM",
          time: "Tomorrow, 9:00 AM - 10:00 AM",
          duration: "1 hour",
          reason: "AI returned invalid format. Please try refreshing.",
          confidence: 0.5,
        },
      ]);
    }

    res.json(parsed);
  } catch (err) {
    console.error("Suggestions error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Chat route 

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], events = [], calendars = [] } = req.body || {};

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const eventList =
      events.length === 0
        ? "No events scheduled."
        : events
            .map((e) => {
              const dateStr = e.date
                ? new Date(e.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "Unknown date";
              const time =
                e.startTime && e.endTime
                  ? `${e.startTime} – ${e.endTime}`
                  : e.startTime || "All day";
              return `• ${e.title} (${e.category}) on ${dateStr} at ${time}`;
            })
            .join("\n");

    const calendarList = calendars
      .map((c) => `• ${c.name} (${c.enabled ? "on" : "off"})`)
      .join("\n");

    const systemPrompt = `You are Orari AI, a smart scheduling assistant built into the Orari calendar app.

Today is ${today}.

The user's calendars:
${calendarList}

The user's upcoming events:
${eventList}

Your job is to help the user manage their schedule. You can:
- Summarize their week or upcoming events
- Identify free time gaps for focus, study, or rest
- Point out scheduling conflicts
- Suggest when to reschedule something
- Give productivity tips based on their calendar

Be concise, friendly, and specific. Reference actual event names and dates when relevant.
Never make up events that are not listed above.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages, // { role, content } array sent from the frontend
    });

    const replyText =
      response.content.find((b) => b.type === "text")?.text ||
      "Sorry, I couldn't process that. Please try again.";

    res.json({ reply: replyText });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});