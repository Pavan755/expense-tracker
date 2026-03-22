# Expense Tracker

A mobile-first expense tracking app built with Expo and React Native.

The app helps you record expenses quickly, view category-wise spending, and track your total outflow with a simple dashboard and pie chart.

## Features

- Add expenses with amount, category, and optional note
- Edit existing expense entries in a modal
- Delete expenses instantly
- Filter by category or view all expenses
- View total spending summary on the dashboard
- Visualize spending split with a pie chart
- Persist data locally using AsyncStorage

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router (file-based navigation)
- AsyncStorage for local persistence
- react-native-chart-kit for charting
- TypeScript-enabled project setup

## Project Structure

```text
app/
  _layout.tsx            # Root stack layout
  modal.tsx              # Example modal route from template
  (tabs)/
    _layout.tsx          # Bottom tabs (Home, Explore)
    index.tsx            # Main expense tracker screen
    explore.tsx          # Explore screen
components/              # Shared UI components
constants/               # Theme constants
hooks/                   # Reusable hooks
scripts/                 # Utility scripts (including reset script)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo Go app (for physical device testing), or Android/iOS simulator

### Installation

```bash
npm install
```

### Run the App

```bash
npm run start
```

From the Expo CLI menu:

- Press `a` to open Android
- Press `i` to open iOS (macOS only)
- Press `w` to open Web

## Available Scripts

- `npm run start` - start Expo development server
- `npm run android` - start and open Android target
- `npm run ios` - start and open iOS target
- `npm run web` - start and open web target
- `npm run lint` - run Expo ESLint checks
- `npm run build:web` - export static web build to `dist/`
- `npm run reset-project` - reset template scaffold (use with care)

## Deploy to GitHub Pages

This project includes an automated GitHub Actions workflow at
`.github/workflows/deploy-pages.yml`.

### One-time GitHub setup

1. Push this repository to GitHub.
2. Open repository settings on GitHub.
3. Go to **Pages** and set **Source** to **GitHub Actions**.
4. Ensure your default branch is `main` (or update the workflow trigger branch).

### Deployment flow

1. Push to `main`.
2. GitHub Actions exports Expo web using the repository name as base path.
3. The workflow publishes `dist/` to GitHub Pages.

After deployment, your site URL is typically:

`https://<your-github-username>.github.io/<your-repo-name>/`

### Local production build check

```bash
npm run build:web
```

## Data Model (Current)

Each expense is stored as:

```ts
{
  id: string;
  amount: number;
  category: string;
  note: string;
}
```

All entries are saved under the AsyncStorage key `expenses`.

## Roadmap

- Monthly and weekly analytics
- Budget limit alerts
- Search and sort controls
- Cloud sync and authentication
- Export/import expense history

## Notes

- Currency display currently uses the `₹` symbol.
- The `Explore` tab still contains starter/template content and can be repurposed.

## License

This project is currently unlicensed.