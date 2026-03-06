# AWS User Group Ensenada — Community Dashboard

A data visualization dashboard for the [AWS User Group Ensenada](https://www.meetup.com/aws-user-group-ensenada/) community, built with React and Recharts. It displays member statistics, growth trends, geographic distribution, event attendance, and top contributors — all sourced from a Meetup-exported CSV file.

## Features

- **Community stats** — total members, active members, cities represented, and organizers
- **Growth chart** — cumulative member count and monthly new members over time
- **Location chart** — top cities by member count
- **Event attendance chart** — attendees per event over time
- **Top contributors** — ranked table of members by events attended
- **Dark / Light mode** — toggle in the header, defaults to dark

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling (dark mode via `class` strategy) |
| [Recharts](https://recharts.org/) | Charts |
| [PapaParse](https://www.papaparse.com/) | CSV parsing |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/your-org/aws-ug-ensenada-dashboard.git
cd aws-ug-ensenada-dashboard
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for production

```bash
npm run build
```

The output is in the `dist/` folder, ready to be served as a static site.

## Data Setup

The dashboard reads from `public/members.csv`, which must be generated from a Meetup group export before running the app.

### 1. Export data from Meetup

Go to your Meetup group > **Manage group** > **Members** > **Export member list** and download the CSV file.

### 2. Sanitize the data

The raw export contains personal information (full names, profile URLs, etc.). Run the sanitize script to strip sensitive fields before committing:

```bash
npm run sanitize path/to/raw-export.csv
```

This generates `public/members.csv` with only the fields needed for the dashboard (first name only, location, join date, attendance counts, and role). The original export file should be added to `.gitignore` and never committed.

## Project Structure

```
src/
  components/
    StatCards.jsx          # Top-level KPI cards
    GrowthChart.jsx        # Area + bar combo chart
    LocationChart.jsx      # Horizontal bar chart by city
    EventAttendanceChart.jsx  # Bar chart per event
    TopContributors.jsx    # Ranked members table
  utils/
    parseMembers.js        # Data transformation functions
  App.jsx                  # Root component, CSV loading, theme state
  index.css                # Tailwind base + scrollbar styles
scripts/
  sanitize-data.js         # Strips PII from raw Meetup CSV export
public/
  members.csv              # Sanitized data (committed)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run sanitize [input] [output]` | Sanitize raw Meetup CSV export |

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and improvements.

## License

MIT
