
let latestCommand = null;
let nextId = 1;

export function setLatestCommand(command) {
  latestCommand = command;
}

export function getLatestCommand() {
  return latestCommand;
}

export function clearLatestCommand() {
  latestCommand = null;
}

export function getNextId() {
  return `cmd_${String(nextId++).padStart(3, '0')}`;
}
