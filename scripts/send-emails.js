import { createClient } from '@supabase/supabase-js';
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
    from: 'Getinfo Online',
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
