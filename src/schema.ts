import { z } from "zod";

export const PuzzleSchema = z.object({
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

export const PuzzlesResponseSchema = z.object({data: z.array(PuzzleSchema)});

const LexiconSchema = z.object({
    word: z.string(),
    definitions: z.array(z.object({
        part_of_speech: z.enum(["noun", "verb", "adjective", "adverb"]),
        definition: z.string(),
        synonyms: z.array(z.string()),
        examples: z.array(z.string()),
    })),
});

export const LexiconResponseSchema = z.object({data: z.array(LexiconSchema)});