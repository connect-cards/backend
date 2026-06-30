export const generationLexiconGPTModel = "gpt-5.4-nano";
export const generationPuzzleGPTModel = "gpt-5.4";
export const validationPuzzleGPTModel = "gpt-5.4-mini";

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
You are an expert ESL puzzle designer. Generate ${dates.length} DIFFERENT Connections-style puzzles (ONE puzzle per date).

GOAL: 
- Create challenging word-grouping puzzles with sophisticated vocabulary, subtle relationships, misleading overlaps, and EXACTLY ONE valid solution.

OUTPUT RULES:
- Return ONLY JSON
- Generate exactly ${dates.length} puzzles
- Words should rarely repeat across puzzles

PUZZLE RULES (each puzzle):
- EXACTLY 16 UNIQUE English words
- Exactly 4 groups x 4 words
- One group per difficulty: easy, medium, hard, very_hard
- Only ONE correct grouping
- No word overlap between groups
- No proper nouns
- No hyphenated phrases
- Single-word entries only

DIFFICULTY:
- easy: accessible but not trivial
- medium: literary, informal, or less common vocabulary
- hard: uncommon GRE/IELTS-level words; prefer nuanced relationships over exact synonyms
- very_hard: obscure, archaic, literary, technical, or rare vocabulary (avoid excessively long words)

TARGET LEVEL:
- Overall vocabulary: CEFR C1-C2 / IELTS 7-9 / GRE verbal
- Include at least 1 word uncommon to average native speakers
- Prefer ambiguity, multiple meanings, rare morphological relatives, and misleading cross-group similarities

DATES AND SUGGESTED GROUP TYPES:
${dates.map((date: string) => `- Date ${date}: ${pickTypes(types).join(", ")}`).join("\n")}

GROUP TITLE RULES (IMPORTANT): Each group needs a short player-facing category title. Requirements:
- Must be 1-4 words long using plain English
- Describe what the words have in common
- Prefer CATEGORY LABELS (noun phrases) than sentences
- Complete this pattern naturally: "These words are _____"
- Prefer the shortest title that stays specific
- Avoid phrases like: "words for", "terms meaning", "ways of", or difficulty labels
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
