import fs from "fs-extra";
import { repairPuzzle } from "./utils";

async function main() {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error("\
        Usage: npm run repair [path-to-puzzle-json] \n\
        Example: npm run repair /puzzles/2026/06/01.json"
        );
        return;
    }

    const badJson = fs.readFileSync(filePath, "utf-8");

    const fixed = await repairPuzzle(badJson);

    fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2));

    console.log("Puzzle repaired:", filePath);
}

main();
