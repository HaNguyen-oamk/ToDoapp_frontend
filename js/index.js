const BACKEND_ROOT_URL = "http://localhost:3001";
import { Todos } from "./class/Todos.js";
const todos = new Todos(BACKEND_ROOT_URL);
const list = document.querySelector("ul");
const input = document.querySelector("input");
input.disabled = true;

const renderTask = (task) => {
  const li = document.createElement("li");
  li.setAttribute("class", "list-group-item");
  li.setAttribute("data-key", task.getId().toString()); // Add error handling for undefined task
  li.innerHTML = task.getText(); // Add error handling for undefined task
  renderSpan(li, task.getText());
  renderLink(li, task.getId()); // Pass appropriate value for getId()
  list.appendChild(li);
};

const renderLink = (li, id) => {
  const a = li.appendChild(document.createElement("a"));
  a.innerHTML = '<i class="bi bi-trash"></i>';
  a.setAttribute("style", "float: right");
  a.addEventListener("click", (event) => {
    todos
      .removeTask(id)
      .then((removed_id) => {
        const li_to_remove = document.querySelector(
          `[data-key='${removed_id}']`
        );
        if (li_to_remove) {
          list.removeChild(li_to_remove);
        }
      })
      .catch((error) => {
        alert(error);
      });
  });
};

const renderSpan = (li, text) => {
  const span = document.createElement("span");
  span.innerHTML = text;
};

input.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    const task = input.value.trim();

    if (task !== "") {
      todos.addTask(task).then((task) => {
        renderTask(task);
        input.value = "";
        input.focus();
      });
    }
  }
});

const getTasks = () => {
  todos
    .getTasks()
    .then((tasks) => {
      tasks.forEach((task) => {
        renderTask(task);
      });
      input.disabled = false;
    })
    .catch((error) => {
      alert(error);
    });
};

const saveTask = async (task) => {
  try {
    const json = JSON.stringify({ description: task });
    const response = await fetch(BACKEND_ROOT_URL + "/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });
    return response.json();
  } catch (error) {
    alert("Error saving task " + error.message);
  }
};

getTasks();

console.log("Fetching data from:", BACKEND_ROOT_URL);

fetch(BACKEND_ROOT_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Received data:", data);
    // Process the received data
  })
  .catch((error) => {
    console.error("Fetch error:", error);
    // Handle the error
  });
