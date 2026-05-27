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
│   ├── autoGenerate.ts
│   ├── devGenerate.ts
│   ├── devRepair.ts
│
├── src/
│   ├── generatePuzzles.ts
│   ├── generateLexicon.ts
│   ├── validatePuzzle.ts
│   ├── repairPuzzle.ts
│   └── utils.ts
│   └── schema.ts
│
├── .github/workflows/
│   └── monthly-generation.yml
│
├── package.json
└── tsconfig.json
```