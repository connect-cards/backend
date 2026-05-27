import { client } from "./utils";

const VALIDATION_MODEL = "gpt-5-mini";
const prompt = (json: string) => `
The following puzzle is invalid or ambiguous. 

Fix it to meet rules:
- Exactly 4 groups
- No overlap
- Unique solution
- ESL-friendly

Return ONLY fixed JSON.

${json}
`

export async function repairPuzzle(badJson: string) {
    const response = await client.responses.create({
        model: VALIDATION_MODEL,
        input: prompt(badJson),
    });

    return response.output_text;
}