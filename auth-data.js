/* ============================================================
   AUTH DATA
   ------------------------------------------------------------
   Add or edit accounts allowed to open the Article Data Editor.
   Each entry is a plain { username, password } pair.

   NOTE: This only keeps casual/unwanted visitors out of the
   editor page. Because this file ships to the browser as
   plain text, anyone who opens dev tools or views the page
   source can read these values — it is NOT secure storage.
   Don't reuse an important password here, and don't rely on
   this alone to protect anything sensitive.
   ============================================================ */

const USERS = [
  { username: "admin", password: "rankaidoo" },
  // Add more accounts if needed, e.g.:
 { username: "editor1", password: "editor1" }
];
