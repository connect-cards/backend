import { puzzleSchema } from "./schema";

export function validatePuzzle(json: any) {
    // Check schema
    const result = puzzleSchema.safeParse(json);
    if (!result.success) throw new Error("Schema invalid");

    // Check duplicates
    const words = json.groups.flatMap((g: any) => g.words);
    const unique = new Set(words);
    if (unique.size !== 16) throw new Error("Duplicate words detected");

    return true;
}