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
- easy: accessible but not trivial. Examples:  blade / brand / steel / sword; stroll / wander / ramble / roam.
- medium: includes informal, literary, or less common vocabulary. Examples: bloke / chap / lad / fella; murky / dingy / somber / dreary.
- hard: uncommon GRE/IELTS vocabulary and near-synonyms preferred over exact synonyms. Examples: scintillating / glittering / sparkly / glittery; laconic / curt / terse / brusque.
- very_hard: obscure, archaic, literary, technical, or rarely used words but should still be valid English vocabulary. Examples: tercet / terzetto / ternion / trine; eldritch / uncanny / unearthly / weird. Avoid super long words if possible.

Prefer these difficulty boosters: archaic words, literary vocabulary, words with multiple meanings, misleading overlaps between categories, rare morphological relatives, thematic ambiguity

TARGER VOCABULARY LEVEL:
- Suitable for IELTS band 7-9, GRE verbal, CEFR level C1-C2
- At least 2 words should be uncommon for average native speakers

PUZZLES' DATES AND SUGGESTED GROUP TYPES for EACH DAY (use as inspiration -- not label):
${dates.map((date: string) => `- Date ${date}: ${pickTypes(types).join(", ")}`).join("\n")}

Return ONLY JSON.
`

export const repairPrompt = (json: string) => `
The following puzzle is ambiguous. 

Fix it to meet rules:
- Exactly 4 groups
- No overlap
- Unique solution
- ESL-friendly

Return ONLY fixed JSON.

${json}
`
