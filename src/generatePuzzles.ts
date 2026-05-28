import fs from "fs-extra";
import path from "path";
import { zodTextFormat } from 'openai/helpers/zod';
import { client } from "./utils";
import { puzzlesPrompt, generationGPTModel } from "./prompts";
import { PuzzlesResponseSchema } from "./schema";

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
    output.data.forEach((puzzle) => {
        const date = puzzle.date;
        const [y, m, d] = date.split('-');
        const filePath = path.join("puzzles", y, m, `${d}.json`);
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, JSON.stringify(puzzle, null, 2));
    });

    return output.data;
}
