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
        <img src="https://getinfoonline.com/Assets/heroes.jfif" alt="Ghana marks one year since the August 6 military helicopter tragedy" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Ghana marks one year since the August 6 military helicopter tragedy</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Ghana commemorates the first anniversary of the August 6 military helicopter crash with a national memorial service, honouring eight fallen heroes.</p>
        <a href="https://getinfoonline.com/trends/ghana-marks-one-year-since-the-august-6-military-helicopter-tragedy.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/demonpop.jfif" alt="Protect Democracy Demonstration: Thousands March in Accra as NPP Protests Alleged Threats to Ghana&apos;s Democracy" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Protect Democracy Demonstration: Thousands March in Accra as NPP Protests Alleged Threats to Ghana&apos;s Democracy</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Thousands of NPP supporters marched in Accra during the Protect Democracy Demonstration, calling for an end to alleged selective justice and threats to Ghana&apos;s…</p>
        <a href="https://getinfoonline.com/trends/protect-democracy-demonstration-thousands-march-in-accra-as-npp-protests-alleged.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/WhatsApp Image 2026-08-05 at 13.53.201.jpg" alt="Headmaster Hospitalised After Alleged Mob Attack by Students at Obuasi Senior High Technical School" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Headmaster Hospitalised After Alleged Mob Attack by Students at Obuasi Senior High Technical School</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">The Headmaster of Obuasi Senior High Technical School (Obuasi SecTech), Abdulai Zakaria, is receiving treatment at the Komfo Anokye Teaching Hospital after he…</p>
        <a href="https://getinfoonline.com/trends/headmaster-hospitalised-after-alleged-mob-attack-by-students-at-obuasi-senior-hi.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/Screenshot_20260804-165309.jpg" alt="NACOC Arrests 10 KTU Students Over Alleged Trafficking of Cannabis-Infused Drinks and Ice Cream" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">NACOC Arrests 10 KTU Students Over Alleged Trafficking of Cannabis-Infused Drinks and Ice Cream</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">KOFORIDUA, Ghana — The Narcotics Control Commission (NACOC) has arrested ten students of Koforidua Technical University (KTU) for allegedly producing and distr…</p>
        <a href="https://getinfoonline.com/trends/nacoc-arrests-10-ktu-students-over-alleged-trafficking-of-cannabis-infused-drink.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/Screenshot_20260803-174115.jpg" alt="Bank of Ghana Publishes List of 20 Unlicensed Digital Loan Apps, Warns Public Against Their Use" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Bank of Ghana Publishes List of 20 Unlicensed Digital Loan Apps, Warns Public Against Their Use</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Accra, Ghana – August 3, 2026 — The Bank of Ghana (BoG) has issued a fresh warning to the public against dealing with 20 digital loan applications operating il…</p>
        <a href="https://getinfoonline.com/trends/bank-of-ghana-publishes-list-of-20-unlicensed-digital-loan-apps-warns-public-aga.html"
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
        <a href="https://getinfoonline.com/advertise" style="text-decoration:none;">
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
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/ArtIm.jpeg" alt="Art Deserves Better: A Call to Restore Ghana&apos;s Creative Heritage" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">Art Deserves Better: A Call to Restore Ghana&apos;s Creative Heritage</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Art, there’s the saying that art is life. Art captures the hidden beauty of life. Art is like breath, drawn in after a still morning breeze from the rich drenc…</p>
        <a href="https://getinfoonline.com/articles/art-deserves-better-a-call-to-restore-ghanas-creative-heritage.html"
           style="display:inline-block;font-size:13px;font-weight:600;color:#ffffff;background:#111111;padding:9px 16px;border-radius:5px;text-decoration:none;">
          Continue Reading &#8594;
        </a>
      </td>
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <tr>
      <td>
        <img src="https://getinfoonline.com/Assets/SHS-placement.jpg" alt="THE PROVISION OF SCHOOLS LEAD IN UNEMPLOYMENT" width="100%" style="display:block;width:100%;max-height:220px;object-fit:cover;" />
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0 0 8px 0;font-size:17px;font-weight:700;color:#111111;line-height:1.35;">THE PROVISION OF SCHOOLS LEAD IN UNEMPLOYMENT</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#444444;line-height:1.55;">Education is one of the major things Ghana strives for its citizens to have. A Quality Education, we call it, for every citizen.</p>
        <a href="https://getinfoonline.com/articles/the-provision-of-schools-lead-in-unemployment.html"
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
