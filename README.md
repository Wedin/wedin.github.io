# wedin.github.io

This setup generates static files to the `dest/` folder and publish that subfolder to the master branch, in order to be used as a personal github page.

The `develop` branch contain the development code of the site. The `dest/` folder contains the production code of the site and is never updated directly, but only through the gulp tasks.

### Creating a new production build
To generate a production build and publish it to the github pages run:

```bash
npm run deploy
```

Running this command will generate a production build and publish everything within the destination-folder in this repository using the `push-dir`-package.

### Local development
Run the `gulp` command to start browser sync for local development.

