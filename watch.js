const chokidar = require("chokidar");
const Diff = require("diff");
const fs = require("fs");
require("dotenv").config();
const socket = require("./socket");

var DIR_PATH = process.env.DIR_PATH;
var READY = false;
var FILESTATE = {};

const log = console.log.bind(console);

function onAdd(path) {
  FILESTATE[path] = fs.readFileSync(path, "utf8");
  if (!READY) return;
  let change = getChange(path);
  if (change == -1) return;
  socket.sendChange(change, path);
}

function onChange(path) {
  if (!READY) return;
  let change = getChange(path);
  if (change == -1) return;
  socket.sendChange(change, path);
}

function getAdditions(diff) {
  // We assume that we know a diff is needed (i.e we've checked to see an actual change has occured in the files)
  // To clean the diff to only get the user's added keystrokes, we must:
  // 1. Only grab the changes that have `added` == true OR are static text ("")
  // 2. Remove "static text" additions from beginning and end of changes (these are text that exist in both files that haven't moved)
  // # TODO: 3. Remove any static text that lives between an "added" change. These are just static text but must be done recrusively.
  if (diff.length == 0) return [];
  diff = diff.filter(
    (item) =>
      item.added == true ||
      (item.added == undefined && item.removed == undefined)
  );
  if (diff.length == 0) return [];
  let beginning = diff.shift();
  if (beginning.added == true) {
    diff.unshift(beginning);
  }
  if (diff.length == 0) return [];
  let end = diff.pop();
  if (end.added == true) {
    diff.push(end);
  }
  return diff;
}

function getChange(filePath) {
  let oldFileContent = FILESTATE[filePath];
  let newFileContent = fs.readFileSync(filePath, "utf-8");
  FILESTATE[filePath] = newFileContent;
  if (newFileContent == oldFileContent) {
    return -1;
  }
  if (newFileContent == "") {
    return -1;
  }
  let diff = Diff.diffWords(oldFileContent, newFileContent);
  diff = getAdditions(diff);
  if (diff.length == 0) {
    return -1;
  }
  let change = diff.map((item) => item["value"]);
  return change.join(" ");
}

const watcher = chokidar.watch(DIR_PATH, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: false,
});

watcher
  .on("ready", () => (READY = true))
  .on("add", async (path) => {
    log(`Watched File ${path} has been added`);
    onAdd(path);
  })
  .on("change", async (path) => {
    log(`Watched File ${path} has been changed`);
    onChange(path);
  });
