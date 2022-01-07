class Task {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }
}

document.getElementById('formTask').addEventListener('submit', setTask);

function createElementWithContent(element, content) {
    const node = document.createElement(element);
    node.textContent = content ?? "";
    return node;
}

function createElementWithAttributes(element, attributes) {
    const node = document.createElement(element);
    for (const key in attributes) {
        node.setAttribute(key, attributes[key]);
    }
    return node;
}

function createElementComplete(element, attributes, content) {
    const node = document.createElement(element);
    for (const key in attributes) {
        node.setAttribute(key, attributes[key]);
    }
    node.textContent = content ?? "";
    return node;
}

function isEmpty(task) {
    let isEmpty = false
    Object.entries(task).forEach(item => {
        if (item[1] == "" || item[1] == undefined || item[1] == null) {
            isEmpty = true;
        }
    })
    return isEmpty;
}

function taskExist(task) {
    return getTasks().find(currentTask => currentTask.title == task.title);
}

function setTask(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const task = new Task(form.get("title"), form.get("description"));
    if (!isEmpty(task)) {
        if (!taskExist(task)) {
            const tasks = getTasks();
            tasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            displayTasks();
            document.getElementById('formTask').reset();
        } else {
            displayError("La tarea ya existe")
        }
    } else {
        displayError("Campo vacío");
    }
}

function showFormModify(formModify) {
    const divModify = document.getElementById("tasks");
    divModify.prepend(formModify);
}

function createFormToModify(task) {
    const row = createElementWithAttributes("div", { class: "row mx-1" });
    const formModify = createElementWithAttributes("form", { id: "formModify" });
    const card = createElementWithAttributes("div", { class: "card mb-2 bg-dark text-light" });
    const cardBody = createElementWithAttributes("div", { class: "card-body" });
    const cardTitle = createElementWithAttributes("div", { class: "card-title" });
    const h5Title = createElementWithContent("h5", "Título");
    const inputTitle = createElementWithAttributes("input", { name: "title", id: "title", value: task.title });
    const cardText = createElementWithAttributes("p", { class: "card-text" });
    const h5Description = createElementWithContent("h5", "Descripción");
    const inputDescription = createElementWithAttributes("input", { name: "description", id: "description", value: task.description });
    const btnSubmit = createElementWithAttributes("input", { id: title, type: "submit", class: "btn btn-success float-end mx-1", value: "Guardar" });
    formModify.addEventListener("submit", setTask)
    cardTitle.appendChild(h5Title);
    cardTitle.appendChild(inputTitle);
    cardText.appendChild(h5Description);
    cardText.appendChild(inputDescription);
    formModify.appendChild(cardTitle);
    formModify.appendChild(cardText);
    formModify.appendChild(btnSubmit);
    cardBody.appendChild(formModify);
    card.appendChild(cardBody);
    row.appendChild(card);
    deleteTask(task.title);
    showFormModify(row);
}

function modifyTask(id) {
    const tasks = getTasks();
    const task = tasks.find(task => task.title === id)
    createFormToModify(task);
}

function deleteTask(titleTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((element, index) => {
        if (element.title == titleTask) {
            tasks.splice(index, 1);
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function createTaskCard({ title, description }) {
    const row = createElementWithAttributes("div", { class: "row mx-1" });
    const card = createElementWithAttributes("div", { class: "card mb-2 bg-dark text-light" });
    const cardBody = createElementWithAttributes("div", { class: "card-body" });
    const cardTitle = createElementWithAttributes("div", { class: "card-title" });
    const h5title = createElementWithContent("h5", title);
    const cardText = createElementComplete("p", { class: "card-text" }, description);
    const btnDelete = createElementComplete("a", { id: title, class: "btn btn-danger float-end" }, "Borrar");
    const btnModify = createElementComplete("a", { id: title, class: "btn btn-warning float-end mx-1", href: "#nav" }, "Modificar");
    row.appendChild(card);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardTitle.appendChild(h5title);
    cardBody.appendChild(cardText);
    btnDelete.addEventListener("click", function (e) {
        deleteTask(e.target.id);
    });
    btnModify.addEventListener("click", function (e) {
        modifyTask(e.target.id);
    });
    cardBody.appendChild(btnDelete);
    cardBody.appendChild(btnModify);
    return row;
}

function displayError(mensaje) {
    const alert = createElementComplete("div", { class: "alert alert-danger m-3" }, mensaje);
    document.getElementById("menuAdd").appendChild(alert);
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}

function displayTasks() {
    document.getElementById("tasks").textContent = "";
    getTasks().forEach(task => {
        document.getElementById("tasks").appendChild(createTaskCard(task));
    });
}

function getTasks() {
    const data = JSON.parse(localStorage.getItem('tasks'));
    return data ?? [];
}

displayTasks();