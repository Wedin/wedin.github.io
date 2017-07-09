# wedin.github.io

This setup generates static files to the `dest/` folder and publish that subfolder to the master branch, in order to be used as a personal github page.

The `develop` branch contain the development code of the site. The `dest/` folder contains the production code of the site and is never updated directly, but only through the gulp tasks.

### Creating a new production build
To generate a production build and publish it to the github pages run

```
npm run deploy
```

### Local development
Run the `gulp` command to start browser sync for local development.

### Errors
In the case where the first deploy to the remote master branch returns an error with the message `hint: Updates were rejected because a pushed branch tip is behind its remote`.

* Set the `develop` branch as the default branch in the repository settings
* Checkout `develop` and delete the remote `master` branch by `git push origin :master`
* Recreate the master branch `git subtree push --prefix dest origin master`

