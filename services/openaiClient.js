const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a personalized learning journey using OpenAI
 * @param {Object} learnerProfile - { userId, level, questionnaireAnswers }
 * @param {Array} modules - available modules array
 * @returns {Array} - Array of module objects
 */
async function generateJourneyWithAI(learnerProfile, modules) {
  const system = `
You are an education designer. Given a learner profile and an array of available modules, 
return a JSON array of 4-8 modules in order for a personalized learning journey. 
Each module object must include: id, title, duration_minutes (int), learning_objectives (array of strings), difficulty (beginner|intermediate|advanced). 
Only include modules that are in the provided modules array. 
If extra modules are needed, add them with new ids starting with x_. 
Return valid JSON only.
`;

  const user = { learnerProfile, availableModules: modules };
  const prompt = JSON.stringify(user);

  console.log("=== OpenAI Request ===");
  console.log("System message:", system);
  console.log("User prompt:", prompt);

  try {
    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    });

    console.log("=== OpenAI Raw Response ===");
    console.log(JSON.stringify(resp, null, 2));

    const text = resp.choices[0].message.content.trim();
    console.log("=== OpenAI Text Output ===");
    console.log(text);

    let journeyModules = null;
    try {
      journeyModules = JSON.parse(text);
    } catch (err) {
      console.warn("Could not parse directly, attempting regex extraction...");
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        journeyModules = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse model output as JSON");
      }
    }

    // Sanitize
    const sanitized = journeyModules.map((m, idx) => ({
      id: m.id || `x_${idx}`,
      title: m.title || "Untitled Module",
      duration_minutes: Number(m.duration_minutes) || 10,
      learning_objectives: Array.isArray(m.learning_objectives)
        ? m.learning_objectives.slice(0, 3)
        : [],
      difficulty: ["beginner", "intermediate", "advanced"].includes(m.difficulty)
        ? m.difficulty
        : "beginner"
    }));

    console.log("=== Sanitized Modules ===");
    console.log(sanitized);

    return sanitized;
  } catch (err) {
    console.error("OpenAI generate error:", err.message || err);
    throw err;
  }
}

module.exports = { generateJourneyWithAI };
