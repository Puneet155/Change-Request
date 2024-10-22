// Function to show an alert when the login button is clicked
const loginButton = document.querySelector('.btn');
if (loginButton) {
    loginButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        alert("Redirecting to Login Page...");
        window.location.href = '../login/login.html'; // Redirect to the login page
    });
}

// Function to show an alert when the sign-up button is clicked
const signupButton = document.querySelector('.btn-secondary');
if (signupButton) {
    signupButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        alert("Redirecting to Sign Up Page...");
        window.location.href = '../registration/registration.html'; // Redirect to the sign-up page
    });
}
