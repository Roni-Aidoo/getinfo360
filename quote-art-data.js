/* ============================================================
   QUOTE-ART-DATA.JS
   Data source for the "Daily Quote" rail and the "Art Speaks" rail
   on the Getinfo Online homepage (and anywhere else these rails
   are reused). Add/remove/reorder entries here — the page reads
   them automatically, no HTML edits required.
   ============================================================ */

/* Each quote needs: text, image (author photo), name (author) */
const QUOTES = [
   {
    text: "What they did to you, what they said about you, Doesn't Change who God called you to be! STAY FOCUSED!",
    image: "Assets/LOG.jpg",
    name: "Stacy Mawusi"
  },
  {
    text: "Sometimes the will of God hurts, so that when you succeed, you will realize that your success is never your making.",
    image: "Assets/LOG.jpg",
    name: "Rev. Isaac Ofosu Manu (OMI)"
  },
  {
    text: "Remember, instructions go to those who utilse them well, not those who trivialise them",
    image: "Assets/LOG.jpg",
    name: "Pastor Prince Octhere Danso"
  },
  {
    text: "To play a Hero, you have to play right so that you don't lose",
    image: "Assets/LOG.jpg",
    name: "Miss Jennifer Agyei"
  },
  {
    text: "We must move beyond reacting to disasters and begin implementing lasting solutions.",
    image: "Assets/pp.jpg",
    name: "Rev. Dr. Patrick Owusu"
  }
];

/* Each art entry needs:
   - slug:     unique, URL-safe id — used to build a shareable permalink
               (arts.html?art=slug) and to deep-link straight into the
               lightbox for that piece. Keep it short, lowercase, hyphenated.
   - title:    shown as the gallery caption and lightbox title
   - category: used by the filter buttons (defaults to "National" if omitted)
   - author:   the artist's name — shown in the lightbox
   - image:    path to the artwork
   - alt:      accessibility text (falls back to title if omitted)
*/
const ARTS = [
  
  {
    slug: "deputy-ag-oral-investigation",
    title: "Deputy AG on ORAL Investigation",
    category: "National",
    author: "Wilavis",
    image: "Assets/Art4.jpg",
    alt: "Deputy AG on ORAL Investigation"
  },
  {
    slug: "president-pleads-ken-ofori-atta",
    title: "President pleads for Ken Ofori-Atta to come back",
    category: "National",
    author: "Wilavis",
    image: "Assets/art2.jpg",
    alt: "President pleads for Ken Ofori-Atta to come back"
  },
  {
    slug: "abutrica-arrest-comic",
    title: "Abutrica arrest comic",
    category: "National",
    author: "Wilavis",
    image: "Assets/ABUI1.jpg",
    alt: "Abutrica arrest comic"
  }
];

/* ---------- helpers ---------- */
function getAllArts(){
  return ARTS;
}
function getArtBySlug(slug){
  return ARTS.find(a => a.slug === slug) || null;
}