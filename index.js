class TodoList {
  constructor(el) {
    this.todos = [];
    this.el = el;
    this.el.addEventListener('click', (e) => this.handleClick(e));
  }
  addTodo(value) {
    this.todos.push(value);
    this.render();
  }
  removeTodo(id) {
    this.todos = this.todos.filter((el) => {
      return el.id !== id;
    });
    deleteTodo(url,id).then(() => {
      let task = document.querySelectorAll(`[data-id="${id}"]`)[0];
      task.remove();
    });
  }
  getTodos() {
    return this.todos;
  }
  setTodos(todos) {
    this.todos = todos;
  }
  changeStatus(id) {
    let index = this.todos.findIndex((el) => el.id === id);
    this.todos[index].status = !this.todos[index].status;
    updateTodo(url,this.todos[index]).then(() => {
      let task = document.querySelectorAll(`[data-id="${id}"]`)[0];
      if (this.todos[index].status) {
        task.classList.remove('yellow-task');
        task.classList.add('green-task');
      } else {
        task.classList.remove('green-task');
        task.classList.add('yellow-task');
      }
    });
  }
  handleClick(e) {
    e.preventDefault();
    let target = e.target;
    let id = target.parentNode.dataset.id
    if (target.className.includes('set-status')) {
      this.changeStatus(id);
    } else {
      this.removeTodo(id);
    }
  }
  findTasks(str) {
    let todos = this.getTodos();
    this.todos = this.todos.filter(todo => todo.task && todo.task.includes(str));
    this.render();
    this.setTodos(todos);
  }
  render() {
    let lis = '';
    for (let el of this.todos) {
      if (!el) {
        return;
      }
      let classTask = el.status ? "green-task" : "yellow-task";
      lis += `<li data-id="${el.id}" class ="${classTask}">${el.task}<button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
    }
    this.el.innerHTML = lis;
  }
}

class Task {
  constructor(value, status) {
    this.task = value;
    this.status = status;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

let list = document.getElementById('list');
let todo1 = new TodoList(list);
const url = 'http://localhost:3000/todos';

window.onload = loadTodos(url).then(fetchedTodos => {
  fetchedTodos.forEach(todo => {
    todo1.addTodo(todo);
  });
    todo1.render();
});

function loadTodos(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.onerror = () => {
      reject("Error fetching " + url);
    }
    xhr.send();
  });
};

function sendTodo(url, todo) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200 || status == 201) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.onerror = () => {
      reject("Error fetching " + url);
    }
    xhr.send(JSON.stringify(todo));
  });
};

function updateTodo(url, todo) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', url + '/' + todo.id, true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200 || status == 201) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.onerror = () => {
      reject("Error fetching " + url);
    }
    xhr.send(JSON.stringify(todo));
  });
}

function deleteTodo(url, id) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url + '/' + id, true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200 || status == 201) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.onerror = () => {
      reject("Error fetching " + url);
    }
    xhr.send();
  });
}


let createBtn = document.getElementById('create-btn');
let findBtn = document.getElementById('find-btn');
let inp = document.querySelector('input');

createBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(inp.value) {
    sendTodo(url, new Task(inp.value, false))
      .then(fetchedTodo => {
          todo1.addTodo(fetchedTodo);
          inp.value = '';
        });
  }
});

findBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(inp.value) {
    todo1.findTasks(inp.value);
  }
});
