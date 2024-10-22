import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

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

// Function to fetch tasks from Firestore
async function fetchTasks() {
    const querySnapshot = await getDocs(collection(db, 'featureChangeRequests'));
    const taskTableBody = document.getElementById('taskTableBody');
    taskTableBody.innerHTML = ''; // Clear existing content

    querySnapshot.forEach(doc => {
        const task = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.featureDetails || 'N/A'}</td>
            <td>${task.employeeName || 'N/A'}</td>
            <td>${task.status || 'N/A'}</td>
            <td>
                <select class="priority-update">
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                </select>
            </td>
            <td>
                <input type="date" class="deadline-input" value="${task.deadline || ''}">
            </td>
            <td>
                <progress value="${task.progress}" max="100" class="task-progress"></progress>
            </td>
            <td>
                <form onsubmit="updateTask(event, '${doc.id}');">
                    <select name="status" class="status-update">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button type="submit">Update</button>
                </form>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

// Update task status and progress
window.updateTask = async function (event, taskId) {
    event.preventDefault(); // Prevent the form from submitting normally
    const form = event.target;
    const status = form.querySelector('.status-update').value;
    const progressBar = form.closest('tr').querySelector('.task-progress');
    
    // Logic to update the progress based on status
    let newProgress = 0;
    if (status === 'in_progress') {
        newProgress = 50; // Example: set progress to 50% when in progress
    } else if (status === 'completed') {
        newProgress = 100; // Set progress to 100% when completed
    }

    // Update Firestore document
    const taskRef = doc(db, 'featureChangeRequests', taskId);
    await updateDoc(taskRef, {
        status: status,
        progress: newProgress
    });

    // Update the progress bar and display the new status
    progressBar.value = newProgress;
    const statusCell = form.closest('tr').children[2]; // Assuming status is in the 3rd column
    statusCell.textContent = status;
};

// Fetch tasks when the page loads
fetchTasks();
