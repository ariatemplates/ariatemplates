# Aria Templates - JavaScript Framework

![Aria Templates logo](http://ariatemplates.com/images/logo-forum.png)


[Aria Templates](http://ariatemplates.com/) (aka AT) is an application framework written in JavaScript
for building rich and **large-scaled enterprise web applications**. It is being developed since 2009 by
[Amadeus](http://www.amadeus.com) for its professional products. It has been designed for web apps
that are used 8+ hours a day, and that need to display and process a **high amount of data** with a **minimum
of bandwidth consumption**.

### Travis build status

[![Build Status](https://secure.travis-ci.org/ariatemplates/ariatemplates.png?branch=master)](http://travis-ci.org/ariatemplates/ariatemplates)

More concretes
==============

Aria Templates is:

 - an MVC framework,
 - with its own templating engine,
 - with data binding,
 - widgets library,
 - and rich utilities library.

The MVC's terminology in AT:

 - model -> JSON-based **data model** stored in DOM nodes corresponding to templates
 - view -> **template (`.tpl` file)**
 - controller -> **module controllers** and **template scripts** (`.js` files)

Templates are evaluated client-side, but can be also precompiled at build time of your application.

See [TodoMVC example done in Aria Templates](http://addyosmani.github.io/todomvc/labs/architecture-examples/ariatemplates/) and a [step-by-step guide](http://ariatemplates.com/guides/todo/) to it.

Want to see some code of the templates? Have a look at [list of samples](http://ariatemplates.com/samples).

Read more in [About](http://ariatemplates.com/about/) and [FAQ](http://ariatemplates.com/faq/).

Getting started
===============

To get started with Aria Templates, you have several options:

- you can clone our Git repository / download a ZIP from GitHub and then include `bootstrap.js` file
in your HTML page, to run the original, development source code,
- after obtaining our source code, you may run Grunt build and then include a packaged, minified
(much faster) version of the framework in your page,
- or to use the framework in your NodeJS application, issue `npm install ariatemplates` in the command line,
then call `require('ariatemplates')` from your code to load the framework.

Head to README.md files in [src](src) and [build](build) folders to read more.

Play with it in the browser
===========================

Thanks to [Julian Descottes](https://github.com/juliandescottes), who created a jsFiddle-like [InstantAT](http://juliandescottes.github.io/instantat/) app, you can play with Aria Templates in your browser (requires a reasonably modern browser).

License
=======

[Apache License 2.0](https://github.com/ariatemplates/ariatemplates/blob/master/LICENSE)

Browser support
==============

 - Firefox latest & Firefox 3.6
 - Chrome latest
 - IE 10, 9, 8, 7
 - Safari 5.1

Dependencies
============

The framework itself doesn't have any external dependencies.

We use Grunt, JSHint, UglifyJS, attester and a couple of other tools for building and testing.

Documentation
=============

 - [User manual](http://ariatemplates.com/usermanual)
 - [API docs](http://ariatemplates.com/aria/guide/apps/apidocs/)
 - [Our blog](http://ariatemplates.com/blog/)

Releases & backward compatibility
========

We release a new minor version (1.3.5, 1.3.6, ...) **every 3 weeks**, containing new features and bugfixes. Each version is thoroughly tested before the release. These releases are **backward compatible**. Occasionally we also backport important fixes to some of the older releases (1.3.1A, 1.3.1B etc.) - see [tags](https://github.com/ariatemplates/ariatemplates/tags).

Every 6-9 releases (i.e. **twice or three times a year**), we issue a **non-backward-compatible release**, bump the the second digit (e.g. 1.3.x -> 1.4.1) and provide migration guide. 

Before removal, items are **marked as deprecated for at least 9 weeks** (usually much more). We inform about deprecation in the docs, release notes and by flooding your console -- you won't overlook it.

Tools
=====

If you use **Notepad++** or **Sublime**, you may benefit from [**syntax highlighers** for Aria Templates](https://github.com/ariatemplates/editors-tools). Feel invited to contribute highlighters for editor of your choice, or other useful tools.

Support & contributing
======================

Visit our **[forum](http://ariatemplates.com/forum/)** to ask questions. If you spotted some problems, please open [an issue](https://github.com/ariatemplates/ariatemplates/issues?state=open) or ideally, a pull request with the fix and a test. See more in [CONTRIBUTING.md](CONTRIBUTING.md) and [TDD guide for Aria Templates](http://ariatemplates.github.io/Test-Driven-Development/).
