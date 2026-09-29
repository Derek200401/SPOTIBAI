# SPOTIBAI

A Spotify-inspired music app built with Next.js and a dark, humanized interface.

## Features
- Spotify-style layout and player
- Google login flow and continue without Google option
- 20 music tracks in the current library
- GitHub raw audio URLs for each track
- Local cover artwork stored in the project source
- Vercel-ready Next.js app

## Run locally

1. Install dependencies
   npm install

2. Start the app
   npm run dev

3. Open the app in your browser
   http://localhost:3000

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Use the default Next.js settings.
4. Deploy.

## Notes
- Music files are wired to GitHub raw URLs in the data file.
- Album art is stored locally under the public/images folder.
- The Google button is ready for a real Google OAuth implementation with the appropriate Vercel environment variables.
