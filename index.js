const input = document.querySelector(".input");
const deleteItem = document.querySelector(".delete");
const edit = document.querySelector(".edit");
const addToDo = document.querySelector(".add-todo");
const todos = document.querySelector(".todos");

//global variables
const allTodos = [];
let value;

let isEditMode = false;
let editTodoId = null;

//input event listener
input.addEventListener("change", function (e) {
  value = e.target.value;
});

//functions
function createToDo() {
  return {
    id: Date.now().toString(),
    value,
  };
}

function setItemToLocalStorage(todos) {
  return localStorage.setItem("Todos", JSON.stringify(todos));
}

function updateTodo(id, content) {
  let prevTodos = JSON.parse(localStorage.getItem("Todos"));

  let updatedTodos = prevTodos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        value: content,
      };
    }
    return todo;
  });

  return updatedTodos;
}

function itemToBeAppended(value, id) {
  let itemToBeAppended = `<div class="todo" data-id="${id}">
    <h3 class="todo-content" >${value}</h3>
    <div class="icons">
      <div class="icon delete">
        <ion-icon class="trash" name="trash"></ion-icon>
      </div>
      <div class="icon edit">
        <ion-icon class="create" name="create"></ion-icon>
      </div>
    </div>
  </div>
  `;

  return itemToBeAppended;
}

//events listeners
addToDo.addEventListener("click", function () {
  let todoContent = input.value.trim();
  if (!todoContent) {
    return alert("please enter the todo first!");
  }
  const noTodosMessage = todos.querySelector(".black");
  if (noTodosMessage) {
    noTodosMessage.remove();
  }

  if (isEditMode) {
    const updatedTodos = updateTodo(editTodoId, todoContent);

    setItemToLocalStorage(updatedTodos);

    const todoElement = document.querySelector(
      `.todo[data-id='${editTodoId}']`
    );
    todoElement.querySelector(".todo-content").textContent = todoContent;
  } else {
    let todo = createToDo();
    allTodos.push(todo);
    const previousTodos = JSON.parse(localStorage.getItem("Todos"));
    if (!previousTodos) {
      localStorage.setItem("Todos", JSON.stringify(allTodos));
    } else {
      previousTodos.push(todo);
      setItemToLocalStorage(previousTodos);
    }

    const fetchedTodos = JSON.parse(localStorage.getItem("Todos"));
    let newTodo = fetchedTodos.find((t) => t.id === todo.id);
    console.log(newTodo);

    todos.insertAdjacentHTML(
      "beforeend",
      itemToBeAppended(newTodo.value, newTodo.id)
    );
  }
  input.value = "";
});

todos.addEventListener("click", (event) => {
  if (event.target.closest(".delete")) {
    let todoElement = event.target.closest(".todo");
    let deleteTodoContent =
      todoElement.querySelector(".todo-content").textContent;

    todoElement.remove();

    let prevTodos = JSON.parse(localStorage.getItem("Todos"));

    let newTodos = prevTodos.filter((todo) => todo.value !== deleteTodoContent);

    setItemToLocalStorage(newTodos);
  }
});

todos.addEventListener("click", (event) => {
  if (event.target.closest(".edit")) {
    const todoelement = event.target.closest(".todo");
    let editTodoContent =
      todoelement.querySelector(".todo-content").textContent;
    input.value = editTodoContent;
    isEditMode = true;

    editTodoId = todoelement.dataset.id;
  }
});

//function to load the todos from the localStrorage if they where there is the local storage
function loadTodos() {
  window.addEventListener("load", () => {
    let todosToBeDisplayed = JSON.parse(localStorage.getItem("Todos"));
    if (todosToBeDisplayed) {
      todosToBeDisplayed = todosToBeDisplayed
        .map((item) => itemToBeAppended(item.value))
        .join("");
    }

    if (!todosToBeDisplayed) {
      return (todos.innerHTML = `<h2 class="black">No Todos to show</h2>`);
    }
    if (todosToBeDisplayed) {
      todos.insertAdjacentHTML("beforeend", todosToBeDisplayed);
    }
  });
}

loadTodos();
