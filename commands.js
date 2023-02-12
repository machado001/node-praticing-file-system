const fs = require("fs/promises");

module.exports = {
  createFile: async (path) => {
    try {
      //we want to check whether or not we already have that file
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      //we already have the file
      return console.log(`The file ${path} already exists.`);
    } catch (e) {
      //we don't have the file, now we should create it
      const newFileHandle = await fs.open(path, "w");
      console.log("a new file was created!");
      newFileHandle.close();
    }
  },
  deleteFile: async (path) => {
    try {
      await fs.unlink(path);
      return console.log(`"file ${path} deleted!`);
    } catch (e) {
      return console.log(`file not exists:"${path}`);
    }
  },
  renameFile: async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log(`File ${oldPath} renamed to ${newPath} successfullly!`);
    } catch (e) {
      console.log(`the  old name already called ${oldPath} `);
      console.log(`the new name already called ${newPath} `);
    }
  },
  addToFile: async (path, content) => {
    try {
      const existingFileHandle = await fs.open(path, "a");
      await existingFileHandle.appendFile(content);
      await existingFileHandle.close();
    } catch (e) {
      console.log("error: " + e);
    }
  },
};
