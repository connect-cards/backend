# connected-cards-backend

## Commands

### Generate Puzzles + Lexicon

- Generate puzzles and lexicon for a whole month:

```bash
npm run generate -- 2026 6
```

- Generate for next month (default when year/month are omitted):

```bash
npm run generate
```

### Generate Puzzles Only

- Generate puzzles for specific day(s):

```bash
npm run generate:puzzles -- 2026-06-01 2026-06-03
```

### Generate Lexicon Only

- Generate lexicon for specific word(s):

```bash
npm run generate:lexicon -- apple banana cherry
```

- Force regenerate lexicon entries even if they already exist:

```bash
npm run generate:lexicon -- apple banana --force
```

## Structure

```
connected-cards-be/
├── puzzles/
│   └── 2026/
│       └── 06/
│           ├── 01.json
│           ├── 02.json
│           └── ...
│
├── lexicon/
│   ├── a.json
│   ├── b.json
│   └── ...
│
├── scripts/
│   ├── generate.ts
│   ├── repair.ts
│
├── src/
│   ├── generatePuzzles.ts
│   ├── generateLexicon.ts
│   ├── repairPuzzle.ts
│   ├── validatePuzzle.ts
│   └── prompts.ts
│   └── schema.ts
│   └── utils.ts
│
├── .github/workflows/
│   └── monthly-generation.yml
│
├── package.json
└── tsconfig.json
```