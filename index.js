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
    fetch(todosUrl + '/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
    .then(response => response.json())
    .catch((error) => {
      console.log(error.message);
    })
    .then(() => {
      this.todos = this.todos.filter((el) => {
        return el.id !== id;
      });
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
    fetch(todosUrl + '/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(this.todos[index])
    })
    .then(response => response.json())
    .catch((error) => {
      console.log(error.message)
    })
    .then(fetchedTodo => {
      let task = document.querySelectorAll(`[data-id="${id}"]`)[0];
      if(fetchedTodo.status) {
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
    if(target.className.includes('set-status')) {
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

let todosUrl = "http://localhost:3000/todos";

function loadTodos() {
  fetch(todosUrl)
    .then(response => response.json())
    .catch((error) => {
      console.log(error.message);
    })
    .then(fetchedTodos => {
      fetchedTodos.forEach(todo => {
        todo1.addTodo(todo);
      });
      todo1.render();
    });
}

loadTodos();

let createBtn = document.getElementById('create-btn');
let findBtn = document.getElementById('find-btn');
let inp = document.querySelector('input');

createBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(inp.value) {
    fetch(todosUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(new Task(inp.value, false))
    })
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      })
      .then(fetchedTodo => {
        todo1.addTodo(fetchedTodo);
      });
  }
})

findBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(inp.value) {
    todo1.findTasks(inp.value);
  }
})
