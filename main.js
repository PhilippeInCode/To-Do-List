const taskInput = document.getElementById('task');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const deleteAllButton = document.getElementById('delete-all');
const clockElement = document.getElementById('clock');
const calendarElement = document.getElementById('calendar');
const themeButton = document.getElementById('theme-button');

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function renderCalendar() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    calendarElement.innerHTML = `
        <div class="calendar-container">
            ${formattedDate}
        </div>
    `;
}

function initializeDateTime() {
    updateClock();
    renderCalendar();
    setInterval(updateClock, 1000); 
}

function updateDeleteAllVisibility() {
    if (taskList.children.length > 0) {
        deleteAllButton.style.display = 'block';
    } else {
        deleteAllButton.style.display = 'none';
    }
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        Swal.fire({
            icon: "error",
            title: "Be careful",
            text: "Please, write a task before you add it.",
            footer: '<a href="https://www.adobe.com/acrobat/hub/how-to-categorize-your-to-do-list.html">Need help?</a>'
        });
        return;
    }

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="complete-btn">Done</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(listItem);
    taskInput.value = '';
    updateDeleteAllVisibility(); 
}

addTaskButton.addEventListener('click', addTask);

taskList.addEventListener('click', function (event) {
    if (event.target.classList.contains('complete-btn')) {
        const taskItem = event.target.parentElement.parentElement;

        if (taskItem.classList.contains('completed')) {
            Swal.fire({
                icon: "info",
                title: "Task already completed",
                text: "This task is already marked as completed."
            });
            return; 
        }

        Swal.fire({
            title: "Attention",
            text: "Do you want to mark this task as completed?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4CAF50",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                taskItem.classList.add('completed');
                taskItem.style.backgroundColor = "#d4f7d4";
                taskItem.style.color = "#2d7d2d";
                Swal.fire("Marked!", "Your task has been marked as completed.", "success");
            }
        });
    } else if (event.target.classList.contains('delete-btn')) {
        const taskItem = event.target.parentElement.parentElement;

        Swal.fire({
            title: "Be careful",
            text: "Do you want to delete the task?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                taskList.removeChild(taskItem);
                Swal.fire("Deleted!", "Your task has been deleted.", "success");
                updateDeleteAllVisibility(); 
            }
        });
    }
});

function saveTasks() {
    const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('span').textContent,
        completed: task.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete-btn">Done</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        if (task.completed) {
            listItem.classList.add('completed');
            listItem.style.backgroundColor = "#d4f7d4";
            listItem.style.color = "#2d7d2d";
        }
        taskList.appendChild(listItem);
    });
    updateDeleteAllVisibility(); 
}

function deleteAllTasks() {
    if (taskList.children.length === 0) {
        Swal.fire({
            icon: "info",
            title: "No tasks",
            text: "There are no tasks to delete."
        });
        return;
    }

    Swal.fire({
        title: "Be careful",
        text: "Do you want to delete all the tasks?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            taskList.innerHTML = '';
            saveTasks();
            updateDeleteAllVisibility(); 
            Swal.fire("Deleted!", "All the tasks are deleted.", "success");
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeButton.textContent = 'Light';
        Swal.fire({
            icon: 'success',
            title: 'Dark Mode Enabled',
            text: 'The interface is now in dark mode.',
            background: '#333',
            color: '#e0e0e0'
        });
    } else {
        themeButton.textContent = 'Dark';
        Swal.fire({
            icon: 'success',
            title: 'Light Mode Enabled',
            text: 'The interface is now in light mode.',
            background: '#f9f9f9',
            color: '#333'
        });
    }
}

deleteAllButton.addEventListener('click', deleteAllTasks);
document.addEventListener('DOMContentLoaded', loadTasks);
taskList.addEventListener('click', saveTasks);
addTaskButton.addEventListener('click', saveTasks);
document.addEventListener('DOMContentLoaded', initializeDateTime);
themeButton.addEventListener('click', toggleTheme);
