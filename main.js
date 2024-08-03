const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("node:path");
const sqlite3 = require("sqlite3").verbose();

const runMigration = () => {
  const db = new sqlite3.Database("db/todos.db");

  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT)"
    );
  });

  db.close();
};

const handleCreateToDo = (event, todo) => {
  const db = new sqlite3.Database("db/todos.db");

  const sqlStatement = `INSERT INTO todos (title, description) VALUES ('${todo.title}', '${todo.description}')`;

  db.serialize(() => {
    db.exec(sqlStatement);
  });

  db.close();
};

const handleUpdateToDo = (event, id, todo) => {
  const db = new sqlite3.Database("db/todos.db");

  db.run(
    "UPDATE todos SET title = $title, description = $description WHERE id = $id",
    {
      $id: id,
      $title: todo.title,
      $description: todo.description,
    }
  );

  db.close();
};

const handleDeleteToDo = (event, id) => {
  const db = new sqlite3.Database("db/todos.db");

  const sqlStatement = `DELETE FROM todos WHERE id = ${id}`;

  db.serialize(() => {
    db.exec(sqlStatement);
  });

  db.close();
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  runMigration();

  ipcMain.on("create-todo", handleCreateToDo);
  ipcMain.on("update-todo", handleUpdateToDo);
  ipcMain.on("delete-todo", handleDeleteToDo);
  ipcMain.on("get-todos", (event) => {
    const db = new sqlite3.Database("db/todos.db");

    const sqlStatement = `SELECT id, title, description FROM todos`;

    db.all(sqlStatement, function (err, rows) {
      // Handle error
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);

      win.webContents.send("todos-loaded", rows);
    });

    db.close();
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
