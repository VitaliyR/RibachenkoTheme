# Ribachenko

My theme for own blog running on [Ghost](http://ghost.org)

## Build
```bash
npm install
```

It will run postinstall script:
```bash
gulp --production
```

## Scripts

* `firstinstall` - makes a links to helpers for Ghost

## Tasks

* `default` - builds everything. Pass `--production` for minifying and disabling sourcemaps
* `watch` - same job as default task and add files watcher. Useful while developing
* `clean` - removes assets folder
* `vendorCSS` - builds vendor css files
* `vendorJS` - builds vendor js files
* `CSS` - lints and builds css and fallback css for ie
* `JS` - lints and builds js and fallback js for ie
* `fallbackIcons` - loads all svg icons and creates a png version in black and white colors for ie
