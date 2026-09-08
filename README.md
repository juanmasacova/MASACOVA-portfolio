# MEGR 2156 – Design Portfolio

This repository is a plain-HTML site built with Jekyll (which GitHub Pages runs natively) with the Analyze / Decide / Communicate framework built into every lab page. Every page is hand-written HTML — the shared sidebar/header live in `docs/_includes/`, so you get full CSS/JS freedom on each page without duplicating the nav everywhere. The rendered site lives in `docs/`; this README is just for people working with the repo itself.

## Preview locally

Requires Ruby and Bundler.

```bash
bundle install
bundle exec jekyll serve --source docs --destination _site
```

Then open http://127.0.0.1:4000 in your browser. Editing any `.html` file, or `docs/assets/css/style.css`, reloads live.

## Publish

Push to `main` — the included GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site with Jekyll and publishes it to GitHub Pages automatically.

## Structure

```
MASACOVA-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          <- GitHub Actions: auto-builds and deploys to Pages on every push
├── docs/                       <- Jekyll source root
│   ├── _config.yml             <- site title/description/baseurl
│   ├── _data/nav.yml           <- sidebar nav entries (edit this to add/reorder nav links)
│   ├── _includes/              <- shared head/nav/footer HTML
│   ├── _layouts/default.html   <- page wrapper (head + nav + content + footer)
│   ├── assets/
│   │   ├── css/style.css       <- all site styling — edit freely
│   │   └── js/nav.js           <- mobile nav toggle
│   ├── index.html              <- Portfolio homepage
│   ├── portfolio-overview.html <- Running index of all labs with status
│   ├── aboutme/
│   │   └── index.html          <- About Me page
│   ├── finalproject/
│   │   └── index.html          <- Final Project page
│   └── Labs/
│       ├── L01/
│       │   └── index.html      <- L1: Create Portfolio
│       ├── L02/
│       │   └── index.html      <- L2: Print Something Small
│       ├── L03/
│       │   └── index.html      <- L3: [Topic]
│       ├── L04/
│       │   └── index.html      <- L4: [Topic]
│       ├── L05/
│       │   └── index.html      <- L5: [Topic]
│       ├── L06/
│       │   └── index.html      <- L6: [Topic]
│       ├── L07/
│       │   └── index.html      <- L7: [Topic]
│       ├── L08/
│       │   └── index.html      <- L8: Gears
│       ├── L09/
│       │   └── index.html      <- L9: Pulleys
│       ├── L10/
│       │   └── index.html      <- L10: Lead Screw Translating System
│       └── L11/
│           └── index.html      <- L11: Motor Selection
├── templates/
│   └── assignment-template.html <- Blank lab page for reference (not published)
├── .gitignore
├── Gemfile                     <- Ruby/Jekyll dependency
└── README.md                   <- This file
```

## Adding or renaming a lab

1. Add a new folder under `docs/Labs/` with an `index.html` (copy `templates/assignment-template.html` as a starting point).
2. Add a matching entry to `docs/_data/nav.yml` under `Labs: children:` — this is what makes it appear in the sidebar on every page.
