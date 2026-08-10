/* ============================================================
   QUOTE-ART-DATA.JS
   Data source for the "Daily Quote" rail and the "Art Speaks" rail
   on the Getinfo Online homepage (and anywhere else these rails
   are reused). Add/remove/reorder entries here — the page reads
   the first entries automatically, no HTML edits required.
   ============================================================ */

/* Each quote needs: text, image (author photo), name (author) */
const QUOTES = [
  
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

/* Each art entry needs: image. caption/alt are optional. */
const ARTS = [
   {
    author: "Wilavis",
    image: "Assets/Art4.jpg",
    alt: "Deputy AG on ORALCASES"
  },
  {
    author: "Wilavis",
    image: "Assets/art2.jpg",
    alt: "Daily cartoon"
  },
  {
    author: "Wilavis",
    image: "Assets/ABUI1.jpg",
    alt: "Daily cartoon"
  }
];
