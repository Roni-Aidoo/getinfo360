/**
 * generate-meta.js
 * ------------------------------------------------------------
 * Build-time static page generator for social/SEO meta tags.
 *
 * WHAT IT DOES
 * For every entry in ARTICLES / STORIES / TRENDING, this makes a
 * real, physical HTML file (e.g. articles/beyond-the-headlines.html)
 * that is a copy of your template page but with the <title> and
 * Open Graph / Twitter meta tags replaced with that item's real
 * title, excerpt, and image — written directly into the HTML text,
 * not injected by JavaScript. That's what makes it visible to
 * Facebook/Twitter/WhatsApp/Slack/etc. crawlers, which don't run JS.
 *
 * Your existing page JS (slug lookup, rendering the body, etc.)
 * keeps working exactly as before for real visitors — this script
 * only touches the <head> meta tags.
 *
 * HOW TO RUN
 *   1. npm install cheerio        (a tiny, safe HTML parser/editor)
 *   2. node generate-meta.js
 *   3. Deploy the generated folders (articles/, stories/, trends/)
 *      alongside the rest of your site.
 *
 * Re-run this any time your data files change, or wire it into a
 * GitHub Action / npm "build" script so it runs automatically.
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio'); // npm install cheerio

// ============================================================
// CONFIG — edit these to match your project
// ============================================================
const SITE_BASE_URL = 'https://getinfoonline.com'; // no trailing slash

const PAGES = [
  {
    // Trending Issues
    templateFile: 'trend.html',
    dataFile: 'trend-data.js',
    dataVarName: 'TRENDING',
    outputDir: 'trends',
    urlPathPrefix: '/trends/',
    ogType: 'article',
  },
  {
    // 360 Echoes articles
    templateFile: 'article.html',
    dataFile: 'articles-data.js',
    dataVarName: 'ARTICLES',
    outputDir: 'articles',
    urlPathPrefix: '/articles/',
    ogType: 'article',
  },
  {
    // Stories & Books
    templateFile: 'Story.html',
    dataFile: 'Stories-data.js',
    dataVarName: 'STORIES',
    outputDir: 'stories',
    urlPathPrefix: '/stories/',
    ogType: 'book',
  },
];

// ============================================================
// Helpers
// ============================================================

/** Load a browser-style data file (e.g. `const ARTICLES = [...]`) into Node. */
function loadDataArray(dataFile, dataVarName) {
  const fullPath = path.resolve(process.cwd(), dataFile);
  const code = fs.readFileSync(fullPath, 'utf8');

  // Run the file's code in a sandboxed context and pull out the variable.
  // This avoids having to permanently edit your data files with
  // module.exports — it works on the original browser file as-is.
  //
  // NOTE: top-level `const`/`let` declarations do NOT become properties
  // of the sandbox object the way `var` does — they live in the context's
  // internal lexical environment instead. So we run a second, tiny script
  // in that same context right after, which reaches into that lexical
  // environment and explicitly copies the variable onto the sandbox object.
  const vm = require('vm');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: dataFile });
  vm.runInContext(
    `this.__EXTRACTED__ = (typeof ${dataVarName} !== 'undefined') ? ${dataVarName} : undefined;`,
    sandbox,
    { filename: `${dataFile} (extract)` }
  );

  const data = sandbox.__EXTRACTED__;
  if (!Array.isArray(data)) {
    throw new Error(`Could not find an array named "${dataVarName}" in ${dataFile}`);
  }
  return data;
}

function absoluteUrl(maybeRelativePath) {
  if (!maybeRelativePath) return `${SITE_BASE_URL}/Assets/GETORI.png`;
  if (/^https?:\/\//i.test(maybeRelativePath)) return maybeRelativePath;
  const cleanPath = maybeRelativePath.replace(/^\/+/, '');
  return `${SITE_BASE_URL}/${cleanPath}`;
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1).trim() + '…' : str;
}

/** Apply one item's data onto a loaded template's <head> tags, by id. */
function applyMeta($, item, cfg) {
  const title = item.title || 'Getinfo Online';
  const description = truncate(item.excerpt || '', 200);
  const image = absoluteUrl(item.image);
  const url = `${SITE_BASE_URL}${cfg.urlPathPrefix}${item.slug}.html`;

  $('#meta-title').text(title);
  $('#meta-description').attr('content', description);

  $('meta[property="og:type"]').attr('content', cfg.ogType);
  $('#meta-og-title').attr('content', title);
  $('#meta-og-description').attr('content', description);
  $('#meta-og-image').attr('content', image);
  $('#meta-og-url').attr('content', url);

  $('#meta-twitter-title').attr('content', title);
  $('#meta-twitter-description').attr('content', description);
  $('#meta-twitter-image').attr('content', image);

  $('#meta-canonical').attr('href', url);

  // Also update the plain <title> tag text (some crawlers/readers use this too)
  $('title').first().text(`${title} | Getinfo Online`);
}

// ============================================================
// Main build
// ============================================================
function buildPageSet(cfg) {
  const templatePath = path.resolve(process.cwd(), cfg.templateFile);
  if (!fs.existsSync(templatePath)) {
    console.warn(`⚠️  Skipping "${cfg.templateFile}" — file not found.`);
    return;
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const items = loadDataArray(cfg.dataFile, cfg.dataVarName);

  const outDir = path.resolve(process.cwd(), cfg.outputDir);
  fs.mkdirSync(outDir, { recursive: true });

  let count = 0;
  for (const item of items) {
    if (!item.slug) continue;

    const $ = cheerio.load(templateHtml, { decodeEntities: false });
    applyMeta($, item, cfg);

    const outPath = path.join(outDir, `${item.slug}.html`);
    fs.writeFileSync(outPath, $.html(), 'utf8');
    count++;
  }

  console.log(`✅ ${cfg.dataVarName}: generated ${count} file(s) in /${cfg.outputDir}`);
}

for (const cfg of PAGES) {
  try {
    buildPageSet(cfg);
  } catch (err) {
    console.error(`❌ Failed building "${cfg.templateFile}":`, err.message);
  }
}

console.log('\nDone. Deploy the generated folders alongside your existing site.');
console.log('Share links like: ' + SITE_BASE_URL + '/articles/your-slug.html');
