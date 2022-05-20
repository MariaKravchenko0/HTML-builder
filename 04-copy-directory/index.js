const fs = require('fs/promises');
const path = require('path');

(async function () {
  await fs.rm(path.join(__dirname, 'files-copy'), {
    recursive: true,
    force: true,
  });
  await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

  const sourceFolder = await fs.readdir(path.join(__dirname, 'files'), {
    withFileTypes: true,
  });
  const files = sourceFolder.filter((file) => file.isFile());

  for (let file of files) {
    await fs.copyFile(
      path.join(__dirname, 'files', file.name),
      path.join(__dirname, 'files-copy', file.name)
    );
  }
})();
