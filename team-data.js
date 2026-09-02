/* ============================================================
   TEAM DATA
   Add a new team member by adding a new object to this array.
   `name` MUST match, character-for-character (case-insensitive,
   whitespace-trimmed), the `author` field used on entries in
   ARTICLES (articles-data.js), TRENDING (trend-data.js) and
   STORIES (Stories-data.js) — that's how the profile page finds
   a person's published work.

   `category` controls which section of the team grid a person
   is grouped under on team.html. Use one of: "Editors",
   "Reporters", "Contributors" — or add a new category name and
   it will get its own section automatically.

   `image` is optional. Leave it "" to fall back to a lettered
   avatar (matches the reference screenshot).
   ============================================================ */

const TEAM = [
  // ---------------- Editors ----------------
  {
    name: "Info Desk",
    role: "Editorial Desk",
    category: "Editors",
    image: "",
    bio: "The Getinfo Online info desk — verifying, editing and publishing breaking national and international coverage handled by Aidoo Roni"
  },


  // ---------------- Reporters ----------------
  {
    name: "Curtis Nkansah bentum",
    role: "Team Writer",
    category: "Reporters",
    image: "",
    bio: ""
  },
  {
    name: "Jesse Mabery",
    role: "Team Writer",
    category: "Writer",
    image: "",
    bio: "Jesse is an experienced writer with highly rated works. contact: mabery510@gmail.com"
  },
  {
    name: "Nyamekye Yaw Opoku",
    role: "Team Writer",
    category: "Writer",
    image: "",
    bio: ""
  },
  {
    name: "Wilavis",
    role: "Team Artist",
    category: "Reporters",
    image: "",
    bio: "His works are Shown at the Arts Section. Kindly visit to view his artworks"
  },
 {
    name: "Jennifer Agyei",
    role: "Team Writer",
    category: "Storytellers and Poets",
    image: "",
    bio: " Miss Jennifer is an expert storyteller and poet with great works. contact:  agyeiakos22@gmail.com "
  },
  {
    name: "Mensah Bismark Donkor",
    role: "Team Writer",
    category: "Reporters",
    image: "",
    bio: "  "
  },
 

  // ---------------- Contributors ----------------
  {
    name: "Rev. Dr. Patrick Owusu",
    role: "Contributor",
    category: "Contributors",
    image: "",
    bio: ""
  },
   {
    name: "Nathaniel Mensah",
    role: "Team Developer",
    category: "Technical Team",
    image: "",
    bio: "Nathaniel Mensah is a Developer with brand TOPCUT"
  },
   {
    name: "Roni Aidoo",
    role: "Team Developer",
    category: "Technical Team",
    image: "",
    bio: "Roni Aidoo is a Developer with brand Rankofsoft"
  },
  
];

/* Look up a single team member by name (case/whitespace tolerant) */
function getTeamMemberByName(name){
  if(!name) return null;
  const norm = String(name).trim().toLowerCase();
  return TEAM.find(m => m.name.trim().toLowerCase() === norm) || null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TEAM;
}