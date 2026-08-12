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
        <img src="https://getinfoonline.com/Assets/oil.jfif" alt="Oil Prices Rise as U.S.-Iran Peace Deal Doubts and Ship Attacks Raise Supply Fears" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Oil Prices Rise as U.S.-Iran Peace Deal Doubts and Ship Attacks Raise Supply Fears</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Oil prices rose on Wednesday, August 12, 2026, as growing doubts over a possible peace agreement between the United States and Iran, coupled with attacks on tw…</p>
        <a href="https://getinfoonline.com/trends/oil-prices-rise-as-u-s-iran-peace-deal-doubts-and-ship-attacks-raise-supply-fear.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/aj.jpg" alt="Private Citizen Sues Attorney-General and Chief Justice Over Legal Vacation Practice" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Private Citizen Sues Attorney-General and Chief Justice Over Legal Vacation Practice</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">A private citizen, Elorm Kwami Gorni, has taken legal action against Attorney-General and Minister for Justice Dr. Dominic Ayine and Chief Justice Justice Paul…</p>
        <a href="https://getinfoonline.com/trends/private-citizen-sues-attorney-general-and-chief-justice-over-legal-vacation-prac.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/trump.jfif" alt="Trump Secretly Switched Planes After NATO Summit Over Security Threat" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Trump Secretly Switched Planes After NATO Summit Over Security Threat</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">US President Donald Trump has confirmed that he secretly switched planes while leaving Turkey following the NATO summit in July, saying the decision was made b…</p>
        <a href="https://getinfoonline.com/trends/trump-secretly-switched-planes-after-nato-summit-over-security-threat.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/bm.jfif" alt="NPA Deputy CEO Dr Dramani Bukari Reportedly Dead" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">NPA Deputy CEO Dr Dramani Bukari Reportedly Dead</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Dr Dramani Bukari Ecomog, a Deputy Chief Executive Officer (CEO) of the National Petroleum Authority (NPA), has reportedly died in London.</p>
        <a href="https://getinfoonline.com/trends/npa-deputy-ceo-dr-dramani-bukari-reportedly-dead.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/nt.jfif" alt="Ghana Secures Chinese Support to Renovate and Modernise National Theatre" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Ghana Secures Chinese Support to Renovate and Modernise National Theatre</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Ghana is set to embark on a major renovation and modernisation of the National Theatre in Accra with support from the Government of the People’s Republic of Ch…</p>
        <a href="https://getinfoonline.com/trends/ghana-secures-chinese-support-to-renovate-and-modernise-national-theatre.html"
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
        <a href="mailto:getinfo360online@gmail.com" style="text-decoration:none;">
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
        <img src="https://getinfoonline.com/Assets/fs.png" alt="THE ABUSE OF THE RIGHT TO FREEDOM OF SPEECH" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">THE ABUSE OF THE RIGHT TO FREEDOM OF SPEECH</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Freedom of Speech is a fundamental human right allowing individuals to articulate their opinions, beliefs, and thoughts without fear of government retaliation.</p>
        <a href="https://getinfoonline.com/articles/the-abuse-of-the-right-to-freedom-of-speech.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/twins.jfif" alt="Too Shocking: Twins with Different Date of Birth Explained" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Too Shocking: Twins with Different Date of Birth Explained</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">The idea of twins having different dates of birth may sound strange at first. After all, twins are babies who develop in the same pregnancy and are delivered d…</p>
        <a href="https://getinfoonline.com/articles/too-shocking-twins-with-different-date-of-birth-explained.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/images12.png" alt="TOXIC WORKPLACES" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">TOXIC WORKPLACES</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">A view backed with evidence on behavior of Organizations in Ghana.</p>
        <a href="https://getinfoonline.com/articles/toxic-workplaces.html"
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
