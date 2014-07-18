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

/**
 * Class to be extended to create a template test case
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.TemplateTestCase",
    $extends : "aria.jsunit.TestCase",
    $events : {
        "beforeLoadTplInIframe" : {
            description : "Raised before calling Aria.loadTemplate inside an iframe",
            properties : {
                window : "The iframe's window object",
                document : "The iframe's document object"
            }
        }
    },
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        /**
         * Test environment. Defines the template to be loaded, its module controller and datamodel. If iframe is set to
         * true, the template is loaded inside an iframe
         * @type Object
         */
        this.env = {
            template : this.$classpath + "Tpl",
            moduleCtrl : null,
            data : {},
            iframe : false,
            baseCss : this.IFRAME_BASE_CSS_TEXT, // css that will be set on the <iframe> itself
            iframePageCss : "" // css that will be injected into iframe as <style> tag
        };

        /**
         * Reference to the template context
         * @type aria.templates.TemplateCtxt
         */
        this.templateCtxt = null;

        /**
         * ID of the container for the template output
         * @type HTMLElement
         */
        this.testDivId = "testArea_" + this.$class;

        /**
         * Reference to the window containing the template under test
         * @type HTMLElement
         */
        this.testWindow = null;

        /**
         * Reference to the document object containing the template under test
         * @type HTMLElement
         */
        this.testDocument = null;

        /**
         * Container for the template output
         * @type HTMLElement
         */
        this.testDiv = null;

        /**
         * Reference to iframe added by the test case
         * @type HTMLElement
         */
        this.testIframe = null;

        /**
         * Whether the test has started or not
         * @protected
         * @type Boolean
         */
        this._started = false;

        /**
         * Shortcut to the synthetic event library. This kept in sync when the test window changes
         * @type aria.utils.SynEvents
         */
        this.synEvent = aria.utils.SynEvents;
    },
    $destructor : function () {
        // Free also some memory cleaning the environment
        this.__cleanEnv(true);
        this.__removeTestDiv();
        if (this.testIframe) {
            this.testIframe.parentNode.removeChild(this.testIframe);
            this.testIframe = null;
        }
        this.templateCtxt = null;
        this.testDocument = null;
        this.testWindow = null;

        this.$TestCase.$destructor.call(this);
    },
    $dependencies : ["aria.utils.SynEvents", "aria.templates.RefreshManager", "aria.utils.Type"],
    $statics : {
        IFRAME_LOAD_TEMPLATE : "Error loading template '%1' in iframe",
        IFRAME_LOADER : "Unable to load Aria Templates in iframe because: %1"
    },
    $prototype : {
        /**
         * Specify that this test needs to be run on a visible document.
         * @type Boolean
         */
        needVisibleDocument : true,

        /**
         * By default, a template test case with classpath a.b.c will automatically load the test template a/b/cTpl.tpl.
         * However, if needed, this method can be called to configure which template classpath to be loaded.
         * Additionally, it can also be used to pass some data and/or module controller. To be called in the constructor
         * of a template test case: this.setTestEnv({template: "...", moduleCtrl: "...", data: {...}});
         * @param {Object} env
         */
        setTestEnv : function (env) {
            // override existing value
            for (var i in env) {
                if (env.hasOwnProperty(i)) {
                    this.env[i] = env[i];
                }
            }
        },

        /**
         * This is the entry point of the template test case, it will load the template/data/moduleCtrl. Unlike unit
         * test cases, template test cases should not implement test... methods. There is only test method, already
         * implemented in this class. The real entry point for the test case is the runTemplateTest method
         */
        testAsyncStartTemplateTest : function () {
            if (this.env.iframe) {
                this.loadTemplateInIframe(this.env, {
                    fn : this._iframeSetUpComplete,
                    scope : this
                }, {
                    fn : this._iframeSetUpFailed,
                    scope : this
                });
            } else {
                this._loadTestTemplate({
                    fn : this._startTests,
                    scope : this
                });
            }
        },

        /**
         * Helper function, loads the template into the div. Executes the parameter callback once the template has been
         * successfully rendered.
         * @protected
         * @param {aria.core.CfgBeans:Callback} cb Callback
         */
        _loadTestTemplate : function (cb) {
            this.testWindow = Aria.$window;
            this.testDocument = Aria.$window.document;
            if (!this.testDiv) {
                var div = this.testDocument.createElement("div");
                div.id = this.testDivId;
                div.style.cssText = this._getCssTextForTestFrame(this.env);
                this.testDocument.body.appendChild(div);
                this.testDiv = div;
            }

            this.testWindow.scroll(0, 0);
            Aria.loadTemplate({
                classpath : this.env.template,
                div : this.testDiv,
                data : this.env.data,
                moduleCtrl : this.env.moduleCtrl,
                provideContext : true
            }, {
                fn : this._templateLoadCB,
                scope : this,
                args : {
                    cb : cb
                }
            });
        },

        /**
         * Callback executed when the template/data/moduleCtrl is loaded
         * @protected
         */
        _templateLoadCB : function (res, args) {
            this.templateCtxt = res.tplCtxt;
            var cb = args.cb;

            if (!res.success) {
                // in case there is an error while loading the template,
                // go on with the test (as the test may check that the error is correctly raised)
                this.$callback(cb);
                return;
            }

            // we listen to the event "Ready' so we're sure the templates and its subtemplates are displayed
            if (this.templateCtxt.isReady()) {
                this.$callback(cb);
            } else {
                // FIXME, ready is called too early, try to find another solution
                this.templateCtxt.$onOnce({
                    'Ready' : {
                        fn : function (evt, args) {
                            if (this._started) {
                                return;
                            }

                            // Wait a little bit before starting the test
                            if (args) {
                                args.delay = 50;
                                aria.core.Timer.addCallback({
                                    fn : function (callback) {
                                        this.$callback(callback);
                                    },
                                    scope : this,
                                    args : args
                                });
                            }
                        },
                        scope : this,
                        args : cb
                    }
                });
            }
        },

        /**
         * Callback executed when the iframe is loaded correctly
         * @param {Object} info iframe informations
         * @protected
         */
        _iframeSetUpComplete : function (info) {
            this.testDiv = info.div;
            this.testIframe = info.iframe;
            this.testWindow = info.iframe.contentWindow;
            this.testDocument = info.document;
            this.synEvent = this.testWindow.aria.utils.SynEvents;
            this._templateLoadCB({
                success : true,
                tplCtxt : info.templateCtxt
            }, {
                cb : {
                    fn : this._startTests,
                    scope : this
                }
            });
        },

        /**
         * Callback executed when the iframe cannot be loaded due to errors
         * @protected
         */
        _iframeSetUpFailed : function (args) {
            // Save the references anyway because they are cleaned after
            this.testDiv = args.div;
            if (args.iframe) {
                this.testIframe = args.iframe;
                this.testWindow = args.iframe.contentWindow;
            }
            // errors are already logged
            this._startTests();
        },

        /**
         * Private helper function, starts the tests once the template has been successfully loaded and rendered
         * @protected
         */
        _startTests : function () {
            this._started = true; // we set this flag to avoid this function to call itself through e.g a template
            // refresh
            this.runTemplateTest();
        },

        /**
         * Disposes the template
         * @protected
         */
        _disposeTestTemplate : function () {
            this.testWindow.Aria.disposeTemplate(this.testDiv);
            // templateCtxt is disposed by Aria.disposeTemplate, but we still set the variable to null here
            this.templateCtxt = null;
            this._started = false;
        },

        /**
         * Disposes the current template, sets the test environment with the template passed as parameter. The template
         * with the new environment is loaded, and once it's successfully rendered, the parameter callback is called.
         * @protected
         * @param {Object} env The new test environment.
         * @param {aria.core.CfgBeans:Callback} callback Called when the new template has been successfully rendered.
         */
        _replaceTestTemplate : function (env, cb) {
            // async call allows the template to finish init
            aria.core.Timer.addCallback({
                fn : function () {
                    this._disposeTestTemplate();
                    this.__cleanEnv();
                    this.setTestEnv(env);
                    this._loadTestTemplate(cb);
                },
                scope : this
            });

        },

        /**
         * This method issues a refresh on the template
         * @protected
         */
        _refreshTestTemplate : function () {
            this.templateCtxt.$refresh();
        },

        /**
         * Implement this method in your template test case. This is the real entry point of your template test. It is
         * called when the template is loaded, and can be interacted with.
         */
        runTemplateTest : function () {},

        /**
         * Reads the name of the next test function (from this._testsToExecute) to execute and proceeds, or finishes
         * when no more tests left. To be used in async tests when you prefer simply to call this.nextTest() instead of
         * passing the concrete name of the test to continue with. Note that in template test cases, test functions
         * names should not start with "test".
         */
        nextTest : function () {
            var nextTestName = this._testsToExecute.shift();
            if (nextTestName) {
                aria.core.Timer.addCallback({
                    fn : function () {
                        this._currentTestName = nextTestName; // for logging purposes
                        this[nextTestName]();
                    },
                    scope : this,
                    delay : 10
                });
            } else {
                this.notifyTemplateTestEnd();
            }
        },

        /**
         * Call this method from your template test case when the test is finished. Since template tests are
         * asynchronous (template load, user event simulation, ...), calling this method will instruct the system that
         * the test is ended.
         */
        notifyTemplateTestEnd : function () {
            if (this.demoMode) {
                return;
            }
            aria.core.Timer.addCallback({
                fn : function () {
                    // Need to dispose the template since we are always using the same div to do Aria.loadTemplate
                    this._disposeTestTemplate();

                    try {
                        this.__removeTestDiv();
                        if (this.testIframe) {
                            this.testIframe.style.display = "none";
                        }
                        this.notifyTestEnd("testAsyncStartTemplateTest");
                    } catch (ex) {
                        this.handleAsyncTestError(ex);
                    }
                },
                scope : this,
                delay : 50
            });
        },

        /**
         * Return the DOM element in the current template with the specified id (the id should have been given with the
         * {id .../} statement).
         * @param {String} id
         * @param {Boolean} recursive if true, the element is looked for inside the subtemplates (default: false)
         * @param {aria.templates.TemplateCtxt} context within which the element has to be looked for (default: the main
         * template context)
         * @param {aria.utils.Dom} domUtil could be the aria.utils.Dom singleton of an iframe
         * @return {HTMLElement}
         */
        getElementById : function (id, recursive, context, domUtil) {
            var domUtility = domUtil || this.testWindow.aria.utils.Dom;
            var tplCtxt = context || this.templateCtxt;
            var genId = tplCtxt.$getId(id), oElm = domUtility.getElementById(genId);
            if (recursive && !oElm) {
                var subTplCtxts = [];
                this._retrieveDirectSubTemplates(tplCtxt, subTplCtxts);
                // var content = tplCtxt._mainSection._content;
                for (var i = 0, sz = subTplCtxts.length; i < sz; i++) {
                    oElm = this.getElementById(id, true, subTplCtxts[i], domUtility);
                    if (oElm) {
                        return oElm;
                    }
                }
            }
            return oElm;
        },

        /**
         * Proxy to aria.utils.Dom.getElementsByClassName - kept for backwards compability.
         * Better use aria.utils.Dom.getElementsByClassName directly.
         * @deprecated
        */
        getElementsByClassName : function (dom, classname) {
            return aria.utils.Dom.getElementsByClassName(dom, classname);
        },

        /**
         * @param {aria.templates.TemplateCtxt|aria.templates.Section} obj
         * @param {Array} output contains the sub-template contexts
         * @return {Array} output contains the sub-template contexts
         * @protected
         */
        _retrieveDirectSubTemplates : function (obj, output) {
            output = output || [];
            var section = (obj.$TemplateCtxt) ? obj._mainSection : obj;
            var content = section._content;
            for (var i = 0, sz = content.length; i < sz; i++) {
                if (content[i].behavior && content[i].behavior.subTplCtxt) {
                    output.push(content[i].behavior.subTplCtxt);
                } else if (content[i]._content) {
                    this._retrieveDirectSubTemplates(content[i], output);
                }
            }
            return output;
        },
        /**
         * Get the &lt;input&gt; DOM element of an input based widget.
         * @param {String} templateWidgetID
         * @return {HTMLElement} Returns directly the input element from the DOM, or null if the ID was not found or
         * didn't correspond to an input field
         */
        getInputField : function (templateWidgetID) {
            var widget = this.getWidgetInstance(templateWidgetID);

            if (widget.getTextInputField) {
                return widget.getTextInputField();
            } else if (widget.getDom()) {
                // FIXME: not nice at all !!! each input-based widget should have a method to do that
                return widget.getDom().getElementsByTagName("input")[0];
            } else {
                return null;
            }
        },

        /**
         * Get a DOM element with the given tag name from the given widget in the template
         * @param {String} templateWidgetId widget id
         * @param {String} tagName tag name
         * @return {HTMLElement}
         */
        getWidgetDomElement : function (templateWidgetId, tagName) {
            var widget = this.getWidgetInstance(templateWidgetId);
            var domElt = widget.getDom().getElementsByTagName(tagName)[0];
            return domElt;
        },

        /**
         * Get the expand button of a Multi-Select, Autocomplete or any other dropdown-based widget
         * @param {String} templateWidgetID
         * @return {HTMLElement} Returns directly the input element from the DOM, or null if the ID was not found or
         * didn't correspond to an input field
         */
        getExpandButton : function (templateWidgetID) {
            var widget = this.getWidgetInstance(templateWidgetID);

            // force widget initialization
            widget.getDom();

            if (widget._frame.getIcon) {
                return widget._frame.getIcon("dropdown");
            } else {
                return null;
            }
        },

        /**
         * Get the icon of a Multi-Select Widget (alias to getExpandButton for backward compat)
         * @param {String} templateWidgetID
         * @return {HTMLElement} Returns directly the input element from the DOM, or null if the ID was not found or
         * didn't correspond to an input field
         */
        getMultiSelectIcon : function (msWidgetID) {
            return this.getExpandButton(msWidgetID);
        },

        /**
         * Get the DOM element of the dropdown popup associated to a DropDownTrait widget
         * @param {String} templateWidgetId widget id
         * @return {HTMLElement}
         */
        getWidgetDropDownPopup : function (templateWidgetId) {
            var widget = this.getWidgetInstance(templateWidgetId);

            if (widget._dropdownPopup) {
                return widget._dropdownPopup.domElement;
            }
        },

        /**
         * Get the &lt;input&gt; DOM element of an input based widget.
         * @param {String} templateWidgetID
         * @return {HTMLElement} Returns directly the input element from the DOM, or null if the ID was not found or
         * didn't correspond to an input field
         */
        getSortIndicator : function (templateWidgetID) {
            var widget = this.getWidgetInstance(templateWidgetID);

            // force widget initialization
            widget.getDom();

            if (widget) {
                return widget._domElt;
            } else {
                return null;
            }
        },

        /**
         * Get the instance of a widget from the template, given its ID
         * @param {String} templateWidgetID The ID of the widget
         * @return {aria.widgets.Widget} The widget object
         */
        getWidgetInstance : function (templateWidgetID) {
            var rmgr = this.testWindow.aria.templates.RefreshManager;
            return this.getWidgetInstanceInRefreshMgr(rmgr, templateWidgetID);
        },

        /**
         * Uses the given refresh manager to get the instance of a widget given its ID from a template.
         * @param {aria.templates.RefreshManager} refreshMgr reference to the refresh manager
         * @param {String} templateWidgetID The ID of the widget
         * @return {aria.widgets.Widget} The widget object
         */
        getWidgetInstanceInRefreshMgr : function (refreshMgr, templateWidgetID) {
            refreshMgr.updateHierarchies();
            var hiers = refreshMgr.getHierarchies();

            for (var i = 0; i < hiers.length; i++) {
                var res = this._findInHierarchy(hiers[i], templateWidgetID);
                if (res) {
                    return res;
                }
            }
        },

        /**
         * Get the instance of a widget given its ID from a template inside an iframe.
         * @param {HTMLElement} iframe reference to the iFrame
         * @param {String} templateWidgetID The ID of the widget
         * @return {aria.widgets.Widget} The widget object
         */
        getWidgetInstanceInIframe : function (iframe, templateWidgetID) {
            return this.getWidgetInstanceInRefreshMgr(iframe.contentWindow.aria.templates.RefreshManager, templateWidgetID);
        },

        /**
         * Get the &lt;a&gt; DOM element of a Link widget.
         * @param {String} templateWidgetID widget id
         * @return {HTMLElement}
         */
        getLink : function (templateWidgetId) {
            return this.getWidgetDomElement(templateWidgetId, "a");
        },

        _findInHierarchy : function (node, widgetID, context) {
            var contextUpdated = false;
            if (node.type == "template") {
                // updateContext
                context = node.elem;
                contextUpdated = true;
            } else if (node.type == "templateWidget") {
                if (node.elem.behavior) {
                    context = node.elem.behavior.subTplCtxt;
                } else {
                    context = node.elem.subTplCtxt;
                }
                contextUpdated = true;
            }

            if (contextUpdated) {
                // each time we update the context, we look for the id
                var tempRes = context.getBehaviorById(widgetID);
                if (tempRes) {
                    return tempRes;
                }
            }

            if (node.content) {
                for (var i = 0; i < node.content.length; i++) {
                    var subnode = node.content[i];
                    var tempRes = this._findInHierarchy(subnode, widgetID, context);
                    if (tempRes != null) {
                        return tempRes;
                    }
                }
            }
            return null;
        },

        /**
         * In case of template testing, all tests are asynchronous, because of this, all calls to assertTrue need to be
         * wrapped in a try/catch. In order to make that easier, the assertTrue method is overridden in this class to do
         * the try/catch so that it is unnecessary to do it in test cases classes
         * @param {Boolean} condition A condition evaluating to true or false
         * @param {String} message Optional message to be displayed when the assert fails
         */
        assertTrue : function (condition, message) {
            try {
                this.$TestCase.assertTrue.apply(this, [condition, message]);
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
        },

        /**
         * Just a shortcut for notifyTemplateTestEnd. I never manage to remember and spell it correctly at first attempt
         */
        end : function () {
            this.notifyTemplateTestEnd();
        },

        /**
         * Shortcut for the very common task of clicking a widget, typing and (optionally) blur.
         * @param {String} id Widget id
         * @param {String} text Text to type in the widget
         * @param {aria.core.CfgBeans:Callback} callback Function to be execute when the cycle is complete
         * @param {Boolean} blur Blur the widget after typing. Default true
         */
        clickAndType : function (id, text, callback, blur) {
            this.synEvent.click(this.getInputField(id), {
                fn : this.__afterClick,
                scope : this,
                args : [id, text, callback, blur]
            });
        },

        /**
         * Internal methods used by clickAndType
         * @private
         */
        __afterClick : function () {
            var id = arguments[1][0], text = arguments[1][1], callback = arguments[1][2], blur = arguments[1][3];

            this.synEvent.type(this.getInputField(id), text, {
                fn : this.__afterType,
                scope : this,
                args : [id, text, callback, blur]
            });
        },

        /**
         * Internal methods used by clickAndType
         * @private
         */
        __afterType : function () {
            var callback = arguments[1][2], blur = arguments[1][3];
            // text = arguments[1][1]
            if (blur === false) {
                this.$callback(callback);
            } else {
                this.synEvent.click(this.testDocument.body, callback);
            }
        },

        /**
         * Free some memory used by this test
         * @param {Boolean} mctrl If true remove any reference of the module controller
         * @private
         */
        __cleanEnv : function (mctrl) {
            var classRef = this.testWindow.Aria.getClassRef(this.env.template);
            var classMgr = this.testWindow.aria.core.ClassMgr;
            if (classRef && classRef.classDefinition.$hasScript) {
                classMgr.unloadClass(this.env.template + "Script");
            }
            classMgr.unloadClass(this.env.template);

            if (mctrl && this.env.moduleCtrl) {
                if (this.env.moduleCtrl.classpath) {
                    classMgr.unloadClass(this.env.moduleCtrl.classpath);
                }
            }
        },

        /**
         * Compute the z-index of an element
         * @param {HTMLElement} element
         * @return {Integer} z-index null if unable to compute it
         */
        computeZIndex : function (element) {
            var stopper = this.testDocument.body;

            // inspect parent z-Indexes
            while (element && element != stopper) {
                var style = (element.style) ? element.style : null;
                var elementZIndex = (style && style.zIndex) ? style.zIndex : null;
                if (elementZIndex) {
                    var intZIndex = parseInt(elementZIndex, 10);
                    return intZIndex;
                }
                element = element.parentNode;
            }

            return null;
        },

        /**
         * Load a template inside an iframe. This is needed when the test wants to modify the frame window or other
         * properties that are not accessible on the main window<br>
         * A template is specified by
         * <ul>
         * <li>template Template classpath</li>
         * <li>cssText Any inline style to be added on the iframe</li>
         * <li>data Data model</li>
         * <li>moduleCtrl Module controller definition</li>
         * </ul>
         * <br>
         * The callback receive an object containing
         * <ul>
         * <li>iframe the iframe element</li>
         * <li>div the div element on which the template has been loaded</li>
         * <li>document the iframe's document element</li>
         * </ul>
         * The errback is called in case of error while loading Aria Template or the template inside the iframe
         * @param {Object} definition
         * @param {aria.core.CfgBeans:Callback} callback
         * @param {aria.core.CfgBeans:Callback} errback
         */
        loadTemplateInIframe : function (definition, callback, errback) {
            var args = {
                def : definition,
                cb : callback,
                err : errback || {
                    fn : this.end,
                    scope : this
                }
            };

            Aria.load({
                classes : ["aria.utils.FrameATLoader"],
                template : [definition.template],
                oncomplete : {
                    fn : this._iframeDepLoad,
                    args : args,
                    scope : this
                },
                // In case of error I assume the loader is logging something
                onerror : args.err
            });
        },

        /**
         * Called when the iframe dependencies are loaded
         * @param {Object} args
         * @protected
         */
        _iframeDepLoad : function (args) {
            var document = Aria.$window.document;
            var containerDiv = document.createElement("div");
            containerDiv.style.cssText = "background-color:#F7F6F1;position:absolute;";
            var iframe = document.createElement("iframe");
            iframe.id = "testIframe_" + this.$class;
            iframe.style.cssText = this._getCssTextForTestFrame(args.def);
            containerDiv.appendChild(iframe);
            document.body.appendChild(containerDiv);
            args.iframe = iframe;

            var cb = {
                fn : this._iframeInnerDepLoad,
                scope : this,
                args : args
            };
            var options = {
                iframePageCss : this.env.iframePageCss
            };
            aria.utils.FrameATLoader.loadAriaTemplatesInFrame(iframe, cb, options);
        },

        /**
         * Load the inner dependencies of the iframe
         * @param {Object} result
         * @param {Object} args
         * @protected
         */
        _iframeInnerDepLoad : function (result, args) {
            if (!result.success) {
                return this._iframeLoadError(args, result.reason);
            }
            var window = args.iframe.contentWindow;
            var appenders = aria.core.Log.getAppenders();
            for (var i = 0, len = appenders.length; i < len; i += 1) {
                window.aria.core.Log.addAppender(appenders[i]);
            }
            window.Aria.load({
                classes : ["aria.jsunit.TemplateTestCase"],
                oncomplete : {
                    fn : this._iframeLoad,
                    scope : this,
                    args : args
                },
                onerror : {
                    fn : function (args) {
                        // FIXME Doing this because onerror is not an aria.core.CfgBean.Callback so I can't use
                        // apply:true
                        this._iframeLoadError(args, "onerror callback of Aria.load(aria.jsunit.TemplateTestCase)");
                    },
                    scope : this,
                    args : args
                }
            });
        },

        /**
         * Called when the iframe and its dependencies are loaded
         * @param {Object} result
         * @param {Object} args
         * @protected
         */
        _iframeLoad : function (args) {
            var window = args.iframe.contentWindow;
            var document = args.iframe.contentDocument || window.document;
            var div = document.createElement("div");
            document.body.appendChild(div);
            args.div = div;
            var definition = args.def;
            this.$raiseEvent({
                name : "beforeLoadTplInIframe",
                window : window,
                document : document
            });
            window.Aria.loadTemplate({
                classpath : definition.template,
                div : div,
                data : definition.data,
                moduleCtrl : definition.moduleCtrl,
                provideContext : true,
                width : definition.width,
                height : definition.height,
                rootDim : definition.rootDim
            }, {
                fn : this._iframeDone,
                scope : this,
                args : args
            });
        },

        /**
         * Called in case of errors while loading the iframe with its inner dependencies
         * @param {Object} args
         * @protected
         */
        _iframeLoadError : function (args, reason) {
            if (reason === aria.utils.FrameATLoader.BOOTSTRAP) {
                reason = "unable to load the bootstrap in the iframe";
            } else if (reason === aria.utils.FrameATLoader.WAIT) {
                reason = "the iframe didn't load the framework quick enough";
            }
            this.$logError(this.IFRAME_LOADER, reason);
            return this.$callback(args.err, args);
        },

        /**
         * Called when the template is loaded in the div
         * @param {Object} result
         * @param {Object} args
         * @protected
         */
        _iframeDone : function (result, args) {
            if (!result.success) {
                this.$logError(this.IFRAME_LOAD_TEMPLATE, args.def.template);
                return this.$callback(args.err, args);
            }
            this.$callback(args.cb, {
                iframe : args.iframe,
                div : args.div,
                document : args.iframe.contentDocument || args.iframe.contentWindow.document,
                templateCtxt : result.tplCtxt
            });
        },

        /**
         * Merges and outputs base and additional CSS text for the iframe found in env setting of a template test.
         * @param {Object} env
         * @return {String}
         * @protected
         */
        _getCssTextForTestFrame : function (env) {
            return env.baseCss + (env.css ? ";" + env.css : "");
        },

        /**
         * Executed when an unhandled exception is thrown inside a method.
         * @param {Error} ex Exception
         * @param {String} methodName Method that threw the exception
         * @private
         * @override
         */
        __failInTestMethod : function (ex, methodName) {
            // Template tests are always asynchronous, but we need to call notifyTemplateTestEnd
            this.$logError(this.EXCEPTION_IN_METHOD, methodName, ex);
            this.notifyTemplateTestEnd();
        },

        /**
         * Remove the testDiv dom element
         * @private
         */
        __removeTestDiv : function () {
            if (this.testDiv) {
                this.testDiv.parentNode.removeChild(this.testDiv);
                this.testDiv = null;
            }
        }
    }
});
