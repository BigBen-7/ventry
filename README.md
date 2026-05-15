# Ventry

> Save and track job listings as you browse. One click captures the role, company, and URL — then you move it through your pipeline right in the popup.

<!-- demo GIF placeholder — replace with actual recording before publishing -->
![Ventry demo](./demo.gif)

---

## What it does

- **Save in one click** — hit "Save job" on any listing and Ventry scrapes the title and company automatically (LinkedIn, Indeed, and Greenhouse supported; falls back to page title + hostname everywhere else)
- **Track your pipeline** — move each job through: Saved → Applied → Interviewing → Offer / Rejected
- **See your stats at a glance** — the popup header shows active counts per stage; the extension badge shows your total active applications
- **Filter by status** — narrow the list to any stage with one click
- **Link back instantly** — every card links to the original job posting

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 5 |
| Storage | `chrome.storage.local` |
| Runtime deps | None — Chrome APIs only |
| Extension | Manifest V3 |

---

## Install locally

> Requires Node 18+ and a Chromium-based browser.

```bash
# 1. Clone and install
git clone https://github.com/BigBen-7/ventry.git
cd ventry
npm install

# 2. Build
npm run build

# 3. Load in Chrome
#    Open chrome://extensions → enable Developer mode → Load unpacked → select the dist/ folder
```

Changes are picked up automatically with the watch build:

```bash
npm run dev
```

After each save, click the reload icon on the extension card in `chrome://extensions`.

---

## Type-check

```bash
npm run typecheck
```

---

## Project structure

```
src/
├── background/
│   ├── service-worker.ts   # message router + badge updates
│   └── storage.ts          # chrome.storage.local CRUD
├── content/
│   └── scraper.ts          # page scraper with site-specific selectors
├── popup/
│   ├── Popup.tsx           # root component, all async state
│   ├── JobCard.tsx         # single job row with status dropdown
│   ├── FilterBar.tsx       # status filter tabs
│   └── StatsHeader.tsx     # active count + pipeline pills
└── shared/
    ├── types.ts            # Job, Status, message types
    └── constants.ts        # storage key, labels, pipeline transitions
```

---

## Roadmap

- [ ] Real icon artwork
- [ ] Popup styles / theme
- [ ] Export to CSV
- [ ] Notes per job
