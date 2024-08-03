const getTodos = () => {
  window.electronAPI.getTodos();
};

const submitTodo = () => {
  const id = $("#todoId").val().trim();
  const title = $("#title").val().trim();
  const description = $("#description").val().trim();

  const todo = {
    title,
    description,
  };

  id != ""
    ? window.electronAPI.updateToDo(id, todo)
    : window.electronAPI.createToDo(todo);
};

const deleteTodo = (id) => {
  window.electronAPI.deleteToDo(id);

  $(`#panel${id}`).remove();
};

window.electronAPI.onRowsLoaded((rows) => {
  rows.forEach((row) => {
    todoHTML = getTodoHTML(row);
    $("#accordion").append(todoHTML);
  });
});

const getTodoHTML = (data) => {
  return `<div class="panel panel-default" id="panel${data.id}">
          <div class="panel-heading">
            <span class="panel-title">
              <a
                id="title${data.id}"
                data-toggle="collapse"
                data-parent="#accordion"
                href="#collapse${data.id}"
              >
              ${data.title}</a
              >
            </span>
            <div class="actions">
              <button
                type="button"
                class="btn btn-info"
                onclick="openModal(${data.id})"
              >
                <span class="glyphicon glyphicon-pencil"></span>
              </button>
              <button type="button" class="btn btn-danger" onclick="deleteTodo(${data.id})">
                <span class="glyphicon glyphicon-trash"></span>
              </button>
            </div>
          </div>
          <div id="collapse${data.id}" class="panel-collapse collapse">
            <div class="panel-body" id="description${data.id}">
              ${data.description}
            </div>
          </div>
        </div>`;
};
