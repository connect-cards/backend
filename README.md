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