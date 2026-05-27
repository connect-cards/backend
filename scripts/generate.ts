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
    // STEP 1: Get year and month
    let year = Number(process.argv[2]);
    let month = Number(process.argv[3]);

    if (!year || !month) {
        console.log(`Either year (2nd arg) or month (3rd arg) not specified. Using default values instead!\n\n\
            ------------\n\
            Usage: npm run generate [year] [month] \n\
            Example: npm run generate 2026 6`);
        
        const date = getNextMonth();
        year = date.year;
        month = date.month;
    }

    // STEP 2: Generate puzzles

    console.log(`Generating puzzles for ${year}/${month}...`);

    await generateMonthlyPuzzles(year, month);

    console.log(`Puzzles generated: /puzzles/${year}/${month}`);

    // STEP 3: Generate lexicon

    console.log('Generating lexicon...')

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

    console.log('Lexicon generated:', newWords.join(', '));
}

main();
