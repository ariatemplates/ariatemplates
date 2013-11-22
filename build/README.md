# Building Aria Templates

First of all, make sure you download and install [Node.js](http://nodejs.org/#download).
With Node.js comes [npm](http://npmjs.org/) which is AT's build orchestrator.

Our build solution is powered by [Grunt](http://gruntjs.com/). See `grunt.js` file in the main
folder of our repo.

## Build the standard release

Just `cd` to the root of AT's repository and type `npm run-script grunt`.

The releases are then available in subfolders of `build/target`.

One of the sub-steps of building the release is first to build the bootstrap, which you will find in
`build/os-bootstrap`. This is what you may want to use as a starting point to build your own release.

The production-ready release is placed in `build/os-production`.

## Running unit tests

Execute `npm run-script attester`. This launches our test suite using `attester`, which runs PhantomJS (headless
Webkit) under the hood to perform JavaScript tests.

See more: [https://github.com/ariatemplates/attester](attester).

## JSHint

Execute `npm run-script lint`.

To have lint, then unit tests, then build executed all-at-once, you can use the shortcut `npm test`
(this is due to constraints of [Travis CI](http://about.travis-ci.org/docs/user/languages/javascript-with-nodejs/),
which we use for continuous integration builds, which makes only `npm install` and `npm test`
commands available for execution, and we didn't want to perform build for people using
Aria Templates via `npm install ariatemplates`).

## Bump AT's version

AT's current version is stored in the npm's configuration file: `package.json`. To update
this version and generate the new release, type `npm version 1.2.3` and then `npm install`.

# Some background information

The build process of AT consists of numerous steps:

- verifying file names (to catch uppercased file extensions)
- validating the JavaScript syntax (using JSHint)
- minifying source files
- merging source files into packages
- verifying packages (each source file has to go into some package)
- md5-ing packages (appending MD5 hash to file names to make use of browser caching)
- adding license header comments in every built file
- normalizing skin file (adding default values etc.)
- running unit tests
- extracting the API documentation **(TBD)**

## Packaging files

Packaging files mainly means merging them together according to some configuration, but also processing them in any required way, including: minifying them, "compiling" them, adding license headers...

There are 2 natures of packages:

- **boostrap:** the minimal package from which release packages can be created.
In AT, we need a certain number of files to be present in the browser, in the right order,
so that other files can be loaded and interpreted afterwards.

- **releases:** depending on her application's need, a developer may want to package AT in a way
that it loads only what she needs, in an optimized way. Release builds are based on bootstrap build.

### Boostrap package

- The boostrap release config is `build/build-os-bootstrap.js`
- Launching the boostrap build with Grunt goes like `> grunt releaseOsBootstrap`
- Running Grunt will produce a `build/target/os-bootstrap` directory

The most important thing this build does is to create a bootstrap file named `ariatemplates-x.y.z.js`
(x.y.z being the framework version) consisting of the crucial files necessary for proper functioning
of the framework. This file can be then loaded on your page and you'll be able to play with the
framework. The other files are copied nearly untouched to the target directory, and they'll be
lazily loaded in the browser only at the time they're needed.

### Release package

AT build contains one standard release package used to generate the distribution for all users
who don't want to create their own release and are fine just using the standard one.

- The production release config is `build/build-os-prod.js`
- Launching the production build with Grunt goes like `> grunt releaseOsProd`
- Running Grunt will produce a `build/target/os-production` directory

The release build introduces various additional tasks:
- `packager` creates logical packages (aka "multipart files") from sets of files commonly used together
- the output is minified using UglifyJS
- `atmapreader` and `atmapwriter` take care of adding URL map to the bootstrap file.

**What and what for are the maps?**

AT multipart files are downloaded by AT's `DownloadMgr` thanks to a `urlMap`. Without this map,
AT wouldn't know in which package a specific class `a.b.C` was located.

Of course, it would be completely fine for someone to load packaged files in a page using
`<script>` tags, as long as dependencies are in the right order. However, it is advised to use
the multipart (and therefore map) mechanism because this way, dependencies are resolved
automatically on the client side.

Here, the configuration file is `build/config/urlmap.json`.

**TODO**: more documentation on packaging, URL map, DownloadMgr.

## Extracting API doc

*TBD*
