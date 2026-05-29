import fs from "fs-extra";
import { generateLexicon, checkLexicon } from "./utils";

function printUsage() {
    console.error("Usage: npm run create:lexicon -- <word> [word ...] [--force]");
    console.error("Example: npm run create:lexicon -- apple banana cherry");
    console.error("Example: npm run create:lexicon -- apple banana --force");
}

function isValidWord(word: string): boolean {
    return /^[A-Za-z].+/.test(word) || /^[A-Za-z]$/.test(word);
}

async function main() {
    const args = process.argv.slice(2).map((arg) => arg.trim()).filter(Boolean);

    if (args.length === 0) {
        printUsage();
        process.exitCode = 1;
        return;
    }

    let force = false;
    const inputWords: string[] = [];

    for (const arg of args) {
        if (arg === "--force") {
            force = true;
            continue;
        }
        inputWords.push(arg);
    }

    if (inputWords.length === 0) {
        printUsage();
        process.exitCode = 1;
        return;
    }

    const uniqueWords = [...new Set(inputWords)];
    const invalidWords = uniqueWords.filter((word) => !isValidWord(word));

    if (invalidWords.length > 0) {
        console.error("Invalid word(s):", invalidWords.join(", "));
        console.error("Each word must start with an English alphabet character.");
        process.exitCode = 1;
        return;
    }

    if (force) {
        console.log(`Generating lexicon for ${uniqueWords.length} word(s) in --force mode...`);
        await generateLexicon(uniqueWords);

        const { missing: missingNow } = checkLexicon(uniqueWords);
        console.log(`Lexicon generated for ${uniqueWords.length - missingNow.length} word(s).`);
        if (missingNow.length > 0) console.log(`Missing ${missingNow.length} lexicon word(s) in inventory: ${missingNow.join(" ")}`);
        return;
    }

    const { missing: newWords, existing: skippedWords } = checkLexicon(uniqueWords);

    if (newWords.length === 0) {
        console.log(`No new words to generate.`);
        return;
    }

    console.log(`Generating lexicon for ${newWords.length} new word(s)...`);
    await generateLexicon(newWords);

    const { missing: missingNow } = checkLexicon(newWords);
    console.log(`Lexicon generated for ${newWords.length - missingNow.length} word(s).`);
    if (skippedWords.length > 0) console.log(`Skipped ${skippedWords.length} existing word(s).`);
    if (missingNow.length > 0) console.log(`Missing ${missingNow.length} lexicon word(s) in inventory: ${missingNow.join(" ")}`);
}

main().catch((error) => {
    console.error("Failed to generate lexicon for requested word(s):", error);
    process.exitCode = 1;
});
