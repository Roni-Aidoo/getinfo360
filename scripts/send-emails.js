import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize clients using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  // 1. Fetch subscribers from Supabase
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('email, name, username');

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
    from: 'getinfo360online@gmail.com',
    to: emails,
    subject: 'New News!',
    html: '<p>Hello! We just deployed a new update to our site.</p>',
  });

  if (sendError) {
    console.error('Error sending emails:', sendError);
    process.exit(1);
  }

  console.log('Emails sent successfully:', data);
}

main();
