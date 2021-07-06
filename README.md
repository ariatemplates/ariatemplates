# Aria Templates - JavaScript Framework

[![ci](https://github.com/ariatemplates/ariatemplates/actions/workflows/ci.yml/badge.svg)](https://github.com/ariatemplates/ariatemplates/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/ariatemplates/ariatemplates/branch/master/graph/badge.svg)](https://codecov.io/gh/ariatemplates/ariatemplates)
[![Dependencies](https://david-dm.org/ariatemplates/ariatemplates.svg?style=flat)](https://david-dm.org/ariatemplates/ariatemplates)
[![devDependencies](https://david-dm.org/ariatemplates/ariatemplates/dev-status.svg?style=flat)](https://david-dm.org/ariatemplates/ariatemplates#info=devDependencies)

[![npm](https://nodei.co/npm/ariatemplates.png?compact=true)](https://www.npmjs.com/package/ariatemplates)

![Aria Templates logo](http://ariatemplates.com/images/logo-forum.png)

[Aria Templates](http://ariatemplates.com/) (aka AT) is an application framework written in JavaScript for building rich and **large-scaled enterprise web applications**. Developed since 2009 by [Amadeus](http://www.amadeus.com) for its professional products, it has been designed to build web apps used intensively that need to display and process a **high amount of data** with a **minimum of bandwidth consumption**.

Some details
==============

Aria Templates in a nutshell:

 - MVC based framework
 - powerful templating engine
 - data binding and automatic refresh
 - widgets libraries
 - lots of utilities libraries

The MVC's terminology in AT:

 - model -> JSON-based **data model** stored in DOM nodes corresponding to templates
 - view -> **template (`.tpl` file)**
 - controller -> **module controllers** and **template scripts** (`.js` files)

Templates can either be evaluated client-side or precompiled at build time.

- See [TodoMVC example done in Aria Templates](http://todomvc.com/labs/architecture-examples/ariatemplates/) and a [step-by-step guide](http://ariatemplates.com/guides/todo/) for it.
- Want to see some code of the templates? Have a look at [list of samples](http://ariatemplates.com/samples).
- If you're developing for mobile, see [Aria Templates Mobile Kitchen Sink](http://ariatemplates.com/mobile/kitchensink/).

Read more in [About](http://ariatemplates.com/about/) and [FAQ](http://ariatemplates.com/faq/).

Getting started
===============

To get started with Aria Templates, you have several options:

- you can clone our Git repository / download a ZIP from GitHub and then include `bootstrap.js` file in your HTML page, to run the original, development source code,
- after obtaining our source code, you may run Grunt build and then include a packaged, minified (much faster) version of the framework in your page,
- or to use the framework in your NodeJS application, issue `npm install ariatemplates` in the command line, then call `require('ariatemplates')` from your code to load the framework.

Head to README.md files in [src](src) and [build](build) folders to read more.

Play with it in the browser
===========================

You can use jsFiddle-like [InstantAT](http://instant.ariatemplates.com/), where you can play with Aria Templates in your browser (requires a reasonably modern browser).

License
=======

[Apache License 2.0](https://github.com/ariatemplates/ariatemplates/blob/master/LICENSE)

Browser support
==============

 - Firefox latest, 11, 3.6
 - Chrome latest
 - IE 11, 10, 9, 8, 7
 - Safari 6

Dependencies
============

The framework itself doesn't have any external dependencies.

We use Grunt, JSHint, UglifyJS, attester and a couple of other tools for building and testing.

Documentation
=============

 - [User manual](http://ariatemplates.com/usermanual)
 - [API docs](http://ariatemplates.com/aria/guide/apps/apidocs/)
 - [Our blog](http://ariatemplates.com/blog/)

Tools & apps
============

Web apps & services:

- [InstantAT](http://instant.ariatemplates.com/) is the Aria Templates playground
- [AT CDN](http://cdn.ariatemplates.com/) is a CDN that serves any version of Aria Templates >= 1.4.2. Both minified and non-minified builds are served. You might use it for prototyping, but don't use it on production servers.

Syntax highlighters:

- [**Notepad++** syntax highligher for Aria Templates](https://github.com/ariatemplates/editors-tools)
- [**Sublime** syntax highlighter for Aria Templates](https://github.com/juliandescottes/sublime-ariatemplates-highlighter)
- We're [working](https://github.com/ariatemplates/editor-backend) [on](https://github.com/ariatemplates/editor-frontend-eclipse) a syntax highlighter & full blown editor plugin for **Eclipse**

Other tools:

- [Yeoman generator](https://github.com/ariatemplates/generator-ariatemplates) for AT project scaffolding
- [Snippets](https://github.com/ariatemplates/sublime-ariatemplates-snippets)
and [even more snippets](https://github.com/dpreussner/advanced-at-snippets-pack) for Sublime Text
- [Aria Templates aware JS Deminifier](https://github.com/jakub-g/atjsd) plugin for Firefox/Firebug

Feel invited to contribute highlighters for editor of your choice, or other useful tools!

Testing
======

- [Attester](https://github.com/attester/attester) is the tool we use for running Aria Templates tests. You may also use it for running tests of your project.
- [Aria Templates TDD guide](http://ariatemplates.github.io/Test-Driven-Development/) can help you writing tests for AT widgets and templates

Releases & backward compatibility
========

We release a new minor version (1.3.5, 1.3.6, ...) **every 3 weeks**, containing new features and bugfixes. Each version is thoroughly tested before the release. These releases are **backward compatible**. Occasionally we also backport important fixes to some of the older releases (1.3.1A, 1.3.1B etc.) - see [tags](https://github.com/ariatemplates/ariatemplates/tags).

Twice or three times a year, we issue a **non-backward-compatible release**, bump the the second digit (e.g. 1.3.x -> 1.4.1) and provide migration guide.

Before removal, items are **marked as deprecated for at least 9 weeks** (usually much more). We inform about deprecation in the docs, release notes and by flooding your console -- you won't overlook it.


Support & contributing
======================

Visit our **[forum](http://ariatemplates.com/forum/)** to ask questions.

If you spotted some **code problems** in the framework, please open [an AT issue](https://github.com/ariatemplates/ariatemplates/issues?state=open) or ideally, a pull request with the fix and a test.

If you spotted some issue with **missing / incorrect documentation** on ariatemplates.com, please open a [usermanual issue](https://github.com/ariatemplates/usermanual/issues?state=open).

See more in [CONTRIBUTING.md](CONTRIBUTING.md) and [TDD guide for Aria Templates](http://ariatemplates.github.io/Test-Driven-Development/).
