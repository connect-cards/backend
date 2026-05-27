import { generateMonthlyPuzzles } from "../src";

async function main() {
    const year = Number(process.argv[2]);
    const month = Number(process.argv[3]);

    if (!year || !month) {
        console.error(" \
            Usage: npm run generate [year] [month] \n\
            Example: npm run generate 2026 6");
        return;
    }
    
    await generateMonthlyPuzzles(year, month);

    console.log(`Puzzle generated: /puzzles/${year}/${month}`);
}

main();
