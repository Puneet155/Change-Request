// Import necessary functions from Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, addDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfUzxIGI6W7L1hIPuhhcmOP2BLrW3rVV8",
    authDomain: "change-request-4cdd9.firebaseapp.com",
    projectId: "change-request-4cdd9",
    storageBucket: "change-request-4cdd9.appspot.com",
    messagingSenderId: "922890755209",
    appId: "1:922890755209:web:55ad6f4dbfcab2c0477a58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function() {
    fetchShiftChangeRequests();
    fetchFeatureChangeRequests();
    fetchDevelopers();

    // Function to fetch shift change requests from Firestore
    async function fetchShiftChangeRequests() {
        try {
            const snapshot = await getDocs(query(collection(db, 'shiftChangeRequests'), where('status', '==', 'pending')));
            const shiftChangeRequestsElement = document.querySelector('#shiftChangeRequests');

            console.log(`Fetched ${snapshot.size} shift change requests.`); // Debugging log

            if (shiftChangeRequestsElement) {
                shiftChangeRequestsElement.innerHTML = ''; // Clear existing content

                snapshot.forEach(doc => {
                    const data = doc.data();
                    console.log(data); // Log the data fetched
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${data.employeeName || 'N/A'}</td>
                        <td>${data.currentShift || 'N/A'}</td>
                        <td>${data.newShift || 'N/A'}</td>
                        <td>
                            <button onclick="approveShift('${doc.id}', '${data.employeeId}')">Approve</button>
                            <button onclick="rejectShift('${doc.id}')">Reject</button>
                        </td>
                    `;
                    shiftChangeRequestsElement.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error fetching shift change requests: ', error);
        }
    }

    // Function to fetch feature change requests from Firestore
    async function fetchFeatureChangeRequests() {
        try {
            const snapshot = await getDocs(query(collection(db, 'featureChangeRequests'), where('status', '==', 'pending')));
            const featureChangeRequestsElement = document.querySelector('#featureChangeRequests');

            console.log(`Fetched ${snapshot.size} feature change requests.`); // Debugging log

            if (featureChangeRequestsElement) {
                featureChangeRequestsElement.innerHTML = ''; // Clear existing content

                snapshot.forEach(doc => {
                    const data = doc.data();
                    console.log(data); // Log the data fetched
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${data.employeeName || 'N/A'}</td>
                        <td>${data.featureChangeType || 'N/A'}</td>
                        <td>${data.featureDetails || 'N/A'}</td>
                        <td>
                            <select name="developer" id="developer-${doc.id}">
                                <!-- Developer options will be populated from Firestore -->
                            </select>
                            <button onclick="assignFeature('${doc.id}')">Assign</button>
                        </td>
                    `;
                    featureChangeRequestsElement.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error fetching feature change requests: ', error);
        }
    }

    // Function to fetch developers from Firestore
    async function fetchDevelopers() {
        try {
            const developerQuery = query(collection(db, 'users'), where('role', '==', 'developer'));
            const snapshot = await getDocs(developerQuery);
            const developerSelects = document.querySelectorAll("select[name='developer']");

            snapshot.forEach(doc => {
                const developerName = doc.data().name;
                developerSelects.forEach(select => {
                    const option = document.createElement("option");
                    option.value = doc.id; // Use document ID for value
                    option.textContent = developerName; // Display developer's name
                    select.appendChild(option);
                });
            });
        } catch (error) {
            console.error('Error fetching developers: ', error);
        }
    }

    // Function to approve a shift change request
    window.approveShift = async (requestId, employeeId) => {
        try {
            const requestRef = doc(db, 'shiftChangeRequests', requestId);
            await updateDoc(requestRef, { status: 'approved' });

            console.log(`Approved shift change request ${requestId}`);
            fetchShiftChangeRequests(); // Refresh the list
        } catch (error) {
            console.error('Error approving shift: ', error);
        }
    };

    // Function to reject a shift change request
    window.rejectShift = async (requestId) => {
        try {
            const requestRef = doc(db, 'shiftChangeRequests', requestId);
            await updateDoc(requestRef, { status: 'rejected' });

            console.log(`Rejected shift change request ${requestId}`);
            fetchShiftChangeRequests(); // Refresh the list
        } catch (error) {
            console.error('Error rejecting shift: ', error);
        }
    };

    // Function to assign a feature to a developer
    window.assignFeature = async (requestId) => {
        const developerId = document.querySelector(`#developer-${requestId}`).value;

        try {
            const requestRef = doc(db, 'featureChangeRequests', requestId);
            await updateDoc(requestRef, { status: 'assigned', assignedDeveloperId: developerId });

            // Create a new document in the developer's feature tracking collection
            await addDoc(collection(db, 'developerFeatures'), {
                developerId: developerId,
                featureRequestId: requestId,
                assignedAt: new Date(),
                status: 'assigned'
            });

            console.log(`Assigned feature change request ${requestId} to developer ${developerId}`);
            fetchFeatureChangeRequests(); // Refresh the list
        } catch (error) {
            console.error('Error assigning feature: ', error);
        }
    };
});
