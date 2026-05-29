import fs from "fs-extra";
import { generatePuzzles, generateLexicon, checkLexicon, checkPuzzleInventory, validatePuzzle } from "../src";

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

function getDaysInMonth(year: number, month: number) {
    const numDays = new Date(year, month, 0).getDate();
    return numDays;
}

async function main() {
    // STEP 1: Get year and month
    let year = Number(process.argv[2]);
    let month = Number(process.argv[3]);

    if (!year || !month) {
        console.log(`Either year (2nd arg) or month (3rd arg) not specified. Using default values (next month) instead!\n\n\
            ------------\n\
            Usage: npm run create -- [year] [month] \n\
            Example: npm run create -- 2026 6`);
        
        const date = getNextMonth();
        year = date.year;
        month = date.month;
    }

    // STEP 2: Generate puzzles
    console.log(`Generating puzzles for ${year}/${month}...`);

    const mm = String(month).padStart(2, "0");
    const numDays = getDaysInMonth(year, month);
    const requestedDates: string[] = [];
    const batches = [];
    const DAYS_PER_BATCH = 4;
    for (let i = 1; i <= numDays; i += DAYS_PER_BATCH) {
        const dates = Array.from(
            { length: Math.min(DAYS_PER_BATCH, numDays - i + 1) },
            (_, j) => `${year}-${mm}-${String(i + j).padStart(2, "0")}`
        );
        requestedDates.push(...dates);
        batches.push(generatePuzzles(dates));
    }
    const generatedBatches = await Promise.all(batches);
    const generatedPuzzles = generatedBatches.flat();
    const invalidPuzzles = generatedPuzzles.filter((puzzle: any) => !validatePuzzle(puzzle));
    const generatedDates = new Set(generatedPuzzles.map((puzzle: any) => puzzle?.date).filter(Boolean));
    const skippedDates = requestedDates.filter((date) => !generatedDates.has(date));
    const { missing: missingDates } = checkPuzzleInventory(requestedDates);

    console.log(`Puzzles generated: /puzzles/${year}/${month}`);
    if (invalidPuzzles.length > 0) console.log(`Invalid ${invalidPuzzles.length} puzzle date(s): ${invalidPuzzles.map((puzzle: any) => puzzle.date ?? "unknown").join(" ")}`);
    if (skippedDates.length > 0) console.log(`Skipped ${skippedDates.length} puzzle date(s) from generation.`);
    if (missingDates.length > 0) console.log(`Missing ${missingDates.length} puzzle date(s) in inventory: ${missingDates.join(" ")}`);

    // STEP 3: Generate lexicon
    console.log('Generating lexicon...')

    const words = new Set<string>();
    const folder = `puzzles/${year}/${String(month).padStart(2, '0')}`;
    const puzzleFiles = fs.readdirSync(folder);
    // Get words from new puzzles
    for (const file of puzzleFiles) {
        const puzzle = fs.readJSONSync(`${folder}/${file}`);
        puzzle.groups.forEach((g: any) => g.words.forEach((w: string) => words.add(w)));
    }

    // Generate lexicon for new words only
    const { missing: newWords, existing: skippedWords } = checkLexicon([...words]);
    if (newWords.length > 0) await generateLexicon(newWords);

    // Check which lexicon entries were created and which are still missing
    const { missing: missingNow } = checkLexicon(newWords);
    console.log(`Lexicon generated for ${newWords.length - missingNow.length} word(s).`);
    if (skippedWords.length > 0) console.log(`Skipped ${skippedWords.length} existing word(s).}`);
    if (missingNow.length > 0) console.log(`Missing ${missingNow.length} lexicon word(s) in inventory: ${missingNow.join(' ')}`);
}

main();
