import fs from "fs-extra";
import path from "path";
import { client } from "./utils";

const DAYS_TO_GENERATE = 30;
const GENERATION_MODEL = "gpt-4.1-mini";

const GROUP_TYPES = [
    "synonyms",
    "morphological_family",
    "character_family",
    "theme_domain",
]
const TOPICS = [
    "Work and education",
    "Home and places",
    "Hobbies and routines",
    "Transportation",
    "Experiences and entertainment",
    "Sports",
    "Celebrations",
    "Families and friends",
    "Personal belongings",
    "Skills",
]

const pickTopics = () => TOPICS.sort(() => 0.5 - Math.random()).slice(0, 4);
const prompt = (topics: string[], date: string) => `
You are an expert ESL puzzle designer. Generate ONE Connections-style puzzle.

STRICT REQUIREMENTS:
- EXACTLY 16 UNIQUE words
- EXACTLY 4 groups
- EACH group has EXACTLY 4 words
- EXACTLY ONE valid grouping solution
- NO word overlaps between groups
- NO proper nouns
- Suitable for TOEFL/IELTS learners (IELTS band 7-9, CEFR level B2-C2)

Suggested group types:
${GROUP_TYPES.join(", ")}

Suggested today's topic (use as inspiration -- not label):
${topics.join(", ")}


STRICT JSON OUTPUT FORMAT:

{
    "date": "${date}",
    "version": 1,
    "difficulty_order": ["string", "string", "string", "string"]
    "groups": [
        {
            "id": "string",
            "type": "string",
            "difficulty": number,
            "title": "string",
            "words": ["string", "string", "string", "string"]
        },
        ... // 4 groups with same schema in total
    ]
}

Return ONLY valid JSON. No explanation.
`

export async function generateMonthlyPuzzles(year: number, month: number) {
    // Batch generate puzzles using GPT 
    const prompts: { date: string; }[] = [];
    for (let i = 1; i <= DAYS_TO_GENERATE; i++) {
        prompts.push({
            date: `${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`
        });
    }
    const response = await client.responses.create({
        model: GENERATION_MODEL,
        input: prompts.map(p => ({
            role: "user",
            content: prompt(pickTopics(), p.date),
        })),
    });

    // Write puzzles
    const outputs = response.output_text.split("\n\n").filter(Boolean);
    outputs.forEach((json, i) => {
        const date = prompts[i].date;
        const [y, m, d] = date.split('-');
        const filePath = path.join("puzzle", y, m, `${d}.json`);
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, json);
    });
}