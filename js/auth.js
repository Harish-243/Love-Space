// Allowed emails – replace with your and your girlfriend's email addresses
const allowedEmails = [
  "paramasivamsk2811@gmail.com",         // Your email
  "oneuseonly188@gmail.com"           // Her email
];

// Listen for form submission
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Firebase Auth sign in
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (allowedEmails.includes(user.email)) {
        // Show welcome message
        document.getElementById("welcome-message").classList.remove("hidden");

        // Hide login form
        document.getElementById("login-form").classList.add("hidden");

        // Play music after successful login
        const bgMusic = document.getElementById("bg-music");
        if (bgMusic) {
          bgMusic.play().catch((err) => console.log("Autoplay blocked:", err));
        }

        // Optional: Redirect to dashboard after a delay
        // setTimeout(() => window.location.href = "dashboard.html", 3000);

      } else {
        alert("Access denied! Only we can enter here 💖");
        firebase.auth().signOut(); // Sign out unauthorized user
      }
    })
    .catch((error) => {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    });
});
