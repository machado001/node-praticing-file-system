const { open, watch } = require("fs/promises");
const {
  CREATE_FILE,
  DELETE_FILE,
  ADD_TO_FILE,
  RENAME_FILE,
} = require("./actions");
const {
  createFile,
  deleteFile,
  renameFile,
  addToFile,
} = require("./commands.js");

(async () => {
  const commandFileHandler = await open("./command.txt");

  commandFileHandler.on("change", async () => {
    //commands

    const size = (await commandFileHandler.stat()).size; //size of our file
    const options = {
      buffer: Buffer.alloc(size), //allocate our buffer  with the size of the file
      offset: 0, //location what we want to start to filling our buffer
      get length() {
        //how many bytes we will read
        return this.buffer.byteLength;
      },
      position: 0, //position we want to start to read the file
    };
    await commandFileHandler.read(options);
    const command = options.buffer.toString("utf-8");

    const filePath = (action, end) =>
      command.substring(action.length + 1, end).trim();
    if (command.includes(CREATE_FILE)) {
      const path = filePath(CREATE_FILE);
      createFile(path);
    }
    if (command.includes(DELETE_FILE)) {
      const path = filePath(DELETE_FILE);
      deleteFile(path);
    }
    if (command.includes(RENAME_FILE)) {
      const oldPath = filePath(RENAME_FILE, command.indexOf(" to "));
      const newPath = command
        .substring(command.indexOf(" to ") + " to ".length)
        .trim();
      console.log(`OLD PATH : ${oldPath} ---- NEW PATH: ${newPath}`);
      renameFile(oldPath, newPath);
    }
    if (command.includes(ADD_TO_FILE)) {
      const path = command.substring(
        command.indexOf(" to the file ") + " to the file ".length
      );
      console.log(`path: ${path}`);
      const content = command.substring(
        ADD_TO_FILE.length + 1,
        command.indexOf(" to the file")
      );
      console.log(`content: ${content}`);

      addToFile(path, ` ${content} `);
    }
  });

  const watcher = watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
