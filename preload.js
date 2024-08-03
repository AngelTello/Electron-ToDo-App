const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  getTodos: () => ipcRenderer.send("get-todos"),
  createToDo: (todo) => ipcRenderer.send("create-todo", todo),
  updateToDo: (id, todo) => ipcRenderer.send("update-todo", id, todo),
  deleteToDo: (id) => ipcRenderer.send("delete-todo", id),
  onRowsLoaded: (callback) =>
    ipcRenderer.on("todos-loaded", (_event, rows) => callback(rows)),
});
