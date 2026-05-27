import fs from "fs-extra";
import { client } from "./utils";

const GENERATION_MODEL = "gpt-4.1-mini";

const prompt = (words: string[]) => `
You are an expert English dictionary generator.

For EACH word:
- Include ALL parts of speech (noun, verb, adj, adv)
- Provide clear ESL-friendly definitions
- Include synonyms
- Include example sentences

STRICT JSON FORMAT:

{
    "word1": [
        {
            "part_of_speech": "noun | verb | adjective | adverb",
            "definition: "string",
            "synonyms": ["string"],
            "examples": ["string"]
        }
    ],
    ...
}

Words:
${words.join(",")}

Return ONLY JSON.
`

export async function generateLexicon(words: string[]) {
    const response = await client.responses.create({
        model: GENERATION_MODEL,
        input: prompt(words),
    });

    const data = JSON.parse(response.output_text);
    for (const word of Object.keys(data)) {
        const letter = word[0].toLowerCase();
        const file = `lexicon/${letter}.json`;

        // Add lexicon to file
        let existing: Record<string, any> = {};
        if (fs.existsSync(file)) existing = fs.readJSONSync(file);
        existing[word] = data[word];
        fs.writeJSONSync(file, existing, { spaces: 4 });
    }
}