#Testing Aria Templates

Aria Templates comes with its own testing environment. This allows you to unit test any Aria Templates class, including Templates. There are a couple of different ways to run AT tests.

# Writing test cases

If you want to write a new test case, head to [AT Usermanual](http://ariatemplates.com/usermanual/latest/) and scroll to **Test Driven Development** section to learn about different APIs we expose to facilitate testing of:

- plain JavaScript methods
- widgets
- module controllers
- AT templates


# Running AT tests

Whatever method you choose, it's mandatory to first install the dev dependencies of the framework:

- Run `npm install`  in the root of the repo

## Classic Test Runner

Classic Test Runner is a web application that runs an AT tests suite when opened in the browser.

The only thing you have to do is

    npm start

This will perform a build and start an [express](http://expressjs.com/) HTTP server on port `8080`.

With any browser, go to `http://localhost:8080` and start testing.

If port `8080` is already in use you can change it running

    npm config set ariatemplates:port 9090
    npm start

The server will now be listening on port `9090`.

## Attester

[Attester](https://github.com/attester/attester) is a tool that makes it possible to run tests on many browsers in parallel (hence speeding up long test suites), and also supports headless testing with PhantomJS.

To run the AT test suite with Attester, you'll need to first do the following:

- [Download PhantomJS executable](http://phantomjs.org/download.html) for your platform
- extract it to your disk so that its visible in the `PATH` (i.e. `phantomjs --version` works in your terminal)

Then to actually run the test suite:

- `npm test`

By default, this will spawn 2 PhantomJS instances for testing. You may change it as follows:

- `npm config set ariatemplates:phantomjsInstances 8`

to take advantage of multiple CPUs on your machine.

Attester will output its log to the console.

## Running single test in-browser during development

If you just want to focus on running / debugging a single test file in a single browser during the development, you may just:

- run the AT build,
- configure a static web server,
- open `test/test.htm` file,
- pass it the classpath of the test case you want to run.

### Running the build

**It's important to note that it's needed to perform a build any time your source file changes** - the `test.htm` file uses prebuilt ("bootstrap build") files of AT. You may run the build as follows:

- `npm install -g grunt-cli` # only first time
- `grunt bootstrap`

However it might be boring to regularly do it manually - automation for the rescue!

You may open a new console window and launch a continuous watch task in the root of the repository:

- `npm run watch` (or `grunt watch`)

This will keep watching all files in `/src` folder and will run JSHint (over the changed file) and full AT bootstrap build every time a file changes.

### Setting up a server

To start an ad-hoc web server in your current working directory, you may use:

- if you have NodeJS:
  - `npm install -g http-server`
  - `http-server -p 8080`
- if you have Python 2:
  - `python -m SimpleHTTPServer 8080`
- if you have Python 3:
  - `python -m http.server 8080`

Then you can navigate to `http://localhost:8080/test/test.htm` to start a test.

Alternatively, if you have Apache HTTP server installed, you may set up an alias to permanently serve certain directory (say `G:\gh\at\`) under certain path (say `aria-templates-git`):

Add to `httpd.conf`:

    <Directory "G:\gh\at">
        AllowOverride None
        Options Indexes
        Order allow,deny
        Allow from all
    </Directory>

    Alias /aria-templates-git "G:\gh\at"

Then you can navigate to `http://localhost/aria-templates-git/test/test.htm` to start a test.

## Travis builds

To assure the quality of the framework, we leverage [Travis CI](https://travis-ci.org/ariatemplates/ariatemplates/builds) for continuous integration.

Whenever new code is pushed to the main repository of Aria Templates, or a pull request is opened, a build of the framework is performed in a fresh Linux virtual machine.

Whenever you open a pull request on GitHub, this process will be automatically started and you'll see the results of the build on the GitHub page within ~15 minutes. The Travis build is equivalent to running `npm install; npm test` on your local machine.

If the build has failed, the code must be fixed and the build restarted before the pull request can be integrated. When you fix the broken code, you may `git push -f` to the branch from which the pull request was initiated in order to update your pull request on GitHub and restart the build.
