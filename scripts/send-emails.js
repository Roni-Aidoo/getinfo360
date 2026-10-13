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
        <img src="https://getinfoonline.com/Assets/IMG_d3713374-55ed-4cad-b8aa-5241ac0fa748.jpg" alt="Mahama Directs GH¢300 Million Allocation for 250 New Police Apartments in 2027 Budget" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Mahama Directs GH¢300 Million Allocation for 250 New Police Apartments in 2027 Budget</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">President John Dramani Mahama has asked the Minister of Finance to make provision for GH¢300 million in the 2027 Budget to construct 250 new apartments for pol…</p>
        <a href="https://getinfoonline.com/news/mahama-directs-gh-300-million-allocation-for-250-new-police-apartments-in-2027-b.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/IMG_7f1487a9-2e49-462b-a39a-337cc3f139a5.jpg" alt="Mahama to Commission 85-Bed Christian Tetteh Yohonu Ward Complex at Police Hospital" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Mahama to Commission 85-Bed Christian Tetteh Yohonu Ward Complex at Police Hospital</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">President John Dramani Mahama is expected to commission the 85-bed Christian Tetteh Yohonu Ward Complex at the Ghana Police Hospital in Accra</p>
        <a href="https://getinfoonline.com/news/mahama-to-commission-85-bed-christian-tetteh-yohonu-ward-complex-at-police-hospi.html"
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
        <img src="https://getinfoonline.com/Assets/IMG-20261013-WA0033.jpg" alt="An Open Letter To The Ministry Of Education, Ghana Education Service And All Stakeholders: Let Us Use Technology To End Sexual Abuse In Our Schools" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">An Open Letter To The Ministry Of Education, Ghana Education Service And All Stakeholders: Let Us Use Technology To End Sexual Abuse In Our Schools</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">I write this letter not just as a teacher, but as a parent, as a guardian, and as a Ghanaian who was heartbroken after reading the press release from the Minis…</p>
        <a href="https://getinfoonline.com/articles/an-open-letter-to-the-ministry-of-education-ghana-education-service-and-all-stak.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/FB_IMG_1791550356291.jpg" alt="KAKISTOCRACY: THE FACE OF MODERN LEADERSHIP" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">KAKISTOCRACY: THE FACE OF MODERN LEADERSHIP</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">What happens when power falls into the hands of those least prepared to use it responsibly?That question lies at the heart of kakistocracy</p>
        <a href="https://getinfoonline.com/articles/kakistocracy-the-face-of-modern-leadership.html"
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
