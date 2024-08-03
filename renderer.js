const getTodos = () => {
  window.electronAPI.getTodos();
};

const submitTodo = () => {
  const title = $("#title").val();
  const description = $("#description").val();

  const todo = {
    title,
    description,
  };

  window.electronAPI.createToDo(todo);
};

window.electronAPI.onRowsLoaded((rows) => {
  console.log(rows);
});
