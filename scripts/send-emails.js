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
        <img src="https://getinfoonline.com/Assets/Screenshot_20260820-092428.jpg" alt="Kessben Group Founder Stephen Kwabena Boateng Reportedly Dead" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Kessben Group Founder Stephen Kwabena Boateng Reportedly Dead</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Ghana’s business community has been hit by the reported death of renowned businessman and entrepreneur Stephen Kwabena Boateng, popularly known as Kessben, on…</p>
        <a href="https://getinfoonline.com/news/kessben-group-founder-stephen-kwabena-boateng-reportedly-dead.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/sammy gyamfi.jpg" alt="GoldBod $1.7bn Controversy: Minority Demands Answers as Sammy Gyamfi Rejects Loss Claim" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">GoldBod $1.7bn Controversy: Minority Demands Answers as Sammy Gyamfi Rejects Loss Claim</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">A fresh political and economic controversy has erupted over the reported US$1.7 billion loss associated with Ghana’s Domestic Gold Purchase Programme (DGPP) in…</p>
        <a href="https://getinfoonline.com/news/goldbod-1-7bn-controversy-minority-demands-answers-as-sammy-gyamfi-rejects-loss-.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/aboboyaa.jfif" alt="Ofankor Road Carnage: Calls Grow for ‘Aboboyas’ to Be Banned from Highways" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Ofankor Road Carnage: Calls Grow for ‘Aboboyas’ to Be Banned from Highways</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Calls are mounting for stronger restrictions on the use of “aboboyas” (motorised tricycles) on major highways following the deadly road crash at Ofankor that h…</p>
        <a href="https://getinfoonline.com/news/ofankor-road-carnage-calls-grow-for-aboboyas-to-be-banned-from-highways.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/funerale.png" alt="Mortuaries and Funeral Facilities Agency to Deploy ‘Funeral Police’ Nationwide to Prevent Corpse Abuse" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Mortuaries and Funeral Facilities Agency to Deploy ‘Funeral Police’ Nationwide to Prevent Corpse Abuse</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">The Mortuaries and Funeral Facilities Agency (MOFFA) is set to deploy personnel across districts in Ghana as part 
of efforts to monitor funeral activities and…</p>
        <a href="https://getinfoonline.com/news/mortuaries-and-funeral-facilities-agency-to-deploy-funeral-police-nationwide-to-.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/Kofi Annan.jfif" alt="Ghana Remembers Kofi Annan Eight Years After His Death" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Ghana Remembers Kofi Annan Eight Years After His Death</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Ghana today remembers one of its most celebrated sons, former United Nations Secretary-General Kofi Annan, as the country marks eight years since his death.</p>
        <a href="https://getinfoonline.com/news/ghana-remembers-kofi-annan-eight-years-after-his-death.html"
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
        <img src="https://getinfoonline.com/Assets/wil.png" alt="Wilavis: A Rising Star in the World of Art" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Wilavis: A Rising Star in the World of Art</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Wilavis is carving out a distinct identity in the art scene, transforming ideas and emotions into works that speak beyond words.</p>
        <a href="https://getinfoonline.com/articles/wilavis-a-rising-star-in-the-world-of-art.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/WhatsApp Image 2026-08-18 at 18.27.29.jpeg" alt="CHASING AN UNQUALIFIED MISSION" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">CHASING AN UNQUALIFIED MISSION</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Our world is full of countless people who are pursuing unworthy and destructive assignments in the name of success. Some are so desperate to make money that th…</p>
        <a href="https://getinfoonline.com/articles/chasing-an-unqualified-mission.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/WhatsApp Image 2026-08-17 at 21.52.13.jpeg" alt="WHEN LIFE HURTS: LEARNING TO LIVE WITH PAIN, PRESSURE AND PURPOSE" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">WHEN LIFE HURTS: LEARNING TO LIVE WITH PAIN, PRESSURE AND PURPOSE</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Life presents us with many challenges. At different stages of our journey, we may find ourselves battling health related issues, dealing with career crises, na…</p>
        <a href="https://getinfoonline.com/articles/when-life-hurts-learning-to-live-with-pain-pressure-and-purpose.html"
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
