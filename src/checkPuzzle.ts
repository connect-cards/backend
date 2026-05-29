import fs from "fs-extra";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { validationGPTModel, repairPrompt, client, PuzzleSchema } from "./utils";

function getPuzzleFilePath(date: string) {
    const [year, month, day] = date.split("-");
    return `puzzles/${year}/${month}/${day}.json`;
}

export function checkPuzzleInventory(dates: string[]) {
    const missing: string[] = [];
    const existing: string[] = [];

    for (const date of dates) {
        const file = getPuzzleFilePath(date);
        if (fs.existsSync(file)) existing.push(date);
        else missing.push(date);
    }

    return { missing, existing };
}

export function checkPuzzleExists(date: string) {
    return fs.existsSync(getPuzzleFilePath(date));
}

export function validatePuzzle(json: any) {
    // Check duplicates
    const words = json.groups.flatMap((g: any) => g.words);
    const unique = new Set(words);
    if (unique.size !== 16) return false;
    return true;
}

export async function repairPuzzle(jsonStr: string) {
    const response = await client.responses.parse({
        model: validationGPTModel,
        input: repairPrompt(jsonStr),
        text: {
            format: zodTextFormat(PuzzleSchema, 'puzzle'),
        }
    });

    return response.output_parsed;
}