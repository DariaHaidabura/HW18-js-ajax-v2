function loadItems() {
  fetch(todosUrl)
    .then(response => response.json())
    .then(fetchedTodos => {
      todos = fetchedTodos;
      renderTodos(todos);
    });
}

loadItems();

function createItem(item) {
  fetch(todosUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(fetchedTodos => {
      todos = fetchedTodos;
      console.log(todos);
    });
}

function renderTodos(todos) {
  todos.forEach((todo) => {
    if (isAlphaNumeric(todo.task)) {
      console.log(todo);
      const li = createListItem(todo);
      ul.append(li);
      input.focus();
    }
  });
}