/* ============================================================
   ARTICLES DATA
   Add a new article by adding a new object to this array.
   `slug` must be unique — it's what article.html?slug=... looks up.
   `body` is an array of strings; each string becomes one <p>.
   Use body items starting with "## " to render as an <h2> heading,
   and items starting with "> " to render as a blockquote.
   ============================================================ */

const STORIES = [
    {
    slug: "midnight-gold",
    title: "MIDNIGHT GOLD",
    category: "Poem",
    author: "Amani Emmanuel Kwarteng",
    date: "August 6, 2026",
    readTime: "1 min read",
    image: "/Assets/WhatsApp Image 2026-08-05 at 18.26.33.jpeg",
    imageCaption: "Web",
    excerpt: "Are you afraid of the mirror or the shade\nWishing the skin of your father would fade\nWho told you the sun was better than the moon?\nWho told you the night needed mercy for noon?",
    tags: ["Poem", "Midnight Gold"],
    body: [
      "Are you afraid of the mirror or the shade\nWishing the skin of your father would fade\nWho told you the sun was better than the moon?\nWho told you the night needed mercy for noon?",
      "They put the poison in a pretty little jar\nPromising to make you a yellow born star",
      "They say scrub away the cocoa, scrub away the earth,",
      "They want you to forget what your melanin is worth.",
      ".But listen to me closer, let me tell you what I see.",
      "I see the beginning of all history",
      "You want to trade the ebony for the sand?\nYou want to erase the footsteps of the land? Stop!!!!!!!",
      "Look at the sky when the stars come out to play.\nThey can only shine when the sun goes away.",
      "The darker the canvas, the brighter the paint.\n\nDon't turn a goddess into a saint",
      "They sell you the cream to burn off the night.\nBut a diamond is dark before it sees the light.",
      "Don't wash night away.",
      "You are midnight gold",
      "You are the story that the ancients told",
      "Oh my ebony queen",
      "You are the deepest thing I have ever seen."
    ]
  },
    {
    slug: "behind-the-smile",
    title: "Behind the Smile",
    category: "Poem",
    author: "Jennifer Agyei",
    date: "August 3, 2026",
    readTime: "1 min read",
    image: "/Assets/behinds.jfif",
    imageCaption: "Web",
    excerpt: "Behind the Smile were agonies of pains and hurts from the past.",
    tags: ["Literature", "Poem", "Jenni's Corner"],
    body: [
      "1. Behind the Smile \n   were agonies of pains \n    and hurts from the past.",
      "2. The pains He so\n    desired to get away from,\n    lingered near like a baby \n    who is so attached to the mother.",
      "3. Behind that hidden smile\n    were His woes which He could not share.\n    Always was He wearing a smile.\n    His smile which brings comfort to others\n    but no one knew His pains.",
      "4. He had to live with them \n    as each day passes.\n    But not until He found his real love.\n    Who brought his smiles alive.\n    This time with so much love and warmth.",
      "5. Behind the smile now \n    was peace, love and comfort.\n    He could smile freely now,\n    without any pains, hurts or woes.\n    Cos He has found His first love.",
      "6. He did not need to think \n    about the aftermath of\n    His smiles anymore.\n    Cos behind that smile was LOVE"
    ]
  },
  {
    slug: "All-is-well-the-Mystery-Girl",
    title: "All is Well: The Mystery Girl",
    category: "Story",
    author: "Jennifer Agyei",
    date: "July 20, 2026",
    readTime: "4 min read",
    image: "/Assets/JB1.png",
    excerpt: "A Story about the girl who changed the story of his people",
    tags: ["Story", "Hope", "Jenni's Corner"],
    body: [
      "Once there was a small town that the neighbouring towns thought the people residing there would not amount to nothing. The inhabitants were rejected and no one saw the need to improve upon their living conditions. People were ailing and dying and no one was able to take seed.",
      "They thought all hope was lost. Then at dawn, they heard the cry of a newborn baby. Everybody rushed to the house where the baby was born with much joy and anticipation. “It has been years since we heard a cry of a newborn baby”. An elderly woman said.To them, this newborn baby was a mystery.The newborn baby was a beautiful girl. She had in her hand a piece of paper which she had gripped tightly. The inhabitants saw the inscription boldly written on it and everyone wondered what it was or meant. The father of the newborn baby brought it out and read it aloud to the hearing of all and sundry saying “All is well”.Everyone shed tears of joy.“Finally we have something to hold on to”. Said the baby’s grandmother.",
      " One by one they went into their homes rejoicing. The baby girl grew up so fast. She was a source of motivation and encouragement to the inhabitants.  She soon grew up to be a young girl with a lot of aspirations and expectations for her town. She yearned to be educated and thus informed her parents but they were adamant since no one in the town had ever been to school. She told them in order to take a bold step in life, you need to make sacrifices. She bade them bye and set off to a faraway town where she would work and enroll in an educational institution.",
      "Years passed by and the family as well as the inhabitants had not heard from her. Everyone thought either she is dead or had forgotten about them. Her parents went to enquire about their beloved daughter but to no avail. The father went to his daughter's room and brought out the piece of paper that she held in her hands when she was born. “All is well”. He read to himself. “Is this the end? If it is then I do not accept”. He said.As he made his way into the room, he heard someone call him father. He turned to see and surprisingly his daughter was standing beside her car and smiling.",
      "He called his wife to come and see their daughter. She danced all the way to where her child was. They hugged each other  in tears. Soon news reached the inhabitants that the mystery girl has returned. They rushed to the young girl father’s compound to see things for themselves. They were mesmerized when they saw her since they could not believe the transformation. She narrated to them all that had happened. She told them she met a grown and rich woman who took her in and saw her through school.",
      "She made it known to them that she had not forgotten about them but was planning on what to do for the town. She brought out a plan indicating her intentions. The plan showed schools, social amenities, recreational centres, parks, farmlands among others. She also handed over envelopes with sum of money to them and instructed them to use it wisely. She told them in months and years to come, their town will be amongst the wealthiest towns and people from all walks of life will come and enquire about their success. They made merry throughout the night. The birth of the baby girl opened avenues for everyone to take seed. Soon, there were a lot of newborn babies.",
      "There was decline in death rate, growth escalated and the town was filled with much joy and happiness. Indeed, this was a new beginning for them."
    ]
  },

];

/* Look up a single article by slug */
function getArticleBySlug(slug){
  return STORIES.find(a => a.slug === slug) || null;
}

/* Get other articles, excluding a given slug, up to `limit` */
function getOtherArticles(excludeSlug, limit = 4){
  return STORIES.filter(a => a.slug !== excludeSlug).slice(0, limit);
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = STORIES;
}


