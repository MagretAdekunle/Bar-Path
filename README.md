# BarPath

A React application for tracking Olympic weightlifting progress, body composition, competition readiness, and dashboard customization.

## Features

- Snatch / clean & jerk tracking
- Texas record comparison for the women’s 71 kg class
- Goal weight and cut progress
- Competition date and bodyweight planning
- Dashboard widget toggles
- Data source adapters for TeamBuildr, Apple Health, and VeSync

## Local development

```bash
cd Bar-Path
npx -p node@22 npm install
npx -p node@22 npm run dev -- --host 0.0.0.0
```

## Real integrations

Copy `.env.example` to `.env` and set the API URL and token values for the data sources you want to connect.

```bash
cp .env.example .env
```

Then add values like:

```bash
VITE_TEAMBUILDR_API_URL=https://api.example.com/teambuildr
VITE_TEAMBUILDR_TOKEN=your-token
VITE_VESYNC_API_URL=https://api.example.com/vesync
VITE_VESYNC_TOKEN=your-token
```

If you do not provide an API URL for a source, the app falls back to the bundled JSON fixtures in `public/data/`.

## Notes

- Apple Health is not directly available to a browser-only app without a backend or native mobile wrapper.
- For production use, server-side or mobile integrations should be used to access HealthKit or OAuth-protected APIs securely.
