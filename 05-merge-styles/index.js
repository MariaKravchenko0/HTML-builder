const fs = require('fs');
const path = require('path');

(async function () {
  const sourceFolder = await fs.promises.readdir(
    path.join(__dirname, 'styles'),
    {
      withFileTypes: true,
    }
  );

  const files = sourceFolder.filter((file) => file.isFile());
  const cssFiles = files.filter((file) => path.extname(file.name) === '.css');

  const bundle = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css')
  );

  for (let file of cssFiles) {
    const styles = fs.createReadStream(
      path.join(__dirname, 'styles', file.name)
    );
    styles.pipe(bundle);
  }
})();
