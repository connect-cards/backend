# connected-cards-backend

## Commands

### Create Puzzles + Lexicon

- Create puzzles and lexicon for a whole month:

```bash
npm run create -- 2026 6
```

- Create puzzles and lexicon for next month (default when year/month are omitted):

```bash
npm run create
```

### Create Puzzles Only

- Create puzzles for specific day(s):

```bash
npm run create:puzzles -- 2026-06-01 2026-06-03
```

### Create Lexicon Only

- Create lexicon for specific word(s):

```bash
npm run create:lexicon -- apple banana cherry
```

- Force recreate lexicon entries even if they already exist:

```bash
npm run create:lexicon -- apple banana --force
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
├── src/
│   ├── llm
│   │   ├── client.ts
│   │   ├── prompts.ts
│   │   └── schema.ts
│   │
│   ├── utils
│   │   ├── generatePuzzles.ts
│   │   ├── generateLexicon.ts
│   │   ├── checkLexicon.ts
│   │   └── checkPuzzle.ts
│   │
│   ├── create.ts
│   └── repair.ts
│
├── .github/workflows/
│   └── monthly-generation.yml
│
├── package.json
└── tsconfig.json
```