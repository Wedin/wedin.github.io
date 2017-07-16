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
Taking care of changes to remote master: (`hint: Updates were rejected because a pushed branch tip is behind its remote`.)

Do something along the lines of:
`git checkout develop`
`git subtree split --prefix dest -b temp`
`git checkout temp`
`git rebase master`
`git push origin temp:master`
`git branch -D temp`
