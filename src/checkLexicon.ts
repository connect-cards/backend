import fs from "fs-extra";

export function checkLexicon(words: string[]) {
    const lexiconCache = new Map<string, Record<string, any>>();
    const missing: string[] = [];
    const existing: string[] = [];

    for (const word of words) {
        const letter = word[0].toLowerCase();
        const file = `lexicon/${letter}.json`;

        if (!lexiconCache.has(letter)) {
            const existingObj = fs.existsSync(file) ? fs.readJSONSync(file) : {};
            lexiconCache.set(letter, existingObj);
        }

        const existingObj = lexiconCache.get(letter) ?? {};
        if (Object.prototype.hasOwnProperty.call(existingObj, word)) existing.push(word);
        else missing.push(word);
    }

    return { missing, existing };
};
