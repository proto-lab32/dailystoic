# Stoic Daily

A personal Stoic practice journal for daily morning, daytime, and evening reflections. Built with React and designed to be hosted on Vercel.

## Features

- **Daily Quote**: A rotating philosophical quote from Marcus Aurelius, Seneca, and Epictetus
- **Morning Practice**: Premeditatio Malorum, Identity Declaration, Timeline Perspective
- **Daytime Practice**: In-the-moment Stoic reframing tools and reflection
- **Evening Practice**: Daily review following Marcus Aurelius' method
- **Journal Archive**: View all past entries with expandable cards
- **Auto-save**: Entries save automatically as you type
- **Export/Import**: Back up your journal as JSON or import from backup

## Data Storage

Your journal entries are stored in your browser's localStorage. This means:
- ✅ Your data stays private on your device
- ✅ No account or server required
- ⚠️ Data is browser-specific (won't sync across devices)
- ⚠️ Clearing browser data will delete entries

**Important**: Use the Export feature regularly to back up your journal!

## Deploy to Vercel

### Option 1: Quick Deploy (Recommended)

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite — just click "Deploy"

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Adding Quotes

Edit the `STOIC_QUOTES` array in `src/App.jsx` to add your own quotes:

```javascript
{ text: "Your quote here", author: "Author Name" }
```

The quote displayed each day is determined by the day of year, cycling through all quotes.

### Styling

Colors and fonts are defined as CSS variables in `src/App.css`. The main variables:

- `--bg-primary`: Main background
- `--accent-gold`: Highlight/accent color
- `--font-display`: Heading font (Cormorant Garamond)
- `--font-body`: Body text font (Libre Franklin)

---

*Practice daily. Progress inevitably.*
