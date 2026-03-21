# Portfolio

[![GitHub Pages](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-blue?style=flat-square&logo=github)](https://parsa-faraji.github.io/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)]()
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)]()

A clean, minimal personal portfolio site that dynamically loads profile data from a JSON config and fetches projects directly from the GitHub API.

## Features

- **Dynamic Content** -- Profile info, experience, education, and skills are all loaded from `data/profile.json`.
- **GitHub Integration** -- Projects section automatically fetches and displays repos via the GitHub API with configurable filters (whitelist, exclude forks/orgs).
- **Responsive Design** -- Mobile-first layout with hamburger navigation for small screens.
- **Scroll Animations** -- Subtle fade-in effects powered by the Intersection Observer API.
- **Zero Dependencies** -- Pure HTML, CSS, and vanilla JavaScript. No build step required.

## Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/parsa-faraji/portfolio.git
   cd portfolio
   ```

2. **Edit your profile** -- Open `data/profile.json` and fill in your info (name, bio, skills, experience, education, social links, GitHub config).

3. **Add your photo** -- Replace `assets/profile.png` with your own image.

4. **Serve locally** -- Open `index.html` directly in a browser, or use any static server:
   ```bash
   npx serve .
   ```

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings > Pages**.
3. Set source to the `main` branch and root (`/`).
4. Your site will be live at `https://<username>.github.io/portfolio`.

## Project Structure

```
portfolio/
├── assets/
│   └── profile.png        # Profile photo
├── css/
│   └── styles.css          # All styles
├── data/
│   └── profile.json        # Site configuration
├── js/
│   ├── github.js           # GitHub API integration
│   └── main.js             # App initialization & DOM logic
├── index.html              # Entry point
└── .gitignore
```

## Customization

All personal data lives in `data/profile.json`. Key fields:

| Field | Description |
|-------|-------------|
| `name`, `title`, `tagline` | Hero section text |
| `bio`, `skills` | About section |
| `experience[]` | Work experience timeline |
| `education[]` | Education cards |
| `github.username` | Used to fetch repos |
| `github.whitelist` | Array of repo names to display (empty = show all) |
| `github.excludeForks` | Filter out forked repos |

## License

This project is licensed under the [MIT License](LICENSE).
