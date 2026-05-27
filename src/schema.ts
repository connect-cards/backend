import { z } from "zod";

export const puzzleSchema = z.object({
    date: z.string(),
    version: z.number(),
    difficulty_order: z.array(z.string()),
    groups: z.array(
        z.object({
            id: z.string(),
            type: z.string(),
            difficulty: z.number(),
            title: z.string(),
            words: z.array(z.string()).length(4),
        })
    ).length(4),
});