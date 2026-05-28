import { zodTextFormat } from "openai/helpers/zod.mjs";
import { validationGPTModel, repairPrompt } from "./prompts";
import { client } from "./utils";
import { PuzzleSchema } from "./schema";

export function validatePuzzle(json: any) {
    // Check duplicates
    const words = json.groups.flatMap((g: any) => g.words);
    const unique = new Set(words);
    if (unique.size !== 16) return false;
    return true;
}

export async function repairPuzzle(json: string) {
    const response = await client.responses.parse({
        model: validationGPTModel,
        input: repairPrompt(json),
        text: {
            format: zodTextFormat(PuzzleSchema, 'puzzle'),
        }
    });

    return response.output_parsed;
}
