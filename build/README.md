# Building AriaTemplates

First of all, make sure you download and install [nodejs](http://nodejs.org/#download).
With nodejs comes [npm](http://npmjs.org/) which is AT's build orchestrator.

## Build the standard release

Just `cd` to the root of AT's repository and type `npm install`.

The release is then available in `build/releases/standard/target`.

One of the sub-steps of building the release is first to build the bootstrap, which you will find in `build/at-bootstrap`. This is what you may want to use as a starting point to build your own release.

## Run the tests

Simply `npm test` (*not implemented yet, we do have tests, but they can not yet be run from npm directly*).

## Bump AT's version

AT's current version is stored in the npm's configuration file: `package.json`. To update this version and generate the new release, type `npm version 1.2.3` and then `npm install`.

# Some background information

The build process of AT contains the following steps:

- validating the javascript syntax
- detecting global variables
- running unit tests
- extracting the API documentation
- minifying source files
- merging source files
- adding license header comments in every built file

## Validating files

*Syntax + globals ... TBD*

## Packaging files

Packaging files mainly means merging them together according to some configuration, but also processing them in any required way, including: minifying them, "compiling" them, adding license headers...

There are 2 natures of packages:

- boostrap: the minimal package from which release packages can be created. In AT, we need a certain number of files to be present in the browser, in the right order, so that other files can be loaded and interpreted afterwards. This list of files is something that the AT core development team only can maintain. The bootstrap is really just one file, being the concatenation of the base AT files (the Aria global object, the AT class loader, ...)
- releases: depending on her application's need, a developer may want to package AT in a way that it loads only what she needs, in an optimized way. Release packages are custom-built distributions of AT that base themselves on the AT bootstrap. Release packages are based on AT's multi-part file handling feature so what this means is that a release is just a number of custom-built package files and a urlMap so that the boostrap loader can load files from the right place.

The proposal to achieve this is to use the open source [packman](https://github.com/captainbrosset/packman) file processor.

packman is a general purpose file utility that reads a config file and accordingly iterates over source files, handing over the real processing to built-in or custom "visitors", and finally outputs packaged files to a target.

packman is a command line tool made with nodejs that takes in YAML configuration files.

### Project topology

The proposal is to introduce a `build` directory at the root of the AT repository to deal with everything related to build. In this case, it will contain the packman YAML configurations.

### Boostrap package

- The boostrap package config is `build/at-bootstrap.yaml`
- Launching the boostrap build with packman goes like `> packman -c build/at-boostrap.yaml`
- Running packman will produce a `build\at-boostrap` directory

Some custom visitors are used to package the bootstrap:

- `./build/visitors/copysource.js` : copies all the source files to the target dir. This is so that release packages can be made by using the target dir as a source dir. Indeed, the target dir will contain both the bootstrap js file and the rest of the source files.
- `./build/visitors/license.js` : adds the license header to the boostrap js file.
- `./build/visitors/separator.js` : separate each file with a `\n` to make the file a bit more readable.

One top of these, one built-in visitor is used: `uglify`.

### Release package

AT build contains one standard release package used to generate the distribution for all users who don't want to create their own release and are fine just using the standard one.

- The standard release package config is `build/releases/standard/config.yaml`
- Launching the boostrap build with packman goes like `> packman -c build/releases/standard/config.yaml`
- Running packman will produce a `build/releases/standard/target` directory

The release build introduces 3 new visitors:

- `./build/visitors/atmapreader.js`
- `./build/visitors/atmultipart.js`
- `./build/visitors/atmapwriter.js`

Why maps?? Because AT multipart files are downloaded by AT's DownloadMgr thanks to a `urlMap`. Without this map, AT wouldn't know in which multipart (packaged) file is class `a.b.C` located for instance.

Of course, it would be completely fine for someone to load packaged files in a page using `<script>` tags, as long as dependencies are in the right order. However, it is advised to use the multipart (and therefore map) mechanism because this way, dependencies are resolved automatically on the client.

This is why the proposal here is to have the `atmapreader/writer` visitors to read the map, package files accordingly, and then write the map correctly as a `urlMap` in the boostrap.

Here, the configuration file is `build/releases/standard/map.js` and you will see that `build/releases/standard/config.yaml` doesn't contain much information because this information is read from `map.js` and fed back to packman when needed by the `atmapreader` visitor.

## Extracing API doc

*TBD*

## Running unit tests

*TBD*