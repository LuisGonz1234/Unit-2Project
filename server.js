const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log("File read is error:", err.message);
      console.log("Tried to open:", filePath);

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    serveFile(res, path.join(__dirname, "views", "index.html"), "text/html");
  }
  else if (req.method === "GET" && req.url === "/tasks") {
    serveFile(res, path.join(__dirname, "views", "tasks.html"), "text/html");
  }
  else if (req.method === "GET" && req.url === "/add") {
    serveFile(res, path.join(__dirname, "views", "add.html"), "text/html");
  }
  else if (req.method === "GET" && req.url === "/style.css") {
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