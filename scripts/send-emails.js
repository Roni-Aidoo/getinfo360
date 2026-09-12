import { createClient } from '@supabase/supabase-js';
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

  const emailHtml = `<!DOCTYPE html>
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

                
    
  <tr>
    <td style="padding:0 0 10px 0;">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#999999;border-bottom:2px solid #111111;display:inline-block;padding-bottom:4px;">Trending Now</p>
    </td>
  </tr>
    <tr>
      <td>
        
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/10608674.295.jpg" alt="Policeman Identified and Interdicted Over Death of Central University Student Ivan Baidoo" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Policeman Identified and Interdicted Over Death of Central University Student Ivan Baidoo</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">A police officer allegedly involved in the circumstances surrounding the death of Central University law student, Ivan Apprey Baidoo, has reportedly been ident…</p>
        <a href="https://getinfoonline.com/news/policeman-identified-and-interdicted-over-death-of-central-university-student-iv.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/FB_IMG_1788389911833.jpg" alt="Gospel Music Legend Bernice Offei Reportedly Dies at 63" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Gospel Music Legend Bernice Offei Reportedly Dies at 63</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Ghana’s gospel music community has been plunged into mourning following reports of the death of veteran gospel musician Bernice Offei at the age of 63.</p>
        <a href="https://getinfoonline.com/news/gospel-music-legend-bernice-offei-reportedly-dies-at-63.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
      </td>
    </tr>
                <tr><td>
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
  </table></td></tr>
                
    
  <tr>
    <td style="padding:0 0 10px 0;">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#999999;border-bottom:2px solid #111111;display:inline-block;padding-bottom:4px;">Latest Articles</p>
    </td>
  </tr>
    <tr>
      <td>
        
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/71538003.jpg" alt="Bernice Offei: The Gospel Music Veteran Who Combined Faith, Education and Professional Excellence" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Bernice Offei: The Gospel Music Veteran Who Combined Faith, Education and Professional Excellence</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Her journey is one of faith, academic achievement, professional discipline and a passion for spreading the Christian message through song.</p>
        <a href="https://getinfoonline.com/articles/bernice-offei-the-gospel-music-veteran-who-combined-faith-education-and-professi.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/WhatsApp-Image-2025-05-09-at-6.23.15-PM-480x600.jpeg" alt="Dr Kwaku Mensa-Bonsu: The Visionary Behind Ghana’s National Science &amp; Maths Quiz" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Dr Kwaku Mensa-Bonsu: The Visionary Behind Ghana’s National Science &amp; Maths Quiz</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">His story is one of curiosity, communication, entrepreneurship and a sustained commitment to education.</p>
        <a href="https://getinfoonline.com/articles/dr-kwaku-mensa-bonsu-the-visionary-behind-ghana-s-national-science-maths-quiz.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
      </td>
    </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px;background:#fafafa;border-top:1px solid #eeeeee;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#999999;">You're receiving this because you subscribed at getinfoonline.com.</p>
              <p style="margin:0;font-size:12px;"><a href="https://getinfoonline.com/unsubscribe" style="color:#999999;text-decoration:underline;">Unsubscribe</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
