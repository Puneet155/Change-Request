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

document.addEventListener("DOMContentLoaded", function() {
    const roleSelect = document.getElementById("role");
    const userDetails = document.getElementById("userDetails");
    
    // Hide user details by default
    userDetails.style.display = 'none'; 

    roleSelect.addEventListener("change", function() {
        console.log("Role selected:", roleSelect.value); // Log selected role
        if (roleSelect.value) {
            userDetails.style.display = 'block'; // Show user details form
            resetUserDetails(); // Reset the user details fields
        } else {
            userDetails.style.display = 'none'; // Hide user details form
        }
    });

    // Function to reset user details fields
    function resetUserDetails() {
        const inputs = userDetails.querySelectorAll("input");
        inputs.forEach(input => {
            input.value = ''; // Clear input values
        });
    }

    // Handle form submission
    document.getElementById("registrationForm").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent form submission
        console.log("Form submitted"); // Log form submission event

        // Get user data
        const email = document.getElementById("email").value.toLowerCase(); // Convert email to lowercase
        const password = document.getElementById("password").value; // Keep password as is
        
        const userData = {
            role: roleSelect.value,
            name: document.getElementById("name").value,
            dob: document.getElementById("dob").value,
            email: email, // Store the lowercased email
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            department: document.getElementById("department").value,
            joiningDate: document.getElementById("joiningDate").value,
            grade: document.getElementById("grade").value,
        };

        try {
            // Create user with Firebase Authentication
            console.log("Creating user with email:", email); // Log email used for user creation
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Save additional user data in Firestore
            await firestore.collection("users").doc(user.uid).set(userData);
            console.log("User data saved to Firestore:", userData); // Log saved user data

            alert("Registration successful!");

            // Determine the correct profile page based on the role
            let profilePage = "";
            switch (userData.role) {
                case "employee":
                    profilePage = "../profile/employee_profile.html"; // Employee profile page
                    break;
                case "manager":
                    profilePage = "../profile/manager_profile.html"; // Manager profile page
                    break;
                case "developer":
                    profilePage = "../profile/developer_profile.html"; // Developer profile page
                    break;
                default:
                    profilePage = "../profile/profile.html"; // Default profile page
                    break;
            }

            console.log("Redirecting to profile page:", profilePage); // Log the redirect path
            window.location.href = "../profile/profile.html"; // Change this to the correct profile page URL
        } catch (error) {
            console.error("Error during registration:", error); // Log the error
            alert("Registration failed! " + error.message); // Notify user of the error
        }
    });
});
