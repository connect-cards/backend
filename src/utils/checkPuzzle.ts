import fs from "fs-extra";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { validationPuzzleGPTModel, repairPrompt, client, PuzzleSchema } from "../llm";

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
    // Check difficulty duplication
    const difficulties = json.groups.flatMap((g: any) => g.difficulty);
    const uniqueDifficulties = new Set(difficulties);
    if (uniqueDifficulties.size !== 4) return false;

    // Check word duplication
    const words = json.groups.flatMap((g: any) => g.words);
    const uniqueWords = new Set(words);
    if (uniqueWords.size !== 16) return false;
    return true;
}

export async function repairPuzzle(jsonStr: string) {
    const response = await client.responses.parse({
        model: validationPuzzleGPTModel,
        input: repairPrompt(jsonStr),
        text: {
            format: zodTextFormat(PuzzleSchema, 'puzzle'),
        }
    });

    return response.output_parsed;
}