import { z } from "zod";

export const PuzzleSchema = z.object({
    date: z.string(),
    version: z.literal(2),
    groups: z.array(
        z.object({
            id: z.string(),
            type: z.string().toLowerCase(),
            difficulty: z.enum(["easy", "medium", "hard", "very_hard"]),
            title: z.string().toLowerCase(),
            words: z.array(z.string().toLowerCase()).length(4),
        })
    ).length(4),
});

export const PuzzlesResponseSchema = z.object({data: z.array(PuzzleSchema)});

const LexiconSchema = z.object({
    word: z.string().toLowerCase(),
    version: z.literal(1),
    definitions: z.array(z.object({
        part_of_speech: z.enum(["noun", "verb", "adjective", "adverb"]),
        definition: z.string().toLowerCase(),
        synonyms: z.array(z.string().toLowerCase()),
        examples: z.array(z.string()),
    })),
});

export const LexiconResponseSchema = z.object({data: z.array(LexiconSchema)});
