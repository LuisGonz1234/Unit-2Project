const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");
const taskModule = require("./modules/taskModule");

const PORT = 3000;

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === "GET" && pathname === "/") {
    serveFile(res, path.join(__dirname, "views", "index.html"), "text/html");
  }
  else if (req.method === "GET" && pathname === "/tasks") {
    const tasks = taskModule.getAllTasks();

    let taskHtml = "";

    tasks.forEach(task => {
      taskHtml += `
        <div class="task-card">
          <p><strong>ID:</strong> ${task.id}</p>
          <p><strong>Title:</strong> ${task.title}</p>
          <p><strong>Status:</strong> ${task.status}</p>
          <a href="/delete?id=${task.id}">Delete</a>
        </div>
      `;
    });

    fs.readFile(path.join(__dirname, "views", "tasks.html"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Server Error");
        return;
      }

      const finalHtml = data.replace("{{tasks}}", taskHtml);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(finalHtml);
    });
  }
  else if (req.method === "GET" && pathname === "/add") {
    serveFile(res, path.join(__dirname, "views", "add.html"), "text/html");
  }
  else if (req.method === "POST" && pathname === "/create-task") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

      req.on("end", () => {
      const formData = querystring.parse(body);
      taskModule.createTask(formData.title, formData.status);

      res.writeHead(302, { Location: "/tasks" });
      res.end();
    });
  }
  else if (req.method === "GET" && pathname === "/delete") {
  const id = parseInt(parsedUrl.query.id);
  taskModule.deleteTask(id);

  res.writeHead(302, { Location: "/tasks" });
  res.end();
  }
  else if (req.method === "GET" && pathname === "/update") {
  const id = parseInt(parsedUrl.query.id);
  const title = parsedUrl.query.title;
  const status = parsedUrl.query.status;

  taskModule.updateTask(id, title, status);

  res.writeHead(302, { Location: "/tasks" });
  res.end();
  }
  else if (req.method === "GET" && pathname === "/style.css") {
    serveFile(res, path.join(__dirname, "public", "style.css"), "text/css");
  }
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Page Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});