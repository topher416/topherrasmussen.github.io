import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get API key from CLI arg or env var
const TMDB_API_KEY = process.argv[2] || process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('Usage: node fetch-tmdb-data.js YOUR_TMDB_API_KEY');
  console.error('   or set TMDB_API_KEY in your environment');
  console.error('\nGet your free API key at: https://www.themoviedb.org/settings/api');
  process.exit(1);
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`  Retry ${i + 1}/${retries - 1} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function getMovieDetailsFromIMDB(imdbId) {
  const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const data = await fetchWithRetry(url);

  if (data.movie_results && data.movie_results.length > 0) {
    return data.movie_results[0];
  }
  return null;
}

async function getWatchProviders(tmdbId) {
  const url = `${TMDB_BASE_URL}/movie/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`;
  const data = await fetchWithRetry(url);

  // Return US providers (change country code if needed)
  const usProviders = data.results?.US;

  if (!usProviders) return null;

  return {
    link: usProviders.link || null,
    flatrate: usProviders.flatrate?.map(p => ({
      name: p.provider_name,
      logo: `https://image.tmdb.org/t/p/original${p.logo_path}`
    })) || [],
    rent: usProviders.rent?.map(p => ({
      name: p.provider_name,
      logo: `https://image.tmdb.org/t/p/original${p.logo_path}`
    })) || [],
    buy: usProviders.buy?.map(p => ({
      name: p.provider_name,
      logo: `https://image.tmdb.org/t/p/original${p.logo_path}`
    })) || []
  };
}

async function enrichMovieData(movie) {
  console.log(`\nProcessing: ${movie.title} (${movie.year})`);

  if (!movie.imdbId) {
    console.log('  ⚠️  No IMDB ID - skipping');
    return movie;
  }

  try {
    // Get TMDB details from IMDB ID
    const tmdbMovie = await getMovieDetailsFromIMDB(movie.imdbId);

    if (!tmdbMovie) {
      console.log('  ⚠️  Not found on TMDB');
      return movie;
    }

    // Get watch providers
    const watchProviders = await getWatchProviders(tmdbMovie.id);

    const enrichedMovie = {
      ...movie,
      posterUrl: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}` : null,
      backdropUrl: tmdbMovie.backdrop_path ? `${TMDB_IMAGE_BASE}${tmdbMovie.backdrop_path}` : null,
      tmdbId: tmdbMovie.id,
      watchProviders: watchProviders
    };

    console.log(`  ✓ Poster: ${enrichedMovie.posterUrl ? 'Found' : 'Not found'}`);
    console.log(`  ✓ Watch providers: ${watchProviders ?
      `${watchProviders.flatrate?.length || 0} streaming, ${watchProviders.rent?.length || 0} rent, ${watchProviders.buy?.length || 0} buy` :
      'None'}`);

    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 250));

    return enrichedMovie;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return movie;
  }
}

async function main() {
  const moviesPath = path.join(__dirname, 'movies.json');
  const movies = JSON.parse(fs.readFileSync(moviesPath, 'utf-8'));

  console.log(`\n🎬 Fetching TMDB data for ${movies.length} movies...`);
  console.log('═'.repeat(60));

  const enrichedMovies = [];

  for (const movie of movies) {
    const enriched = await enrichMovieData(movie);
    enrichedMovies.push(enriched);
  }

  // Backup original
  const backupPath = path.join(__dirname, 'movies.backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(movies, null, 2));
  console.log(`\n💾 Backup saved to: ${backupPath}`);

  // Write enriched data (root)
  fs.writeFileSync(moviesPath, JSON.stringify(enrichedMovies, null, 2));
  console.log(`✅ Updated movies.json with TMDB data`);

  // Also sync to public/movies.json so the app serves enriched data in dev and prod
  try {
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicMoviesPath = path.join(publicDir, 'movies.json');
    fs.writeFileSync(publicMoviesPath, JSON.stringify(enrichedMovies, null, 2));
    console.log(`✅ Synced enriched data to: ${publicMoviesPath}\n`);
  } catch (err) {
    console.warn('⚠️  Could not write to public/movies.json:', err?.message || err);
  }

  // Stats
  const withPosters = enrichedMovies.filter(m => m.posterUrl).length;
  const withProviders = enrichedMovies.filter(m => m.watchProviders).length;

  console.log('📊 Stats:');
  console.log(`   Posters found: ${withPosters}/${movies.length}`);
  console.log(`   Watch providers found: ${withProviders}/${movies.length}`);
}

main().catch(console.error);
