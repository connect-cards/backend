import fs from "fs-extra";
import { zodTextFormat } from "openai/helpers/zod";
import { client, generationLexiconGPTModel, lexiconPrompt, LexiconResponseSchema } from "../llm";

export async function generateLexicon(words: string[]) {
    if (words.length == 0) return;

    const response = await client.responses.parse({
        model: generationLexiconGPTModel,
        input: lexiconPrompt(words),
        text: {
            format: zodTextFormat(LexiconResponseSchema, "lexicon_response"),
        }
    });

    const output = response.output_parsed ?? { data: [] };
    for (const entry of output.data) {
        const letter = entry.word[0].toLowerCase();
        const file = `lexicon/${letter}.json`;

        // Add lexicon to file
        let existing: Record<string, any> = {};
        if (fs.existsSync(file)) existing = fs.readJSONSync(file);
        existing[entry.word] = entry.definitions;
        fs.writeJSONSync(file, existing, { spaces: 4 });
    }
}
