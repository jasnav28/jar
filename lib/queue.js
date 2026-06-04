
// lib/queue.js
// Lightweight in-memory command queue for JARVIS Vercel API
// Supports future migration to Redis/Upstash/database

class CommandQueue {
  constructor() {
    this.commands = [];
    this.nextId = 1;
  }

  // Add a new command to the queue
  addCommand(commandData) {
    const command = {
      id: `cmd_${String(this.nextId++).padStart(3, '0')}`,
      command: commandData.command,
      status: 'pending',
      source: commandData.source || 'unknown',
      timestamp: new Date().toISOString(),
    };
    this.commands.push(command);
    return command;
  }

  // Get the latest pending command (for poller)
  getLatestCommand() {
    return this.commands.find(cmd => cmd.status === 'pending') || null;
  }

  // Update a command's status
  updateCommandStatus(id, status) {
    const index = this.commands.findIndex(cmd => cmd.id === id);
    if (index !== -1) {
      this.commands[index].status = status;
      return this.commands[index];
    }
    return null;
  }

  // Get queue size
  getQueueSize() {
    return this.commands.filter(cmd => cmd.status === 'pending').length;
  }

  // Get all commands (for debugging)
  getAllCommands() {
    return this.commands;
  }
}

// Singleton instance
const queue = new CommandQueue();

export default queue;
