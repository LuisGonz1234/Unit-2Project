const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "tasks.json");

function getAllTasks() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

function createTask(title, status) {
  const tasks = getAllTasks();

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title: title,
    status: status
  };

  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

function getTaskById(id) {
  const tasks = getAllTasks();
  return tasks.find(task => task.id === id);
}

function updateTask(id, newTitle, newStatus) {
  const tasks = getAllTasks();
  const task = tasks.find(task => task.id === id);

  if (task) {
    task.title = newTitle;
    task.status = newStatus;
    saveTasks(tasks);
    return task;
  }

  return null;
}

function deleteTask(id) {
  const tasks = getAllTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);

  if (updatedTasks.length !== tasks.length) {
    saveTasks(updatedTasks);
    return true;
  }

  return false;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};