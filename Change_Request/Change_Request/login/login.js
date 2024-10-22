// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfUzxIGI6W7L1hIPuhhcmOP2BLrW3rVV8",
    authDomain: "change-request-4cdd9.firebaseapp.com",
    projectId: "change-request-4cdd9",
    storageBucket: "change-request-4cdd9.appspot.com",
    messagingSenderId: "922890755209",
    appId: "1:922890755209:web:55ad6f4dbfcab2c0477a58"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (!email || !password || !role) {
        alert("Please fill in all fields.");
        return;
    }

    console.log("Attempting login with email:", email, "role:", role);

    // Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            console.log("Login successful:", user);

            // Check the role and redirect to the respective profile page
            if (role === 'employee') {
                window.location.href = "../profile/employee_profile.html";
            } else if (role === 'manager') {
                window.location.href = "../profile/manager_profile.html";
            } else if (role === 'developer') {
                window.location.href = "../profile/developer_profile.html";
            } else {
                alert("Role not recognized.");
            }

            alert("Login successful! Welcome, " + user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Login error:", errorCode, errorMessage);

            let displayMessage = "Login failed. Please try again.";
            if (errorCode === 'auth/user-not-found') {
                displayMessage = "No user found with this email.";
            } else if (errorCode === 'auth/wrong-password') {
                displayMessage = "Incorrect password.";
            } else if (errorCode === 'auth/invalid-email') {
                displayMessage = "Invalid email format.";
            } else if (errorCode === 'auth/too-many-requests') {
                displayMessage = "Too many failed login attempts. Try again later.";
            }

            alert("Error: " + displayMessage);
        });
});
