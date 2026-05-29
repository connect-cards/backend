import fs from "fs-extra";
import path from "path";
import { zodTextFormat } from 'openai/helpers/zod';
import { client, puzzlesPrompt, generationGPTModel, PuzzlesResponseSchema } from "../llm";

const TYPES = [
    "synonym",
    "morphological_family",
    "semantic_field",
    "literary_register",
    "informal_register",
    "profession_domain",
    "emotional_tone",
    "physical_trait",
    "sound_association",
    "etymological_relation",
    "thematic_association",
];

export async function generatePuzzles(dates: string[]) {
    if (dates.length == 0) return;

    const response = await client.responses.parse({
        model: generationGPTModel,
        input: [{
            role: "user",
            content: puzzlesPrompt(TYPES, dates),
        }],
        text: {
            format: zodTextFormat(PuzzlesResponseSchema, "puzzle_response"),
        }
    });

    const output = response.output_parsed ?? { data: [] };
    for (const entry of output.data) {
        const date = entry.date;
        const [y, m, d] = date.split('-');
        const file = path.join("puzzles", y, m, `${d}.json`);

        // Add puzzles to file
        fs.ensureFileSync(file);
        const puzzle: Record<string, any> = {
            'date': date,
            'groups':  entry.groups,
        };
        fs.writeJSONSync(file, puzzle, { spaces: 4 });
    };

    return output.data;
}
