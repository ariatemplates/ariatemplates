/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Aria = require("../Aria");
var ariaUtilsObject = require("../utils/Object");
var ariaUtilsString = require("../utils/String");


(function () {

    /**
     * Map of results. Key is the test name, value an object with the properties
     *
     * <pre>
     * *     name : Test name
     * *  runTime : time to run the test in ms
     * *  baseline : difference between the baseline and the test run time
     * *  emptyline : difference between the empty baseline and the test run time
     * </pre>
     *
     * @type Object
     */
    var results = {};

    /**
     * HTML Element displayng the test results
     * @type HTMLElement
     */
    var reportHolder = null;

    /**
     * HTML Element displayng log information on a given test
     * @type HTMLElement
     */
    var logHolder = null;

    /**
     * Identifier of the setInterval that keeps the reportHolder correctly positioned
     * @type String
     */
    var resizeInterval = -1;

    /**
     * Trigger a refresh of the style tags in the page
     * @param {Boolean} force If true forces a reload with empty text
     * @param {String} cssText If force is true, this is the only text added to the style tag "tpl" all the others will
     * be empty
     */
    var refreshCSS = function (force, cssText) {
        if (force !== true) {
            aria.templates.CSSMgr.__textToDOM(ariaUtilsObject.keys(aria.templates.CSSMgr.__styleTagPool));
        } else {
            // Having an empty text to dom go deeper in the CSSMgr to force a reload
            var styleBuilder = {};
            for (var id in aria.templates.CSSMgr.__styleTagPool) {
                if (aria.templates.CSSMgr.__styleTagPool.hasOwnProperty(id)) {
                    styleBuilder[id] = (id === "tpl" && cssText) ? [cssText] : [];
                }
            }
            aria.templates.CSSMgr.__reloadStyleTags(styleBuilder);
        }
    };

    /**
     * Prevent the CSSMgr to change the page while doing the loop.
     */
    var lock = function () {
        var scope = aria.ext.StressCss;
        scope.original__load = aria.templates.CSSMgr.__load;
        scope.original__unload = aria.templates.CSSMgr.__unload;
        aria.templates.CSSMgr.__load = function () {
            return [];
        };
        aria.templates.CSSMgr.__unload = function () {};
        // and force a refresh
        refreshCSS();
    };

    /**
     * Unlock the CSSMgr bringing it to its default state.
     */
    var unlock = function () {
        var scope = aria.ext.StressCss;
        aria.templates.CSSMgr.__load = scope.original__load;
        aria.templates.CSSMgr.__unload = scope.original__unload;
        refreshCSS();
    };

    /**
     * Extract the list of selectors from a text.
     * @param {String} text CSS source text
     * @param {String} location Classpath of the CSS template
     * @return {Array} List of CSS selectors in the text A selector is an object containing:
     *
     * <pre>
     * * name : selector
     * * location : template classpath
     * * descriptor : whole CSS rule
     * </pre>
     */
    var extractSelectors = function (text, location) {
        var match = null, selectors = [], trim = ariaUtilsString.trim;
        var reg = /[\s]*(([^{]+)\{[^}]+\})/g;
        while (match = reg.exec(text)) {
            selectors.push({
                name : location + ": " + trim(match[2]),
                descriptor : match[1],
                location : location
            });
        }

        return selectors;
    };

    /**
     * Get the list of CSS selectors in the page.
     * @return {Array} List of CSS selectors to test
     */
    var getAllSelectors = function (includeWidgetCSS) {
        // __textLoaded contains a copy of what is inside the DOM
        var cm = aria.templates.CSSMgr, all = cm.__textLoaded;
        var selectors = [];
        for (var path in all) {
            if (all.hasOwnProperty(path)) {
                if (includeWidgetCSS !== true && cm.__styleTagAssociation[path] === "wgt") {
                    continue;
                }
                selectors = selectors.concat(extractSelectors(all[path].text, path));
            }
        }

        return selectors;
    };

    /**
     * Remove a selector from the page.
     * @param {Object} selector CSS selector as returned by
     * @param {Boolean} incremental If true all selectors except "selector" are removed, otherwise only "selector" is
     * removed
     * @see extractSelectors
     */
    var removeSelector = function (selector, incremental) {
        if (!selector) {
            // This is a baseline
            if (incremental) {
                // Everything should be removed
                refreshCSS(true);
            } else {
                // Nothing should be removed
                return;
            }
        } else {
            var textLoaded = aria.templates.CSSMgr.__textLoaded[selector.location];
            // remember the original text
            selector.original = textLoaded.text;
            if (incremental) {
                // Keep only the selector
                refreshCSS(true, selector.descriptor);
            } else {
                // Remove the selector
                textLoaded.text = textLoaded.text.replace(selector.descriptor, "");
                refreshCSS();
            }
        }
    };

    /**
     * Add back a selector to the page.
     * @param {Object} selector CSS selector as returned by extractSelectors
     */
    var addSelector = function (selector, incremental) {
        if (!selector) {
            if (incremental) {
                // Everything was removed
                refreshCSS();
            } else {
                // Nothing was be removed
                return;
            }
        } else {
            // Simply put back the original style
            aria.templates.CSSMgr.__textLoaded[selector.location].text = selector.original;
            refreshCSS();
        }
    };

    /**
     * Run the next test.
     * @param {Object} test Current test object
     */
    var next = function (test) {
        if (test.callback) {
            test.callback.fn.apply(test.callback.scope, test.callback.args);
        }
    };

    /**
     * Complete the test execution. This function measures the run time
     * @param {Object} test Test object
     */
    var completeTest = function (test) {
        var end = +(new Date());

        test.runTime = end - test.start;

        results[test.name] = {
            name : test.name,
            runTime : test.runTime,
            baseline : results["__baseline__"] ? (results["__baseline__"].runTime - test.runTime) : NaN
        };

        addSelector(test.selector, test.cfg.incremental);

        // Yeld before calling the callback
        setTimeout(function () {
            next(test);
        }, 15);
    };

    /**
     * Generate a callback that could be safely passed to the action parameter of a test. This callback allows for
     * asynch test and is a security mechanism since the action function can be defined by the user. The callback calls
     * the next test iteration, after yelding
     * @param {Object} test Test object
     * @param {Object} scope Scope of the next iteration run
     */
    var generateTestCallback = function (test, scope) {
        // Run the next iteration
        return function () {
            setTimeout(function () {
                executeAction.call(scope, test);
            }, 0);
        };
    };

    /**
     * Execute a single iteration of the test.
     * @param {Object} test Test object
     */
    var executeAction = function (test) {
        if (test.iteration >= test.cfg.repeat) {
            return completeTest(test);
        }
        test.iteration += 1;

        test.cfg.action.call(null, test.name, test.iteration - 1, generateTestCallback(test, this));
    };

    /**
     * Used as second parameter of regular expression replace
     */
    function innerReplaceRule (a, l) {
        return l.toUpperCase();
    }

    /**
     * Apply style information to an HTML Object
     * @param {HTMLElement} elm DOM element
     * @param {Object} properties Map of key value properties to be added
     */
    var style = function (elm, properties) {
        for (var prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                try {
                    var name = prop.replace(/\-([a-z])/ig, innerReplaceRule);
                    var value = properties[prop];
                    elm.style[name] = (typeof value == 'number' && name != 'zIndex') ? (value + 'px') : value;
                } catch (ex) {}
            }
        }
    };

    /**
     * Close the report holder that displays information about the tests.
     */
    var closeReport = function () {
        if (reportHolder) {
            reportHolder.parentNode.removeChild(reportHolder);
            reportHolder = null;
            return false;
        }
    };

    /**
     * Create the report holder to display log information about the tests while running the stress test.
     */
    var createReport = function () {
        var document = Aria.$window.document;
        reportHolder = document.createElement('iframe');
        var block = document.createElement('iframe');
        reportHolder.scrolling = 'no';
        reportHolder.frameBorder = 'no';

        document.body.appendChild(reportHolder);
        reportHolder.doc = reportHolder.contentDocument || reportHolder.contentWindow.document;
        reportHolder.doc.write('<html><head></head><body></body></html>');
        reportHolder.doc.close();

        logHolder = reportHolder.doc.createElement('div');
        var close = reportHolder.doc.createElement('a');

        reportHolder.resize = function () {
            if (reportHolder) {
                var body = reportHolder.doc.body;
                style(reportHolder, {
                    width : body.scrollWidth,
                    height : body.scrollHeight
                });
            }
        };
        resizeInterval = setInterval(reportHolder.resize, 100);

        style(reportHolder, {
            position : 'fixed',
            top : 10,
            right : 10,
            zIndex : 10000,
            background : 'white',
            padding : 2,
            border : 'solid 2px #aaa',
            width : 250,
            height : 60,
            borderRadius : 4,
            boxShadow : '0 0 8px #eee'
        });
        style(reportHolder.doc.body, {
            'font' : '12px Helvetica,Arials,sans-serif',
            color : '#444'
        });
        style(logHolder, {
            whiteSpace : 'nowrap'
        });

        close.innerHTML = '&#215;';
        style(close, {
            position : 'absolute',
            top : 0,
            right : 0,
            textDecoration : 'none',
            fontWeight : 'bold',
            cursor : 'pointer',
            color : 'red',
            fontSize : '1.3em',
            lineHeight : 8
        });
        close.onclick = function () {
            close.onclick = null;
            clearInterval(resizeInterval);
            close = null;
            block.parentNode.removeChild(block);
            return closeReport();
        };

        style(block, {
            height : Aria.$window.screen.height * 2,
            width : Aria.$window.screen.width,
            position : 'absolute',
            top : 0,
            left : 0,
            visible : 'hidden',
            display : 'none',
            zIndex : 0
        });
        document.body.appendChild(block);

        reportHolder.doc.body.appendChild(close);
        reportHolder.doc.body.appendChild(logHolder);
    };

    /**
     * Log some test information in the report holder
     * @param {Object} test Test object
     */
    var log = function (test) {
        var baseline = !(test.selector && test.selector.name !== "*");
        if (!logHolder) {
            return; // logging was not enabled
        }

        var remaining = test.cfg.allSelectors.length;
        var heading = 'Testing <strong>' + (baseline ? test.name : test.selector.name) + '</strong>';
        var message = '<br />' + (baseline ? 'baseline' : test.selector.location);
        var footer = '<br />' + remaining + ' remaining test' + (remaining === 1 ? '' : 's');

        logHolder.innerHTML = heading + message + footer;
    };

    /**
     * Log the CSS stress test results in the report holder
     * @param {Boolean} incremental Type of test. If incremental we are interested in the selectors that make us waste
     * more, otherwise in the ones that make us gain more
     */
    var logResults = function (incremental) {
        if (!reportHolder || !results) {
            return; // logging was not enabled
        }

        var table = '<table><thead><tr><th>Selector</th><th> </th><th>ms</th><th>Total</th></tr></thead><tbody>';

        // Extract the 10 slowest results
        var resultsArray = [];
        for (var res in results) {
            if (results.hasOwnProperty(res) && res !== "__baseline__") {
                resultsArray.push(results[res]);
            }
        }
        var sorted = resultsArray.sort(function (a, b) {
            if (a.baseline === b.baseline) {
                return 0;
            }

            if (incremental) {
                return a.baseline > b.baseline ? 1 : -1;
            } else {
                return a.baseline > b.baseline ? -1 : 1;
            }
        }).slice(0, 20);

        for (var i = 0, len = sorted.length; i < len; i += 1) {
            var item = sorted[i];
            table += '<tr><td style="font:11px monospace">Removing <strong>'
                    + item.name
                    + '</strong></td><td style="text-align:right">'
                    + (item.baseline > 0
                            ? '<span style="color:green">saves</span>'
                            : '<span style="color:red">adds</span>')
                    + '</td><td style="text-align:right; font:11px monospace">' + Math.abs(item.baseline) + 'ms</td>'
                    + '<td style="text-align:right; font:11px monospace">' + item.runTime + 'ms</td></tr>\n';
        }

        table += '</tbody></table><hr/>';

        // Summary
        table += '<table><tr><td style="text-align:right; font:10px monospace">Selectors Tested:</td><td style="font:10px monospace">'
                + resultsArray.length
                + '</td></tr>'
                + '<tr><td style="text-align:right; font:10px monospace">Baseline Time:</td><td style="font:10px monospace">'
                + results["__baseline__"].runTime + 'ms</td></tr>';

        style(reportHolder, {
            width : 600
        });

        logHolder.innerHTML = table;
    };

    /**
     * Start a test
     * @param {Object} test Test object
     */
    var runTest = function (test) {
        test.iteration = 0;

        removeSelector(test.selector, test.cfg.incremental);
        log(test);

        test.start = +(new Date());
        executeAction(test);
    };

    /**
     * Run the tests on all selectors in the page, removing them one by one and comparing with the baselines
     * @param {Object} cfg User defined configuration parameters
     * @param {Object} callback Function to be executed after this measure.
     */
    var allTests = function (cfg, callback) {
        if (cfg.allSelectors.length > 0) {
            var selector = cfg.allSelectors.splice(0, 1)[0];
            var one = {
                name : selector.name,
                cfg : cfg,
                selector : selector,
                callback : {
                    fn : allTests,
                    scope : this,
                    args : [cfg, callback]
                }
            };

            runTest(one);
        } else {
            logResults(cfg.incremental);
            aria.ext.StressCss.__callback(callback);
        }
    };

    /**
     * Get the test results for the baseline containing all selectors.
     * @param {Object} cfg User defined configuration parameters
     * @param {Object} callback Function to be executed after this measure.
     */
    var getBaseline = function (cfg, callback) {
        results = {};

        // Generate a test targeting any CSS
        var all = {
            name : "__baseline__",
            cfg : cfg,
            selector : null,
            callback : {
                fn : allTests,
                scope : this,
                args : [cfg, callback]
            }
        };

        runTest(all);
    };

    /**
     * List of default values for the stress test
     * @type Object
     *
     * <pre>
     * * repeat : Number, how many times a test should be run
     * * silent : Boolean, true to disable logging inside the window
     * * widget : Boolean, test also CSS widgets
     * * action : Function, actual body of the test, it's the action that is executed 'repeat' times and measured
     * </pre>
     */
    var defaults = {
        repeat : 2,
        silent : false,
        widget : false,
        action : function (name, iteration, callback) {
            // Refresh of the root templates
            for (var i = 0, len = Aria.rootTemplates.length; i < len; i += 1) {
                Aria.rootTemplates[i].$refresh();
            }

            callback();
        },
        incremental : false
    };

    /**
     * Normalize the user defined configuration object. It will add default values from
     * @see defaults and generate the whole list of selectors to be tested.
     * @param {Object} cfg Configuration information
     * @return {Object} Normalized configuration object
     */
    var normalize = function (cfg) {
        cfg = cfg || {};

        for (var prop in defaults) {
            if (defaults.hasOwnProperty(prop) && !(prop in cfg)) {
                cfg[prop] = defaults[prop];
            }
        }

        cfg.allSelectors = getAllSelectors(cfg.widget);

        return cfg;
    };

    /**
     * Stress test the CSS added to the CSS Manager. This class executes and measures a given action removing all CSS in
     * the page one by one. It'll report the slowest running selectors. Default test action is a refresh of all root
     * templates. This action can be modified from the arguments of 'stressTest' method
     * @since 1.1-13
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.ext.StressCss",
        $singleton : true,
        $prototype : {
            /**
             * Stress test the page finding slow CSS rules.
             * @param {Object} cfg Configuration object
             *
             * <pre>
             * * action - test to be measured and executed. Default action is a refresh of the root templates
             * * repeat - number of test repetitions - Default 5
             * * silent - By default the test will display an info window. If silent TRUE, don't show it
             * * incremental - By default the test will remove one selector at a time. Setting this value to true the test will remove all selectors and measure the impact of only one selector
             * </pre>
             *
             * @param {Callback} callback Function called when all tests are done
             * @example
             * Action function has the following signature:
             *
             * action = function(testName, iteration, callback)
             *
             * Where
             * <pre>
             * * testName is the name of the current test
             * * iteration is the iteration number indicating how many times the action was executed
             * * callback is the function to be called when the action is done. This allows for asynchronous tests
             * </pre>
             */
            stressTest : function (cfg, callback) {
                lock();

                cfg = normalize(cfg);

                closeReport();
                if (!cfg.silent) {
                    createReport();
                }

                getBaseline(cfg, callback);
            },

            /**
             * Get the results from the previous stress test
             * @return {Object} results Map of results
             */
            getResults : function () {
                return results;
            },

            /**
             * Internal method to call an Aria Templates callback. This method is called at the end of a stress test. It
             * unlocks the CSS Manager
             * @private
             */
            __callback : function (callback) {
                unlock();
                this.$callback(callback);
            }
        }
    });
})();
