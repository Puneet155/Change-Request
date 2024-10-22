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
const firestore = firebase.firestore();
const auth = firebase.auth(); // Get auth instance

document.addEventListener("DOMContentLoaded", function() {
    // Use an auth state observer to handle redirection
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in, fetch user data
            try {
                const userDoc = await firestore.collection("users").doc(user.uid).get();
                
                if (!userDoc.exists) {
                    console.error("No user data found!");
                    alert("User data not found. Please check your account.");
                    window.location.href = "../registration/registration.html"; // Redirect to registration
                    return;
                }

                // Populate profile info with retrieved data
                const userData = userDoc.data();
                document.getElementById("name").innerText = userData.name || "N/A";
                document.getElementById("role").innerText = userData.role || "N/A";
                document.getElementById("email").innerText = userData.email || "N/A";
                document.getElementById("phone").innerText = userData.phone || "N/A";
                document.getElementById("address").innerText = userData.address || "N/A";
                document.getElementById("department").innerText = userData.department || "N/A";
                document.getElementById("joiningDate").innerText = userData.joiningDate || "N/A";
                document.getElementById("grade").innerText = userData.grade || "N/A";

                // Set up the dashboard redirect based on the user's role
                const dashboardBtn = document.getElementById("dashboardBtn");
                dashboardBtn.addEventListener("click", function() {
                    let dashboardURL;
                    switch (userData.role) {
                        case "manager":
                            dashboardURL = "../man_dashboard/manager-dashboard.html";
                            break;
                        case "developer":
                            dashboardURL = "../dev_dashboard/developer_dashboard.html";
                            break;
                        case "employee":
                            dashboardURL = "../emp_dashboard/dashboard.html";
                            break;
                        default:
                            dashboardURL = "../homepage/index.html"; // Fallback URL
                            break;
                    }
                    // Redirect to the appropriate dashboard
                    window.location.href = dashboardURL;
                });

            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("An error occurred while fetching user data. Please try again.");
            }
        } else {
            // User is signed out, redirect to registration
            window.location.href = "../registration/registration.html"; // Redirect to registration
        }
    });
});
