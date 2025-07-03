// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOqf8kTgs6Htr5ZeHWtEZldHQcx80zru4",
  authDomain: "love-space-pr.firebaseapp.com",
  projectId: "love-space-pr",
  storageBucket: "love-space-pr.firebasestorage.app",
  messagingSenderId: "614813452076",
  appId: "1:614813452076:web:9b8666effa1b33feca0e89",
  measurementId: "G-N1MCSEHQ26"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle login
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    console.log("Login successful");
    // Redirection will happen below in onAuthStateChanged
  } catch (error) {
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
});

// After login, check connection status and redirect
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userEmail = user.email;

    try {
      const connectionsRef = db.collection("connections");

      // Check if user is person1
      const snap1 = await connectionsRef.where("person1Email", "==", userEmail).get();
      if (!snap1.empty) {
        const conn = snap1.docs[0].data();
        if (!conn.person2Verified || !conn.person2Name) {
          window.location.href = "person-2.html";
        } else {
          window.location.href = "dashboard.html";
        }
        return;
      }

      // Check if user is person2
      const snap2 = await connectionsRef.where("partnerEmail", "==", userEmail).get();
      if (!snap2.empty) {
        const conn = snap2.docs[0].data();
        if (!conn.person2Verified || !conn.person2Name) {
          alert("Please complete your invitation verification first.");
          auth.signOut();
        } else {
          window.location.href = "dashboard.html";
        }
        return;
      }

      // No connection found
      alert("You haven't created a connection yet.");
      window.location.href = "newconnection.html";

    } catch (err) {
      console.error("Error checking connection:", err);
      alert("Something went wrong. Please try again later.");
    }
  }
});
