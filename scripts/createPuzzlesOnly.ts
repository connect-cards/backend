import { generatePuzzles, validatePuzzle } from "../src";

function printUsage() {
    console.error("Usage: npm run create:puzzles -- <YYYY-MM-DD> [YYYY-MM-DD ...]");
    console.error("Example: npm run create:puzzles -- 2026-06-01 2026-06-03");
}

function normalizeDate(input: string): string | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(Date.UTC(year, month - 1, day));
    const isValidDate =
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day;

    if (!isValidDate) return null;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function main() {
    const args = process.argv.slice(2).map((arg) => arg.trim()).filter(Boolean);

    if (args.length === 0) {
        printUsage();
        process.exitCode = 1;
        return;
    }

    const seen = new Set<string>();
    const validDates: string[] = [];
    const invalidDates: string[] = [];

    for (const arg of args) {
        const normalized = normalizeDate(arg);
        if (!normalized) {
            invalidDates.push(arg);
            continue;
        }

        if (!seen.has(normalized)) {
            seen.add(normalized);
            validDates.push(normalized);
        }
    }

    if (invalidDates.length > 0) {
        console.error("Invalid date(s):", invalidDates.join(", "));
        printUsage();
        process.exitCode = 1;
        return;
    }

    console.log(`Generating puzzles for ${validDates.length} date(s): ${validDates.join(", ")}`);
    const puzzles = await generatePuzzles(validDates);
    const invalidPuzzles = puzzles.filter((puzzle: any) => validatePuzzle(puzzle));

    console.log("Puzzles generated for requested date(s).");
    if (invalidPuzzles.length > 0) console.log("Invalid puzzle date(s):", invalidPuzzles.map((puzzle: any) => puzzle.date ?? "unknown").join(", "));

    const generatedWords = [...new Set(puzzles.flatMap((puzzle: any) => puzzle.groups.flatMap((group: any) => group.words)))];
    console.log(`Generated words (${generatedWords.length}): ${generatedWords.join(" ")}`);
}

main().catch((error) => {
    console.error("Failed to generate puzzles for requested day(s):", error);
    process.exitCode = 1;
});
