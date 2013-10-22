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

var getClasspath = function (classpathOrCstr) {
    return classpathOrCstr.classDefinition ? classpathOrCstr.classDefinition.$classpath : classpathOrCstr;
};

/**
 * CSS Manager manages the insertion of CSS Template output in the page. It is responsible for prefixing the CSS
 * selectors according to the containing Template, adding the style tags in the page.
 */
Aria.classDefinition({
    $classpath : "aria.templates.CSSMgr",
    $singleton : true,
    $dependencies : ["aria.templates.CSSCtxtManager", "aria.utils.Array", "aria.utils.Object", "aria.utils.AriaWindow"],
    $statics : {
        /**
         * The prefix is build adding a unique increasing number to the prefixing string
         * @type Number
         * @private
         */
        __NEXT_PREFIX_INDEX : 0,

        /**
         * Prefix used for scoping CSS selectors. This value is used to build the CSS class selector. The actual prefix
         * in the CSS file is build concatenating a dot ".", this value and __NEXT_PREFIX_INDEX
         * @type String
         * @private
         */
        __PREFIX : "CSS",

        /**
         * The pool's tag index is build with an increasing number
         * @type Number
         * @private
         */
        __NEXT_TAG_INDEX : 1,

        /**
         * Prefix used for the style tag id in the DOM
         * @type String
         * @private
         */
        __TAG_PREFX : "xCss",

        // ERROR MESSAGE:
        CSSTEMPLATE_MAX_SELECTORS_REACHED : "More than 4000 CSS selectors are loaded at the same time. Please check your CSS Templates",
        DEPRECATED_METHOD : "%1 is deprecated."
    },
    $events : {
        "dependenciesLoaded" : {
            description : "All the CSS Templates depencies for a given Template are loaded",
            properties : {
                templateClasspath : "{String} classpath of the template for which the dependencies are loaded"
            }
        },
        "dependenciesUnloaded" : {
            description : "All the CSS Templates depencies for a given Template are unloaded",
            properties : {
                templateClasspath : "{String} classpath of the template for which the dependencies are unloaded"
            }
        },
        "styleChange" : {
            description : "The content of the style tag has changed",
            properties : {
                templateClasspath : "{String} classpath of the template that caused the style tag to change"
            }
        }
    },
    $constructor : function () {
        /**
         * Keep track of the number of classpath that are using a certain CSS template class. A CSS template can be
         * removed only when no other templates in the page depend on it.
         * @type Object
         *
         * <pre>
         * {cssClassPath : [classPath, ...] }
         * </pre>
         *
         * @private
         */
        this.__cssUsage = {};

        /**
         * Keep track of the number of classpath that are using a certain CSS template class in the application. It is
         * used to manage when css can be invalidated.
         * @type Object
         *
         * <pre>
         * {cssClassPath : [classPath, ...] }
         * </pre>
         *
         * @private
         */
        this.__globalUsage = {};

        /**
         * Each CSS template class has it's own unique prefix, store the association between the CSS template class and
         * the prefix. The prefix is a CSS class
         * @type Object
         *
         * <pre>
         * {
         *     cssClassPath : prefix
         * }
         * </pre>
         *
         * @private
         */
        this.__prefixes = {};

        /**
         * List of prefixes loaded in the page. It's a list of classpaths. The values are not unique, a classpath might
         * be here twice if it was loaded twice, this to remember how many times a classpath was loaded.
         * @type Array
         * @private
         */
        this.__pathsLoaded = [];

        /**
         * Keep a map of the text loaded into the DOM for each CSS template.
         * @type Object
         *
         * <pre>
         * {cssClassPath : {text: CSS file, lines: Number of selectors}}
         * </pre>
         *
         * @private
         */
        this.__textLoaded = {};

        /**
         * Since we are using a pool of style tags, keep track of where each css classpath is loaded
         * @type Object
         *
         * <pre>
         * {classPath : Id of the style tag}
         * </pre>
         *
         * @private
         */
        this.__styleTagAssociation = {};

        /**
         * Style tags that will store the style text generated by the Manager
         * @type Object Map a tag id to an HTMLElement
         * @private
         */
        this.__styleTagPool = {};

        /**
         * Map of dependencies loaded by classpath
         * @type Object Map a classpath to an Array of css
         * @private
         */
        this.__cssDependencies = {};

        /**
         * Map of classpaths that are marked as invalid. These classes force us to reload the style tag even if some
         * other classes depends on them.
         * @type Object Map of classpaths
         * @private
         */
        this.__invalidClasspaths = {};

        /**
         * List of classpaths that are marked as invalid and needs to be reloaded.
         * @type Array Array of classpaths
         * @private
         */
        this.__invalidStack = [];

        /**
         * Internal state of the Manager. When stopped any new CSS Template won't trigger a style tag update
         * @type Boolean
         * @private
         */
        this.__isStopped = false;

        /**
         * List of style tags that must be refreshed when the Manager leaves the "STOP" mode.
         * @type Array List of style tag that should be refreshed, same as
         * @see __textToDom
         * @private
         */
        this.__queuedChanges = [];

        /**
         * Whether we started to store things related to a window.
         */
        this.__attachedToWindow = false;

        aria.utils.AriaWindow.$on({
            "unloadWindow" : this.reset,
            scope : this
        });
    },
    $destructor : function () {
        this.reset();
        this.__styleTagPool = null;
        aria.utils.AriaWindow.$unregisterListeners(this);
    },
    $prototype : {

        /**
         * Call attachWindow from aria.utils.AriaWindow in case it was not called yet. This method should be called
         * before storing any state related to a window object.
         */
        __checkAttachedToWindow : function () {
            if (!this.__attachedToWindow) {
                this.__attachedToWindow = true;
                aria.utils.AriaWindow.attachWindow();
            }
        },

        /**
         * Load the CSS dependencies of a template, it will prefix the CSS selectors and generate a style tag in the
         * head.
         * @param {aria.templates.TemplateCtxt} tplCtxt template context
         * @return {Array} Array of class prefixes
         */
        loadDependencies : function (tplCtxt) {
            this.$assert(133, tplCtxt.$TemplateCtxt);

            var toLoad = tplCtxt.getCSSDependencies();
            var tplClasspath = tplCtxt.tplClasspath;
            var loadResult = this.loadClassPathDependencies(tplClasspath, toLoad, {
                isTemplate : true
            });

            if (loadResult.changes) {
                this.$raiseEvent({
                    name : "styleChange",
                    templateClasspath : tplClasspath
                });
            }

            this.$raiseEvent({
                name : "dependenciesLoaded",
                templateClasspath : tplClasspath
            });

            return loadResult.classes;
        },

        /**
         * Load the CSS dependencies of a Widget. It won't prefix the CSS selectors
         * @param {String} classpath Classpath of the widget
         * @param {Array} dependencies Array of CSS template classpaths to be loaded
         */
        loadWidgetDependencies : function (classpath, dependencies) {
            if (this.__cssDependencies[classpath]) {
                dependencies = this.__cssDependencies[classpath];
            } else {

                // Look at in the parents for the css inheritance.
                var tpl = Aria.getClassRef(classpath);
                var css = {};
                if (dependencies) {
                    for (var i = 0, ii = dependencies.length; i < ii; i++) {
                        css[getClasspath(dependencies[i])] = true;
                    }
                }

                tpl = tpl.superclass;
                while (tpl) {
                    var $css = tpl.$css;
                    if ($css) {
                        for (var i = 0, ii = $css.length; i < ii; i++) {
                            css[getClasspath($css[i])] = true;
                        }
                    }
                    tpl = tpl.constructor.superclass;
                }

                dependencies = aria.utils.Object.keys(css);

                // Store the css dependencies for performance reason
                this.__cssDependencies[classpath] = dependencies;
            }

            var contextArgs = {
                isWidget : true
            };

            this.loadClassPathDependencies(classpath, dependencies, contextArgs);
        },

        /**
         * Load the CSS dependencies of any classpath. It does prefixing depending on the contextArgs passed
         * @param {String} classpath Classpath on which the CSS templates depends on
         * @param {Array} dependencies Array of CSS template dependencies
         * @param {Object} contextArgs Optional parameters to be passed to CSSCtxt.initTemplate
         * @return {Object}
         *
         * <pre>
         * {
         *    classes : Array of prefixes added for CSS scoping,
         *    changes : Boolean, true if changes has been made to the DOM
         * }
         * </pre>
         */
        loadClassPathDependencies : function (classpath, dependencies, contextArgs) {
            if (!dependencies) {
                return;
            }

            var changes = [];
            var classes = [];
            for (var i = 0, len = dependencies.length; i < len; i += 1) {
                var cssClasspath = getClasspath(dependencies[i]);
                // this object will be used for configuration and changed,
                // as this is a loop on dependencies, make a copy - PTR 04543463
                var localContextArgs = {};
                for (var key in contextArgs) {
                    if (contextArgs.hasOwnProperty(key)) {
                        localContextArgs[key] = contextArgs[key];
                    }
                }
                changes = this.__load(classpath, cssClasspath, localContextArgs).concat(changes);

                if (this.__prefixes[cssClasspath]) {
                    // The prefix is created by __load if needed
                    classes.push(this.__prefixes[cssClasspath]);
                }
            }

            if (changes.length) {
                this.__textToDOM(changes);
            }

            return {
                classes : classes,
                changes : !!changes.length
            };
        },

        /**
         * Mark a CSS template dependency as "to be loaded". If it's already loaded this will simply register a new
         * dependency, otherwise it will buffer the changes that should be applied to the style tag or the pool of
         * styles
         * @param {String} tplClasspath Template classpath
         * @param {String} cssClasspath CSS template classpath
         * @return {Array} An array of tag pool's id that require a refresh
         * @private
         */
        __load : function (tplClasspath, cssClasspath, contextArgs) {
            this.$assert(195, tplClasspath && cssClasspath);

            // Do something only if this CSS class is not yet loaded
            var usage = this.__cssUsage[cssClasspath];
            if (usage && usage.length) {
                usage.push(tplClasspath);
                this.__pathsLoaded.push(cssClasspath);
                if (!this.__invalidClasspaths[cssClasspath]) {
                    return [];
                }
            } else {
                this.__cssUsage[cssClasspath] = [tplClasspath];
            }

            // Starting from here, nobody is using this css, it should also be added to the DOM

            // classpath may be invalid but not currently used
            delete this.__invalidClasspaths[cssClasspath];

            var cssCtxt = aria.templates.CSSCtxtManager.getContext(cssClasspath, contextArgs);
            // Give a prefix to the Global file in order to have higher priority
            if (cssClasspath == "aria.templates.GlobalStyle" || cssClasspath == "aria.templates.LegacyGeneralStyle"
                    || cssClasspath == "aria.widgets.GlobalStyle") {
                this.__getPrefix(cssClasspath);
            }
            if (cssCtxt.doPrefixing()) {
                var prefixClass = this.__getPrefix(cssClasspath);
                cssCtxt.prefixText(prefixClass);
            }

            // Remember the text to be loaded
            this.__textLoaded[cssClasspath] = {
                text : cssCtxt.getText(),
                lines : cssCtxt.getNumLines()
            };

            // Build the association between this classpath and a style tag
            var styleTag = this.__getStyleTag(cssCtxt);
            this.__styleTagAssociation[cssClasspath] = styleTag;

            this.__pathsLoaded.push(cssClasspath);
            return [styleTag];
        },

        /**
         * Get the style tag id for a CSS classpath
         * @param {aria.templates.CSSCtxt} cssCtxt CSS Template Context
         */
        __getStyleTag : function (cssCtxt) {
            var classpath = cssCtxt.tplClasspath;
            var associatedTo = this.__styleTagAssociation[classpath];

            if (associatedTo) {
                return associatedTo;
            }

            if (cssCtxt.isTemplate()) {
                associatedTo = "tpl";
            } else if (cssCtxt.isWidget()) {
                associatedTo = "wgt";
            } else {
                associatedTo = "pool" + this.__NEXT_TAG_INDEX;
                this.__NEXT_TAG_INDEX += 1;
            }

            return associatedTo;
        },

        /**
         * Unload the CSS dependencies of a widget. This method will unload any dependency on the parent widgets.
         * @param {String} classpath Classpath of the widget
         * @param {Array} dependencies Array of CSS template classpaths to be loaded
         */
        unloadWidgetDependencies : function (classpath, dependencies) {
            if (this.__cssDependencies[classpath]) {
                dependencies = this.__cssDependencies[classpath];
            }

            this.unloadClassPathDependencies(classpath, dependencies);
        },

        /**
         * Unload the CSS dependencies of any classpath. This method is not observable through events. This function
         * does not trigger a DOM update. CSS style elements are only removed if not needed during the next CSS
         * insertion.
         * @param {String} classpath Classpath on which the CSS templates depends on
         * @param {Array} dependencies Array of CSS templates to be removed
         */
        unloadClassPathDependencies : function (classpath, dependencies) {
            if (!dependencies) {
                return;
            }

            for (var i = 0, len = dependencies.length; i < len; i += 1) {
                var cssClasspath = dependencies[i];
                this.__unload(classpath, cssClasspath);
            }
        },

        /**
         * Unload all the CSS dependencies of a template. This function does not trigger a DOM update. CSS style
         * elements are only removed if not needed during the next CSS insertion.
         * @param {aria.templates.TemplateCtxt} tplCtxt template context
         */
        unloadDependencies : function (tplCtxt) {
            this.$assert(169, tplCtxt.$TemplateCtxt);

            var unload = tplCtxt.getCSSDependencies();
            var tplClasspath = tplCtxt.tplClasspath;

            this.unloadClassPathDependencies(tplClasspath, unload);

            this.$raiseEvent({
                name : "dependenciesUnloaded",
                templateClasspath : tplClasspath
            });
        },

        /**
         * Get the prefix for a CSS template.
         * @param {String} cssClasspath CSS template classpath
         * @return {String) class used as a prefix
         * @private
         */
        __getPrefix : function (cssClasspath) {
            var prefixClass = this.__prefixes[cssClasspath];
            if (!prefixClass) {
                prefixClass = this.__PREFIX + this.__NEXT_PREFIX_INDEX;
                this.__NEXT_PREFIX_INDEX += 1;

                this.__prefixes[cssClasspath] = prefixClass;
            }

            return prefixClass;
        },

        /**
         * Update the private properties to mark a CSS template as unloaded. It won't update the list of prefixes
         * @param {String} tplClasspath Template classpath
         * @param {String} cssClasspath CSS template classpath
         * @private
         */
        __unload : function (tplClasspath, cssClasspath) {
            this.$assert(230, tplClasspath && cssClasspath);
            var removeUtil = aria.utils.Array.remove;

            // There should be someone using this css
            var usage = this.__cssUsage[cssClasspath];
            if (usage && usage.length) {
                removeUtil(usage, tplClasspath);
                removeUtil(this.__pathsLoaded, cssClasspath);

                if (!usage.length) {
                    // No other templates depend on this class
                    delete this.__cssUsage[cssClasspath];
                    delete this.__textLoaded[cssClasspath];
                    // keep the prefix in case the css comes back
                }
            } // else should never be reached
        },

        /**
         * Generate a text string (the content of the style tag) from the loaded texts. It logs a warning if we are
         * close to the limit of selectors allowed.
         * @param {Array} List of style tag that should be refreshed
         * @return {String} The generated text
         * @private
         */
        __textToDOM : function (changes) {
            if (this.__isStopped) {
                this.__queuedChanges = changes.concat(this.__queuedChanges);
                return;
            }

            var sorted = this.__sortPaths();
            // var loaded = this.__textLoaded;
            var totalSelectors = 0;
            var styleBuilders = {};
            var utilsArray = aria.utils.Array;

            for (var i = 0, len = sorted.length; i < len; i += 1) {
                var cssPath = sorted[i];
                var styleTagId = this.__styleTagAssociation[cssPath];

                if (!utilsArray.contains(changes, styleTagId)) {
                    // This tag shouldn't be updated
                    continue;
                } else if (!styleBuilders[styleTagId]) {
                    styleBuilders[styleTagId] = [];
                }

                styleBuilders[styleTagId].push("/**", cssPath, "**/", this.__textLoaded[cssPath].text);

                totalSelectors += this.__textLoaded[cssPath].lines || 0;
            }

            // IE only allows 4096 selectors, warn the user on any browser
            if (totalSelectors > 4000) {
                this.$logWarn(this.CSSTEMPLATE_MAX_SELECTORS_REACHED);
            }

            return this.__reloadStyleTags(styleBuilders);
            // returning something is important for unit tests
        },

        /**
         * CSS Templates are added as they are generated, however after the first refresh this order might get lost.
         * This function sorts the CSS ClassPaths according to the insertion order. TODO: A better implementation could
         * sort them according to the template hierarchy, but it might be too complex to implement.
         * @return {Array} A sorted list of CSS classPaths
         * @private
         */
        __sortPaths : function () {
            // Sorting is done by CSS prefix, we assume that the insertion order will be respected
            var array = aria.utils.Object.keys(this.__textLoaded);
            // closures for the sorting function
            var prefixes = this.__prefixes;
            var prefixLength = this.__PREFIX.length;

            var comparator = function (first, second) {
                // These are classpaths, convert to indexes
                var firstIndex = prefixes[first]
                        ? parseInt(prefixes[first].substring(prefixLength), 10)
                        : Number.MAX_VALUE;
                var secondIndex = prefixes[second]
                        ? parseInt(prefixes[second].substring(prefixLength), 10)
                        : Number.MAX_VALUE;

                if (firstIndex === secondIndex) {
                    return 0;
                }
                return firstIndex > secondIndex ? 1 : -1;
            };

            var sorted = array.sort(comparator);
            prefixes = null;
            prefixLength = null;
            return sorted;
        },

        /**
         * This is the only function that has access to the DOM. It generates the style tag if missing and keeps a
         * pointer to it to update the content of the tag when needed.
         * @param {Object}
         *
         * <pre>
         * {
         *   styleTagId : Array of text tokens for that style tag
         * }
         * </pre>
         *
         * @private
         */
        __reloadStyleTags : function (styleBuilders) {
            // PROFILING // var profilingId = this.$startMeasure("Inserting style in DOM");
            for (var tagName in styleBuilders) {
                if (!styleBuilders.hasOwnProperty(tagName)) {
                    continue;
                }

                var tag = this.__buildStyleIfMissing(tagName);
                var text = styleBuilders[tagName].join("\n");

                if (tag.styleSheet) {
                    // IE wants to use the text
                    if (tag.styleSheet.cssText != text) {
                        tag.styleSheet.cssText = text;
                    }
                } else {
                    // All the other should add a text node
                    var definition;
                    if (tag.firstChild) {
                        if (tag.firstChild.nodeValue != text) {
                            definition = Aria.$window.document.createTextNode(text);
                            tag.replaceChild(definition, tag.firstChild);
                        }
                    } else {
                        definition = Aria.$window.document.createTextNode(text);
                        tag.appendChild(definition);
                    }
                }
                tag = null;
            }
            // PROFILING // this.$stopMeasure(profilingId);
        },

        /**
         * Get the HTMLElement associated to a tag id. If it is missing it will be added to the DOM
         * @param {String} tagName Id of the tag
         * @return {HTMLElement} style tag
         * @private
         */
        __buildStyleIfMissing : function (tagName) {
            // A pointer to the style might be already there
            var tag = this.__styleTagPool[tagName];

            if (!tag) {
                // If missing, create one
                var document = Aria.$window.document;
                var head = document.getElementsByTagName("head")[0];
                tag = document.createElement("style");

                tag.id = this.__TAG_PREFX + tagName;
                tag.type = "text/css";
                tag.media = "all"; // needed as the default media is screen in FF but all in IE

                head.appendChild(tag);
                tag = head.lastChild;

                this.__styleTagPool[tagName] = tag;
            }

            return tag;
        },

        /**
         * Reset the singleton to it's initial state after creation.
         */
        reset : function () {
            // Remove the style tags from the DOM
            for (var tagName in this.__styleTagPool) {
                if (this.__styleTagPool.hasOwnProperty(tagName)) {
                    this.__styleTagPool[tagName].parentNode.removeChild(this.__styleTagPool[tagName]);
                }
            }
            if (this.__attachedToWindow) {
                aria.utils.AriaWindow.detachWindow();
                this.__attachedToWindow = false;
            }
            this.__styleTagPool = {};

            // Reset the variables
            this.__textLoaded = {};
            this.__pathsLoaded = [];
            this.__prefixes = {};
            this.__cssUsage = {};
            this.__styleTagAssociation = {};
            this.__invalidClasspaths = {};
            this.__cssDependencies = {};

            // Reset also the singletons
            this.__PREFIX = this.classDefinition.$statics.__PREFIX;
            this.__NEXT_PREFIX_INDEX = this.classDefinition.$statics.__NEXT_PREFIX_INDEX;
            this.__NEXT_TAG_INDEX = this.classDefinition.$statics.__NEXT_TAG_INDEX;
            this.__TAG_PREFX = this.classDefinition.$statics.__TAG_PREFX;
        },

        /**
         * Mark a CSS Template classpath as invalid. This means that the file might have changed and the next time we
         * try to load that class we should force a reload. This might happen after a template $reload
         * @param {String} classpath CSS Template classpath
         * @param {Boolean} reload True if the class is used by more than one template context
         */
        invalidate : function (classpath, reload) {
            aria.templates.CSSCtxtManager.disposeContext(classpath);
            if (!this.__invalidClasspaths[classpath] && reload) {
                this.__invalidClasspaths[classpath] = true;
                this.__invalidStack.push(classpath);
            }
        },

        /**
         * Put the CSS Manager in "STOP" mode. This will prevent any newly loaded CSS template to be added to the DOM.
         * This method allows to suspend the worst performing action (updating the style tag) when more than one CSS
         * template has to be loaded. To avoid any visual effect, the CSS Manager should leave the "STOP" mode before
         * any markup is added in the page.
         */
        stop : function () {
            this.__isStopped = true;
        },

        /**
         * Resume the normal activity. If new CSS Template were loaded while the CSS Manager was in "STOP" mode, this
         * function will trigger a style tag refresh.
         */
        resume : function () {
            this.__isStopped = false;

            var changes = this.__queuedChanges;
            this.__queuedChanges = [];
            if (changes.length > 0) {
                return this.__textToDOM(changes);
            }
        },

        /**
         * Register a link between a classpath and a CSSTemplate. This is used during CSS reload to identify if a CSS
         * has to be reloaded.
         * @param {String} classpath classpath that have a dependency on some css
         * @param {Array} cssTemplates css classpaths or references
         */
        registerDependencies : function (classpath, cssTemplates) {
            for (var i = 0, length = cssTemplates.length; i < length; i++) {
                var cssClasspath = getClasspath(cssTemplates[i]);
                if (!this.__globalUsage[cssClasspath]) {
                    this.__globalUsage[cssClasspath] = [];
                }
                this.__globalUsage[cssClasspath].push(classpath);
            }
        },

        /**
         * Unregister a link between a classpath and a CSSTemplate. This is used during CSS reload to identify if a CSS
         * has to be reloaded.
         * @param {String} classpath classpath that have a dependency on some css
         * @param {Array} cssTemplates classpaths or references
         * @param {Boolean} unload if true unload cssTemplate class as well and invalidate them
         * @param {Boolean} timestampNextTime if unload is asked, will trigger browser cache bypass for next load
         */
        unregisterDependencies : function (classpath, cssTemplates, unload, timestampNextTime) {
            var array = aria.utils.Array, classMgr = aria.core.ClassMgr;
            for (var i = 0, length = cssTemplates.length; i < length; i++) {
                var cssClasspath = getClasspath(cssTemplates[i]);
                var usage = this.__globalUsage[cssClasspath];
                array.remove(usage, classpath);
                if (unload) {
                    classMgr.unloadClass(cssClasspath, timestampNextTime);
                    // only invalidate if someone else is using it
                    this.invalidate(cssClasspath, usage.length > 0);
                }
            }
        },

        /**
         * Get the list of invalid classpath that need to be reloaded
         * @param {Boolean} clean if true, will erase list
         * @return {Array} list of invalid classpath
         */
        getInvalidClasspaths : function (clean) {
            var invalidClasspaths = this.__invalidStack;
            if (clean) {
                this.__invalidStack = [];
            }
            return invalidClasspaths;
        }
    }
});
