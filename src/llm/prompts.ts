export const generationGPTModel = "gpt-5.4-nano";
export const validationGPTModel = "gpt-5.4-mini";

const pickTypes = (types: string[]) => types.sort(() => 0.5 - Math.random()).slice(0, 4);

export const lexiconPrompt = (words: string[]) => `
You are an expert English lexicographer and ESL dictionary generator.

Generate high-quality dictionary entries for the following English words:
${words.join(", ")}

CORE REQUIREMENTS: For EACH word:
- Include ALL parts of speech actually used in modern English (noun, verb, adj, adv)
- Provide clear ESL-friendly definitions (avoid examples inside the definition)
- Include synonyms
- Include example sentences

Regarding DEFINITIONS:
- Write concise, ESL-friendly definitions
- Definitions MUST:
    * be clear and natural
    * avoid circular wording
    * avoid repeating the target word
    * avoid examples inside the definition
    * avoid quotation marks
    * avoid semicolons unless necessary
- Do NOT fabricate obscure or archaic meanings unless the word is commonly used that way

Regarding SYNONYMS:
- Include 2-6 REAL English synonyms.
- Synonyms should match the same part of speech, match the meaning closely, and avoid fabricated or extremely obscure words.

Regarding EXAMPLES:
- Include 1-2 natural example sentences per meaning.
- Example should use proper grammar, clearly demonstrate the meaning, varying sentence structure, and avoid overly poetic or artificial phrasing.
- Good: "Her cheerful attitude improved the atmosphere." vs Bad: "The cheerful sun cheerfully cheered the cheerful village"

Regarding FACTUAL / LEXICAL ACCURACY:
- Only include meanings that are genuinely recognized in standard English usage.
- Do NOT invent: fake meanings, fake synonyms, unsupported parts of speech, unnatural example sentences
- If a word has only one common part of speech, return only that one.

Return ONLY JSON.
`

export const puzzlesPrompt = (types: string[], dates: string[]) => `
You are an expert ESL puzzle designer. Generate ${dates.length} DIFFERENT Connections-style puzzles for ${dates.length} days -- each day has ONE DISTINCT puzzle.

OBJECTIVE: Create a challenging word-grouping puzzle with:
- sophisticated vocabulary
- subtle semantic relationships
- deliberate misdirection
- multiple plausible false groupings
- but ONLY ONE fully correct solution

STRICT REQUIREMENTS:
- EXACTLY 16 UNIQUE words
- EXACTLY 4 groups corresponding to 4 DIFFICULTY LEVELS (easy, medium, hard, very_hard)
- EACH group has EXACTLY 4 words
- EACH difficulty level appears ONCE
- EXACTLY ONE valid grouping solution
- NO word overlaps between groups
- NO proper nouns
- NO hyphenated phrases
- SINGLE-WORD entries only
- Puzzles MUST be different and words across puzzles SHOULD NOT repeat

DIFFICULTY DISTRIBUTION:
- easy: accessible but not trivial
- medium: includes informal, literary, or less common vocabulary
- hard: uncommon GRE/IELTS vocabulary and near-synonyms preferred over exact synonyms
- very_hard: obscure, archaic, literary, technical, or rarely used words but should still be valid English vocabulary. Avoid super long words if possible.

Prefer these difficulty boosters: archaic words, literary vocabulary, words with multiple meanings, misleading overlaps between categories, rare morphological relatives, thematic ambiguity

TARGER VOCABULARY LEVEL:
- Suitable for IELTS band 7-9, GRE verbal, CEFR level C1-C2
- At least 2 words should be uncommon for average native speakers

PUZZLES' DATES AND SUGGESTED GROUP TYPES for EACH DAY:
${dates.map((date: string) => `- Date ${date}: ${pickTypes(types).join(", ")}`).join("\n")}

TITLE RULES:
- The title is shown to players
- The title is a SHORT CATEGORY LABEL, not a sentence
- The title must describe the SHARED TOPIC OR MEANING of the words
- Do not describe the relationship itself
- Use 1-4 words whenever possible
- Prefer noun phrases over full descriptions
- Use plain English

Return ONLY JSON.
`

export const repairPrompt = (json: string) => `
You are an ESL Connections puzzle validator and repairer. Analyze the puzzle before making changes.

REPAIR RULES (in order):
1. If all word groups are valid and the puzzle has a unique solution:
    - Keep ALL words unchanged
    - Keep ALL group memberships unchanged
    - Fix ONLY titles that are unclear, vague, metaphorical, poetic, cryptic, or developer-oriented. Titles should be the shortest clear category label possible.
2. If groupings are mostly valid but one or more groups are weak or ambiguous:
    - Modify the minimum number of words necessary
    - Preserve as much of the original puzzle as possible
    - Rewrite titles as needed
3. If the puzzle does not have a unique solution, contains overlapping categories, or multiple groups can reasonably claim the same words:
    - Regenerate only the problematic groups
    - Keep valid groups intact whenever possible
4. Only regenerate the entire puzzle if the overall structure is unsalvageable

TITLE RULES:
- The title is player-facing
- A good title should clearly explain why the 4 words belong together using plain English within 1-6 words

VALIDATION REQUIREMENTS:
- Exactly 4 groups
- Exactly 4 words per group
- 16 unique words total
- No word appears twice
- Single-word entries only
- No proper nouns
- ESL-friendly vocabulary
- One unique intended solution
- Titles must be more descriptive than the type field

Return ONLY fixed JSON.

${json}
`
