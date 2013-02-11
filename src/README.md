This is the source code. You can use it locally to experiment with AT.

## How to experiment

If you want to try AT,

- clone this repository or [download](http://ariatemplates.com/download) the development version
- or [download](http://ariatemplates.com/download) the production version

### Production Version

This is a pre-packaged version of AT where files are minified and grouped together in bundles.
To get started, copy the `aria` folder to the root of your web server and include both the framework bootstrap and the skin in your HTML page:

    <script type="text/javascript" src="/aria/ariatemplates-1.2.0.js"></script>
    <script type="text/javascript" src="/aria/css/atskin-1.2.0.js"></script>

### Development Version

This is the development, un-minified, un-packaged version of the framework.
To get started, copy the `aria` folder to the root of your web server and include the bootstrap file in your HTML page:

    <script type="text/javascript" src="/aria/bootstrap.js"></script>

### Using AT from NodeJS

Issue `npm install ariatemplates` to grab the latest stable version from npm.
Then use `require('ariatemplates')` to load the framework. This will create two global variables,
`aria` and `Aria`. Some core functionalities will be preloaded, to use the others, you have to load them
using `Aria.load`. That function expects a JSON object with `classes` node (`Array`), and optionally
`oncomplete` and `onerror` callbacks.

Below is a simple REPL excerpt to get started with:

    $ npm install ariatemplates
    ...
    $ node
    > require('ariatemplates')
    > aria.utils.String.substitute('Hello %1', ['John'])
    'Hello John'
    > Aria.load({ classes : ["aria.utils.Math"] })
    > aria.utils.Math.normalize(711, 0, 500)
    500

### Learn more

Head over to our [Hello World guide](http://ariatemplates.com/guides/hello/) to learn more.
For any question, send us an email contact@ariatemplates.com
