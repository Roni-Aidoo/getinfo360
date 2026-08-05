const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio'); // npm install cheerio

// ============================================================
// CONFIG — edit these to match your project
// ============================================================
const SITE_BASE_URL = 'https://getinfoonline.com'; // no trailing slash

// Google News settings. Only used for page types with
// `includeInNewsSitemap: true` below.
const NEWS_SITEMAP = {
  enabled: true,
  outputFile: 'news-sitemap.xml',
  publicationName: 'Getinfo Online',
  // BCP-47 language code, e.g. 'en', 'en-US', 'fr'
  language: 'en',
  // Google News only wants articles published in roughly the last
  // 48 hours. Items older than this are silently left out of
  // news-sitemap.xml (they still appear fine in the normal sitemap.xml).
  maxAgeHours: 48,
};

const PAGES = [
  {
    // Trending Issues
    templateFile: 'trend.html',
    dataFile: 'trend-data.js',
    dataVarName: 'TRENDING',
    outputDir: 'trends',
    urlPathPrefix: '/trends/',
    ogType: 'article',
    sitemapChangefreq: 'weekly',
    sitemapPriority: '0.7',
    includeInNewsSitemap: true,
  },
  {
    // 360 Echoes articles
    templateFile: 'article.html',
    dataFile: 'articles-data.js',
    dataVarName: 'ARTICLES',
    outputDir: 'articles',
    urlPathPrefix: '/articles/',
    ogType: 'article',
    sitemapChangefreq: 'weekly',
    sitemapPriority: '0.7',
    includeInNewsSitemap: true,
  },
  {
    // Stories & Books
    templateFile: 'Story.html',
    dataFile: 'Stories-data.js',
    dataVarName: 'STORIES',
    outputDir: 'stories',
    urlPathPrefix: '/stories/',
    ogType: 'book',
    sitemapChangefreq: 'monthly',
    sitemapPriority: '0.6',
    // Books/stories aren't "news" content — leave out of news-sitemap.xml
    includeInNewsSitemap: false,
  },
];

// Fixed, non-generated pages that should also appear in the sitemap.
// Edit this list any time you add/remove a static page on the site.
const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/Treanding.html', changefreq: 'hourly', priority: '0.9' },
  { path: '/360.html', changefreq: 'daily', priority: '0.8' },
  { path: '/Stories.html', changefreq: 'daily', priority: '0.7' },
  { path: '/arts.html', changefreq: 'weekly', priority: '0.6' },
  { path: '/ano.html', changefreq: 'weekly', priority: '0.6' },
  { path: '/Signin.html', changefreq: 'monthly', priority: '0.3' },
];

// Where the newsletter sender script lives, and what it's called.
// generate-meta.js (re)writes this file on every run so it's always
// present and never has to be created/edited by hand.
const NEWSLETTER = {
  enabled: true,
  outputDir: 'scripts',
  outputFile: 'send-emails.js',
};

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

/** "July 29, 2026" -> "2026-07-29". Returns null if the date can't be parsed. */
function toISODate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/**
 * Parses item.date into a real Date object, or null if it can't be parsed.
 * Used for both the news-sitemap 48-hour filter and the full
 * publication_date timestamp Google News wants.
 */
function parseItemDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/** Full W3C datetime (e.g. 2026-07-29T00:00:00.000Z) for <news:publication_date>. */
function toISODateTime(dateStr) {
  const d = parseItemDate(dateStr);
  return d ? d.toISOString() : null;
}

/** Escape text so it's safe to place inside XML element content/attributes. */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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

/**
 * Figures out how many folders deep the generated files sit, based on
 * urlPathPrefix (e.g. '/articles/' → 1 level deep), so we know how many
 * "../" to prepend to relative links.
 */
function depthFromPrefix(urlPathPrefix) {
  return urlPathPrefix.split('/').filter(Boolean).length;
}

function isRewritableUrl(url) {
  if (!url) return false;
  return !(
    /^([a-z][a-z0-9+.-]*:)?\/\//i.test(url) || // http://, https://, // protocol-relative
    url.startsWith('/') ||                     // already root-relative
    url.startsWith('#') ||                     // in-page anchor
    url.startsWith('mailto:') ||
    url.startsWith('javascript:') ||
    url.startsWith('data:')
  );
}

/**
 * Rewrites every relative src/href/CSS-url() reference in the loaded
 * template so it still resolves correctly once the file has been moved
 * one or more folders deeper (e.g. into /articles/). External URLs,
 * root-relative paths ("/..."), and anchors are left untouched.
 */
function rewriteRelativePaths($, prefix) {
  if (!prefix) return; // nothing to do if the output sits at site root

  $('[src]').each((_, el) => {
    const $el = $(el);
    const val = $el.attr('src');
    if (isRewritableUrl(val)) $el.attr('src', prefix + val);
  });

  $('link[href]').each((_, el) => {
    const $el = $(el);
    const val = $el.attr('href');
    if (isRewritableUrl(val)) $el.attr('href', prefix + val);
  });

  $('a[href]').each((_, el) => {
    const $el = $(el);
    const val = $el.attr('href');
    if (isRewritableUrl(val)) $el.attr('href', prefix + val);
  });

  // Inline style="background-image:url(...)" attributes
  $('[style]').each((_, el) => {
    const $el = $(el);
    const style = $el.attr('style');
    if (style && style.includes('url(')) {
      const newStyle = style.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, quote, url) => {
        return isRewritableUrl(url) ? `url(${quote}${prefix}${url}${quote})` : m;
      });
      $el.attr('style', newStyle);
    }
  });

  // <style>...</style> blocks in <head> (e.g. .hero-bg { background-image:url(...) })
  $('style').each((_, el) => {
    const $el = $(el);
    const css = $el.html();
    if (css && css.includes('url(')) {
      const newCss = css.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, quote, url) => {
        return isRewritableUrl(url) ? `url(${quote}${prefix}${url}${quote})` : m;
      });
      $el.html(newCss);
    }
  });
}

// ============================================================
// Sitemaps
// ============================================================

// Filled in as buildPageSet() successfully writes each file, so the
// sitemaps only ever list pages that genuinely exist on disk.
const sitemapEntries = [];
const newsSitemapEntries = [];

function buildSitemap() {
  const entries = [
    ...STATIC_PAGES.map(p => ({
      loc: `${SITE_BASE_URL}${p.path}`,
      lastmod: null,
      changefreq: p.changefreq,
      priority: p.priority,
    })),
    ...sitemapEntries,
  ];

  const body = entries
    .map(u => {
      let xml = `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n`;
      if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      if (u.changefreq) xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      if (u.priority) xml += `    <priority>${u.priority}</priority>\n`;
      xml += `  </url>`;
      return xml;
    })
    .join('\n');

  const xmlDoc =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  const outPath = path.resolve(process.cwd(), 'sitemap.xml');
  fs.writeFileSync(outPath, xmlDoc, 'utf8');
  console.log(`✅ sitemap.xml: ${entries.length} URL(s) → ${outPath}`);
}

/**
 * Builds news-sitemap.xml per the Google News sitemap protocol:
 * https://www.google.com/schemas/sitemap-news/0.9
 * Only includes items from page types flagged `includeInNewsSitemap: true`
 * AND published within NEWS_SITEMAP.maxAgeHours (Google ignores/penalizes
 * older entries in a news sitemap, so we filter proactively).
 */
function buildNewsSitemap() {
  if (!NEWS_SITEMAP.enabled) return;

  const cutoff = Date.now() - NEWS_SITEMAP.maxAgeHours * 60 * 60 * 1000;
  const fresh = newsSitemapEntries.filter(e => e.publishedAtMs >= cutoff);

  const body = fresh
    .map(u => {
      return (
        `  <url>\n` +
        `    <loc>${escapeXml(u.loc)}</loc>\n` +
        `    <news:news>\n` +
        `      <news:publication>\n` +
        `        <news:name>${escapeXml(NEWS_SITEMAP.publicationName)}</news:name>\n` +
        `        <news:language>${escapeXml(NEWS_SITEMAP.language)}</news:language>\n` +
        `      </news:publication>\n` +
        `      <news:publication_date>${u.publicationDate}</news:publication_date>\n` +
        `      <news:title>${escapeXml(u.title)}</news:title>\n` +
        `    </news:news>\n` +
        `  </url>`
      );
    })
    .join('\n');

  const xmlDoc =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n` +
    `${body}\n</urlset>\n`;

  const outPath = path.resolve(process.cwd(), NEWS_SITEMAP.outputFile);
  fs.writeFileSync(outPath, xmlDoc, 'utf8');

  const skipped = newsSitemapEntries.length - fresh.length;
  console.log(
    `✅ ${NEWS_SITEMAP.outputFile}: ${fresh.length} URL(s) → ${outPath}` +
      (skipped > 0
        ? ` (${skipped} older item(s) excluded — outside the ${NEWS_SITEMAP.maxAgeHours}h window)`
        : '')
  );
}

// ============================================================
// Newsletter sender script (scripts/send-emails.js)
// ------------------------------------------------------------
// Written fresh on every generate-meta.js run so it's always
// present and in sync. It depends on two small helper modules —
// scripts/lib/load-content-data.js and scripts/newsletter-template.js
// — which must already exist in the scripts/ folder (they hold the
// reusable data-loading + HTML-building logic and don't need to be
// regenerated on every run).
// ============================================================
function buildSendEmailsScriptSource() {
  return `import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { loadDataArray } from './lib/load-content-data.js';
import { generateNewsletterHTML } from './newsletter-template.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

// Pulls the newest N items out of a data file (e.g. trend-data.js's
// TRENDING array), newest first — same file generate-meta.js reads.
function getRecent(dataFile, varName, limit) {
  const items = loadDataArray(dataFile, varName);
  return items
    .filter((item) => item.slug)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, limit);
}

async function main() {
  // 1. Fetch subscribers from Supabase using your exact column names
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('email, username');

  if (error) {
    console.error('Error fetching subscribers:', error);
    process.exit(1);
  }

  if (!subscribers || subscribers.length === 0) {
    console.log('No subscribers found.');
    return;
  }

  const emails = subscribers.map((sub) => sub.email);

  // 2. Send email via Resend
  const { data, error: sendError } = await resend.emails.send({
    from: 'Getinfo Online <updates@getinfoonline.com>',
    to: emails,
    subject: 'New Update!',
    html: generateNewsletterHTML({
      trends: getRecent('trend-data.js', 'TRENDING', 5),
      articles: getRecent('articles-data.js', 'ARTICLES', 3),
    }),
  });

  if (sendError) {
    console.error('Error sending emails:', sendError);
    process.exit(1);
  }

  console.log('Emails sent successfully:', data);
}

main();
`;
}

function writeSendEmailsScript() {
  if (!NEWSLETTER.enabled) return;

  const outDir = path.resolve(process.cwd(), NEWSLETTER.outputDir);
  fs.mkdirSync(outDir, { recursive: true });

  const libPath = path.join(outDir, 'lib', 'load-content-data.js');
  const templatePath = path.join(outDir, 'newsletter-template.js');
  if (!fs.existsSync(libPath) || !fs.existsSync(templatePath)) {
    console.warn(
      `⚠️  scripts/send-emails.js depends on scripts/lib/load-content-data.js and ` +
      `scripts/newsletter-template.js — one or both are missing. The file will still ` +
      `be written, but won't run until those are in place.`
    );
  }

  const outPath = path.join(outDir, NEWSLETTER.outputFile);
  fs.writeFileSync(outPath, buildSendEmailsScriptSource(), 'utf8');
  console.log(`✅ ${NEWSLETTER.outputDir}/${NEWSLETTER.outputFile} generated → ${outPath}`);
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

  const depth = depthFromPrefix(cfg.urlPathPrefix);
  const relPrefix = '../'.repeat(depth);

  let count = 0;
  for (const item of items) {
    if (!item.slug) continue;

    const $ = cheerio.load(templateHtml, { decodeEntities: false });
    rewriteRelativePaths($, relPrefix);
    applyMeta($, item, cfg);

    const outPath = path.join(outDir, `${item.slug}.html`);
    fs.writeFileSync(outPath, $.html(), 'utf8');
    count++;

    const loc = `${SITE_BASE_URL}${cfg.urlPathPrefix}${item.slug}.html`;

    sitemapEntries.push({
      loc,
      lastmod: toISODate(item.date),
      changefreq: cfg.sitemapChangefreq || 'weekly',
      priority: cfg.sitemapPriority || '0.6',
    });

    if (cfg.includeInNewsSitemap && NEWS_SITEMAP.enabled) {
      const publishedAt = parseItemDate(item.date);
      if (!publishedAt) {
        console.warn(
          `⚠️  "${item.slug}" has no parseable date — skipped from news-sitemap.xml (needs item.date).`
        );
      } else {
        newsSitemapEntries.push({
          loc,
          title: item.title || 'Getinfo Online',
          publicationDate: toISODateTime(item.date),
          publishedAtMs: publishedAt.getTime(),
        });
      }
    }
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

try {
  buildSitemap();
} catch (err) {
  console.error('❌ Failed building sitemap.xml:', err.message);
}

try {
  buildNewsSitemap();
} catch (err) {
  console.error(`❌ Failed building ${NEWS_SITEMAP.outputFile}:`, err.message);
}

try {
  writeSendEmailsScript();
} catch (err) {
  console.error(`❌ Failed generating ${NEWSLETTER.outputDir}/${NEWSLETTER.outputFile}:`, err.message);
}

console.log('\nDone. Deploy the generated folders, plus sitemap.xml' +
  (NEWS_SITEMAP.enabled ? ` and ${NEWS_SITEMAP.outputFile}` : '') +
  ', alongside your existing site.');
console.log('Share links like: ' + SITE_BASE_URL + '/articles/your-slug.html');
console.log('Submit the sitemap at: ' + SITE_BASE_URL + '/sitemap.xml');
if (NEWS_SITEMAP.enabled) {
  console.log('Submit the news sitemap at: ' + SITE_BASE_URL + '/' + NEWS_SITEMAP.outputFile);
}
if (NEWSLETTER.enabled) {
  console.log('Send the newsletter with: node ' + NEWSLETTER.outputDir + '/' + NEWSLETTER.outputFile);
}