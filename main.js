// Select elements
const taskInput = document.getElementById('task');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

// Add tasks function
function addTask() {
    const taskText = taskInput.value.trim(); 

    if (taskText === '') {
        Swal.fire({
            icon: "error",
            title: "Be careful",
            text: "Please, write a task before you add it.",
            footer: '<a href="#">Need help?</a>'
        });
        return; 
    }

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="complete-btn">✔</button>
            <button class="delete-btn">✖</button>
        </div>
    `;

    taskList.appendChild(listItem);

    taskInput.value = '';
}

    addTaskButton.addEventListener('click', addTask);

taskList.addEventListener('click', function (event) {
    if (event.target.classList.contains('complete-btn')) {
        const taskItem = event.target.parentElement.parentElement;
        taskItem.classList.toggle('completed'); 
    } else if (event.target.classList.contains('delete-btn')) {
        const taskItem = event.target.parentElement.parentElement;
        taskList.removeChild(taskItem); 
    }
});

// Save tasks in LocalStorage function
function saveTasks() {
    const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('span').textContent,
        completed: task.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from LocalStorage function
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete-btn">✔</button>
                <button class="delete-btn">✖</button>
            </div>
        `;
        if (task.completed) {
            listItem.classList.add('completed');
        }
        taskList.appendChild(listItem);
    });
}

// Call loadTasks when the page is load
document.addEventListener('DOMContentLoaded', loadTasks);

// Save tasks when added, completed or deleted
taskList.addEventListener('click', saveTasks);
addTaskButton.addEventListener('click', saveTasks);
