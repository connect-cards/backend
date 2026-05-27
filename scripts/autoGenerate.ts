import fs from "fs-extra";
import { generateMonthlyPuzzles, generateLexicon } from "../src";

function getNextMonth() {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 2; // zero-based

    if (month === 13) {
        year += 1;
        month = 1;
    }

    return { year, month };
}

async function main() {
    const { year, month } = getNextMonth();
    await generateMonthlyPuzzles(year, month);
    const words = new Set<string>();
    const folder = `puzzles/${year}/${String(month).padStart(2, '0')}`;
    const puzzleFiles = fs.readdirSync(folder);
    const lexiconCache = new Map<string, Record<string, any>>();

    // Get words from new puzzles
    for (const file of puzzleFiles) {
        const puzzle = fs.readJSONSync(`${folder}/${file}`);
        puzzle.groups.forEach((g: any) => g.words.forEach((w: string) => words.add(w)));
    }

    // Generate lexicon for new words only
    const newWords = [...words].filter((word) => {
        const letter = word[0].toLowerCase();
        const file = `lexicon/${letter}.json`;

        if (!lexiconCache.has(letter)) {
            const existing = fs.existsSync(file) ? fs.readJSONSync(file) : {};
            lexiconCache.set(letter, existing);
        }

        const existing = lexiconCache.get(letter) ?? {};
        return !Object.prototype.hasOwnProperty.call(existing, word);
    });
    if (newWords.length > 0) await generateLexicon(newWords);
}

main();
