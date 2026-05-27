import { zodTextFormat } from "openai/helpers/zod.mjs";
import { validationGPTModel, repairPrompt } from "./prompts";
import { client } from "./utils";
import { PuzzleSchema } from "./schema";

export async function repairPuzzle(badJson: string) {
    const response = await client.responses.parse({
        model: validationGPTModel,
        input: repairPrompt(badJson),
        text: {
            format: zodTextFormat(PuzzleSchema, 'puzzle'),
        }
    });

    return response.output_parsed;
}