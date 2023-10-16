/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable @typescript-eslint/no-var-requires */
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');

const { version, name } = require('../package.json');

const docsLocation = path.join(process.cwd(), 'docs');
const location = path.join(docsLocation, name, version);
const styleFile = path.join(location, 'styles', 'jsdoc-default.css');

(() => {
  if (!fs.existsSync(location)) {
    throw new Error('Unable to find the location of the docs!');
  }

  if (!fs.existsSync(path.join(location, 'scripts', 'resources'))) {
    fs.mkdirSync(path.join(location, 'scripts', 'resources'));
  }

  const files = fs.readdirSync(location);
  files.forEach((file) => {
    if (!file?.endsWith('.html')) {
      return;
    }

    const filePath = path.join(location, file);
    const fileData = fs
      .readFileSync(filePath)
      .toString()
      .replace(/module:([a-zA-Z]+)\./gm, '')
      .replace(
        /<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/highlight\.js\/9\.7\.0\/highlight\.min\.js"><\/script>/gm,
        `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
`
      )
      .replace(/(<!-- start Mixpanel -->((.|\n)*)<!-- end Mixpanel -->)/gm, '')
      .replace(
        /<link href="https:\/\/www\.braintreepayments\.com\/images\/favicon-ccda0b14\.png" rel="icon" type="image\/png">/gm,
        ''
      );

    fs.writeFileSync(filePath, fileData);
  });

  fs.appendFileSync(
    styleFile,
    `
img {
  max-width: 100%;
}
  `
  );

  fse.copySync(location, docsLocation);
  fse.removeSync(path.join(docsLocation, name));
})();
