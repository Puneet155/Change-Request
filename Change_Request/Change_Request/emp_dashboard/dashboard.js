// Import necessary functions from Firebase
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

const { db, auth } = window.firebase;

// Function to fetch the employee name from the database
async function fetchEmployeeName(employeeId) {
    try {
        const userDocRef = doc(db, 'users', employeeId); // Reference to the user's document
        const userDoc = await getDoc(userDocRef); // Fetch the document

        if (userDoc.exists()) {
            return userDoc.data().name; // Return the employee's name
        } else {
            console.error('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching employee name:', error);
        return null;
    }
}

// Show appropriate form based on the selected request type
document.getElementById('requestType').addEventListener('change', function() {
    const selectedType = this.value;
    const shiftChangeSection = document.getElementById('shiftChangeSection');
    const featureChangeSection = document.getElementById('featureChangeSection');

    // Hide both sections initially
    shiftChangeSection.style.display = 'none';
    featureChangeSection.style.display = 'none';

    // Show the selected section
    if (selectedType === 'shift') {
        shiftChangeSection.style.display = 'block';
        document.getElementById('currentShift').value = ''; // Reset current shift
        document.getElementById('newShift').innerHTML = '<option value="" disabled selected>Select a shift</option>'; // Reset new shift options
    } else if (selectedType === 'feature') {
        featureChangeSection.style.display = 'block';
    }
});

// Shift Change Logic
document.getElementById('currentShift').addEventListener('change', function() {
    const currentShift = this.value;
    const newShift = document.getElementById('newShift');

    // Clear previous options
    newShift.innerHTML = '<option value="" disabled selected>Select a shift</option>';

    // Add shift options based on current shift
    if (currentShift === 'a') {
        newShift.innerHTML += '<option value="b">A to B</option>';
        newShift.innerHTML += '<option value="c">A to C</option>';
    } else if (currentShift === 'b') {
        newShift.innerHTML += '<option value="a">B to A</option>';
        newShift.innerHTML += '<option value="c">B to C</option>';
    } else if (currentShift === 'c') {
        newShift.innerHTML += '<option value="a">C to A</option>';
        newShift.innerHTML += '<option value="b">C to B</option>';
    }
});

// Feature Change Logic
document.getElementById('featureChangeType').addEventListener('change', function() {
    const featureDetails = document.getElementById('featureDetails');

    // Customize input based on selection
    if (this.value === 'add_new' || this.value === 'modify' || this.value === 'rename') {
        featureDetails.placeholder = "Enter details about the feature.";
    } else if (this.value === 'remove') {
        featureDetails.placeholder = "Enter the feature to remove.";
    } else if (this.value === 'prioritize' || this.value === 'reorder') {
        featureDetails.placeholder = "Specify priority or order.";
    }
});

// Submit Shift Change Request
document.getElementById('shiftChangeForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const currentShift = document.getElementById('currentShift').value;
    const newShift = document.getElementById('newShift').value;
    const employeeId = auth.currentUser.uid; // Get current user's ID

    const employeeName = await fetchEmployeeName(employeeId); // Fetch employee name

    try {
        // Add shift change request to Firestore
        await addDoc(collection(db, 'shiftChangeRequests'), {
            employeeId: employeeId,
            employeeName: employeeName, // Add employee name to the request
            currentShift: currentShift,
            newShift: newShift,
            status: 'pending', // Initial status
            timestamp: serverTimestamp()
        });

        alert('Shift change request submitted successfully!'); // Success message
        document.getElementById('shiftChangeForm').reset(); // Reset form
    } catch (error) {
        console.error('Error submitting shift change request: ', error);
        alert('Error submitting shift change request. Please try again.'); // Error message
    }
});

// Submit Feature Change Request
document.getElementById('featureChangeForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const featureChangeType = document.getElementById('featureChangeType').value;
    const featureDetails = document.getElementById('featureDetails').value;
    const employeeId = auth.currentUser.uid; // Get current user's ID

    const employeeName = await fetchEmployeeName(employeeId); // Fetch employee name

    try {
        // Add feature change request to Firestore
        await addDoc(collection(db, 'featureChangeRequests'), {
            employeeId: employeeId,
            employeeName: employeeName, // Add employee name to the request
            featureChangeType: featureChangeType,
            featureDetails: featureDetails,
            status: 'pending', // Initial status
            timestamp: serverTimestamp()
        });

        alert('Feature change request submitted successfully!'); // Success message
        document.getElementById('featureChangeForm').reset(); // Reset form
    } catch (error) {
        console.error('Error submitting feature change request: ', error);
        alert('Error submitting feature change request. Please try again.'); // Error message
    }
});
