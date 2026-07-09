IDS
user login=user 
user function when clicked =toggleSignin

NB: just to show you where they are in the code don't copy code from here into the main
If Id not stated By Roni then check with eg.document.getElementById('googleLoginBtn')
// ----- Google sign-in / sign-up (demo) -----
  
this is where you will add your code:where I have showed the ---

 document.getElementById('googleLoginBtn').addEventListener('click', function() {
             ----   alert('🔐 Google sign-in (demo) — redirect to OAuth flow.');
            });
            document.getElementById('googleSignupBtn').addEventListener('click', function() {
             ---   alert('🔐 Google sign-up (demo) — redirect to OAuth flow.');
            });

Id for login =googleLoginBtn
Id for signUp=googleSignupBtn

 // ----- form submissions (demo) -----

this is where you will add your code:where I have showed the ---


 document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const pass = document.getElementById('loginPassword').value.trim();
                if (!email || !pass) {
                    alert('Please fill in both fields.');
                    return;
                }
               --- alert(`✅ Login attempt (demo)\nEmail: ${email}\nPassword: ${'•'.repeat(pass.length)}`);
                // In production: send to server / Supabase
            });

            document.getElementById('signupForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('signupUsername').value.trim();
                const email = document.getElementById('signupEmail').value.trim();
                const pass = document.getElementById('signupPassword').value.trim();
                if (!username || !email || !pass) {
                    alert('Please fill in all fields.');
                    return;
                }
              ----  alert(`✅ Sign-up attempt (demo)\nUsername: ${username}\nEmail: ${email}\nPassword: ${'•'.repeat(pass.length)}`);
            });
