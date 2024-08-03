const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  getTodos: () => ipcRenderer.send("get-todos"),
  createToDo: (todo) => ipcRenderer.send("create-todo", todo),
  onRowsLoaded: (callback) =>
    ipcRenderer.on("todos-loaded", (_event, rows) => callback(rows)),
});
