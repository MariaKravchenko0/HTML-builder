const fs = require('fs');
const path = require('path');

(async function () {
  /* CREATE FOLDER */

  await fs.promises.rm(path.join(__dirname, 'project-dist'), {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });

  /* CREATE HTML */

  const components = await fs.promises.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true }
  );
  const template = fs.createReadStream(path.join(__dirname, 'template.html'));

  template.on('data', (chunk) => {
    let html = chunk.toString();

    components.forEach((component) => {
      if (component.isFile() && path.extname(component.name) === '.html') {
        const componentText = fs.createReadStream(
          path.join(__dirname, 'components', component.name)
        );

        componentText.on('data', (chunk) => {
          html = html.replace(`{{${component.name.slice(0, -5)}}}`, chunk);

          const htmlBundle = fs.createWriteStream(
            path.join(__dirname, 'project-dist', 'index.html')
          );

          htmlBundle.write(html);
        });
      }
    });
  });

  /* COPY STYLES */

  const stylesFiles = await fs.promises.readdir(
    path.join(__dirname, 'styles'),
    {
      withFileTypes: true,
    }
  );

  const stylesBundle = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css')
  );

  for (let file of stylesFiles) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const styles = fs.createReadStream(
        path.join(__dirname, 'styles', file.name)
      );
      styles.pipe(stylesBundle);
    }
  }

  /* COPY ASSETS */

  await fs.promises.rm(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });

  const assetsFolder = await fs.promises.readdir(
    path.join(__dirname, 'assets'),
    {
      withFileTypes: true,
    }
  );

  for (let file of assetsFolder) {
    if (file.isFile()) {
      await fs.promises.copyFile(
        path.join(__dirname, 'assets', file.name),
        path.join(__dirname, 'project-dist', 'assets', file.name)
      );
    } else {
      await fs.promises.mkdir(
        path.join(__dirname, 'project-dist', 'assets', file.name),
        {
          recursive: true,
        }
      );
      let files = await fs.promises.readdir(
        path.join(__dirname, 'assets', file.name),
        {
          withFileTypes: true,
        }
      );

      for (let item of files) {
        if (item.isFile()) {
          await fs.promises.copyFile(
            path.join(__dirname, 'assets', file.name, item.name),
            path.join(__dirname, 'project-dist', 'assets', file.name, item.name)
          );
        }
      }
    }
  }
})();
