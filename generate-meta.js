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
    outputDir: 'news',
    urlPathPrefix: '/news/',
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
// present, in sync, and self-contained (no extra module files to
// resolve at send time — the HTML is baked in as a plain string).
const NEWSLETTER = {
  enabled: true,
  outputDir: 'scripts',
  outputFile: 'send-emails.js',
  trendLimit: 3,
  articleLimit: 2,
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

/** Escape text so it's safe to place inside XML/HTML element content/attributes. */
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
// Newsletter HTML (baked directly into scripts/send-emails.js)
// ------------------------------------------------------------
// Builds a plain HTML string from the same TRENDING/ARTICLES data
// PAGES already knows how to load, then writes it straight into the
// `html:` field of send-emails.js as a literal string. Nothing in
// send-emails.js is imported at send-time — it's fully self-contained,
// so it doesn't depend on any other files existing in scripts/.
// ============================================================

function getPageConfig(dataVarName) {
  return PAGES.find((p) => p.dataVarName === dataVarName);
}

function itemUrl(cfg, item) {
  return `${SITE_BASE_URL}${cfg.urlPathPrefix}${item.slug}.html`;
}

/** Newest-first, limited, slug-having items for a given PAGES config. */
function recentItems(cfg, limit) {
  const items = loadDataArray(cfg.dataFile, cfg.dataVarName);
  return items
    .filter((item) => item.slug)
    .sort((a, b) => (parseItemDate(b.date)?.getTime() || 0) - (parseItemDate(a.date)?.getTime() || 0))
    .slice(0, limit);
}

function renderArticleCard(item, cfg) {
  const title = escapeXml(item.title || 'Untitled');
  const excerpt = escapeXml(truncate(item.excerpt || '', 160));
  const image = absoluteUrl(item.image);
  const url = itemUrl(cfg, item);

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="${escapeXml(image)}" alt="${title}" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">${title}</p>
        ${excerpt ? `<p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">${excerpt}</p>` : ''}
        <a href="${url}"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>`;
}

function renderAdSlot() {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="margin:28px 0;background:#fafafa;border:1px dashed #dddddd;border-radius:8px;">
    <tr>
      <td style="padding:20px;text-align:center;">
        <p style="margin:0 0 10px 0;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#aaaaaa;">Advertisement</p>
        <a href="mailto:advertise@getinfoonline.com" style="text-decoration:none;">
          <p style="margin:0;font-size:13px;color:#999999;">Your ad could be here.</p>
          <p style="margin:4px 0 0 0;font-size:12px;color:#bbbbbb;">Learn about advertising with us →</p>
        </a>
      </td>
    </tr>
  </table>`;
}

function sectionHeader(label) {
  return `
  <tr>
    <td style="padding:0 0 10px 0;">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#999999;border-bottom:2px solid #111111;display:inline-block;padding-bottom:4px;">${escapeXml(label)}</p>
    </td>
  </tr>`;
}

/**
 * @returns {{ html: string, trendCount: number, articleCount: number }}
 */
function buildNewsletterHtml() {
  const cfgTrend = getPageConfig('TRENDING');
  const cfgArticles = getPageConfig('ARTICLES');

  const trending = cfgTrend ? recentItems(cfgTrend, NEWSLETTER.trendLimit) : [];
  const articles = cfgArticles ? recentItems(cfgArticles, NEWSLETTER.articleLimit) : [];

  const trendSection = trending.length
    ? `
    ${sectionHeader('Trending Now')}
    <tr>
      <td>
        ${trending.map((item) => renderArticleCard(item, cfgTrend)).join('')}
      </td>
    </tr>` : '';

  const articlesSection = articles.length
    ? `
    ${sectionHeader('Latest Articles')}
    <tr>
      <td>
        ${articles.map((item) => renderArticleCard(item, cfgArticles)).join('')}
      </td>
    </tr>` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>This Week's Update</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="width:600px;max-width:100%;background:#ffffff;border-radius:10px;overflow:hidden;">

          <tr>
            <td style="padding:24px 28px;background:#111111;">
              <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;">Get Info Online</p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#aaaaaa;">This Week's Update</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:18px;">
                    <p style="margin:0;font-size:15px;color:#333333;">Hey there,</p>
                    <p style="margin:6px 0 0 0;font-size:14px;color:#666666;">Here's what's new — full stories are on the site.</p>
                  </td>
                </tr>

                ${trendSection}
                <tr><td>${renderAdSlot()}</td></tr>
                ${articlesSection}

              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px;background:#fafafa;border-top:1px solid #eeeeee;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#999999;">You're receiving this because you subscribed at ${escapeXml(SITE_BASE_URL.replace(/^https?:\/\//, ''))}.</p>
              <p style="margin:0;font-size:12px;"><a href="${SITE_BASE_URL}/unsubscribe" style="color:#999999;text-decoration:underline;">Unsubscribe</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, trendCount: trending.length, articleCount: articles.length };
}

// ============================================================
// Newsletter sender script (scripts/send-emails.js)
// ------------------------------------------------------------
// Written fresh on every generate-meta.js run. No imports besides
// supabase-js/resend, no runtime file reads at send time — the
// generated HTML is baked straight into an `emailHtml` template
// literal. Sends one individual email per subscriber (Promise.all)
// instead of one email with everyone in `to`, so no subscriber ever
// sees another subscriber's address.
// ============================================================

/** Escape characters that would break out of a `...` template literal. */
function escapeForTemplateLiteral(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function buildSendEmailsScriptSource(htmlContent) {
  const htmlLiteral = escapeForTemplateLiteral(htmlContent);

  return `import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

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

  const emailHtml = \`${htmlLiteral}\`;

  // 2. Send individual emails via Resend to protect privacy
  const emailPromises = subscribers.map((sub) =>
    resend.emails.send({
      from: 'GetInfo <GetInfo@getinfoonline.com>',
      to: sub.email,
      subject: "This Week's Update - Get Info Online",
      html: emailHtml,
    })
  );

  try {
    const results = await Promise.all(emailPromises);
    console.log('All emails dispatched successfully:', results);
  } catch (sendError) {
    console.error('Error sending emails:', sendError);
    process.exit(1);
  }
}

main();
`;
}

function writeSendEmailsScript() {
  if (!NEWSLETTER.enabled) return;

  const outDir = path.resolve(process.cwd(), NEWSLETTER.outputDir);
  fs.mkdirSync(outDir, { recursive: true });

  let htmlContent;
  let counts = { trendCount: 0, articleCount: 0 };
  try {
    const built = buildNewsletterHtml();
    htmlContent = built.html;
    counts = built;
  } catch (err) {
    console.error(
      '❌ Failed building newsletter HTML — writing send-emails.js with a placeholder instead:',
      err.message
    );
    htmlContent = '<p>Hello, You will be recieving newsletters soon from Getinfo Online. Watch Out</p>';
  }

  const outPath = path.join(outDir, NEWSLETTER.outputFile);
  fs.writeFileSync(outPath, buildSendEmailsScriptSource(htmlContent), 'utf8');
  console.log(
    `✅ ${NEWSLETTER.outputDir}/${NEWSLETTER.outputFile} generated ` +
    `(${counts.trendCount} trend(s), ${counts.articleCount} article(s)) → ${outPath}`
  );
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