const taskInput = document.getElementById('task');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

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
}


addTaskButton.addEventListener('click', addTask);

taskList.addEventListener('click', function (event) {
    if (event.target.classList.contains('complete-btn')) {
        const taskItem = event.target.parentElement.parentElement;

        Swal.fire({
            title: "Be careful",
            text: "Do you want to mark this task as completed?",
            icon: "warning",
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
            title: "Do you want to delete the task?",
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
}

document.addEventListener('DOMContentLoaded', loadTasks);

taskList.addEventListener('click', saveTasks);
addTaskButton.addEventListener('click', saveTasks);
