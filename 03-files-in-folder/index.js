const fs = require('fs/promises');
const path = require('path');

(async function () {
  try {
    const folderContent = await fs.readdir(
      path.join(__dirname, 'secret-folder'),
      {
        withFileTypes: true,
      }
    );

    const files = folderContent.filter((file) => file.isFile());

    for (let file of files) {
      const fileSize = await fs.stat(
        path.join(__dirname, 'secret-folder', file.name)
      );

      console.log(
        `${file.name} - ${path.extname(file.name).slice(1)} - ${
          fileSize.size
        } bytes `
      );
    }
  } catch (err) {
    console.error(err);
  }
})();
