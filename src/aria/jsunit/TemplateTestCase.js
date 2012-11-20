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
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        /**
         * Test environment. Defines the template to be loaded, its module controller and datamodel
         * @type Object
         */
        this.env = {
            template : this.$classpath + "Tpl",
            moduleCtrl : null,
            data : {}
        };

        /**
         * Reference to the template context
         * @type aria.templates.TemplateCtxt
         */
        this.templateCtxt = null;

        /**
         * Container for the template output
         * @type HTMLElement
         */
        this.testDiv = aria.utils.Dom.getElementById(this.TEMPLATE_DIV);

        /**
         * Wheter the test has started or not
         * @type Boolean
         */
        this._started = false;
    },
    $statics : {
        "TEMPLATE_DIV" : "TESTAREA"
    },
    $destructor : function () {
        this.testDiv.style.height = "0";
        this.testDiv = null;
        this.templateCtxt = null;

        // Free also some memory cleaning the environment
        this.__cleanEnv(true);

        this.$TestCase.$destructor.call(this);
    },
    $dependencies : ['aria.utils.SynEvents', 'aria.templates.RefreshManager'],
    $onload : function () {
        this.synEvent = aria.utils.SynEvents;
    },
    $onunload : function () {
        this.synEvent = null;
    },
    $prototype : {
        /**
         * Specify that this test needs to be run on a visible document.
         * @type Boolean
         */
        needVisibleDocument : true,

        /**
         * By default, a templatetest case with classpath a.b.c will automatically load the test template a/b/cTpl.tpl.
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

            this.testDiv.style.height = "1000px";
            Aria.$window.scroll(0, 0);
            this._loadTestTemplate({
                fn : this._startTests,
                scope : this
            });
        },

        /**
         * Private helper function, starts the tests once the template has been succesfully loaded and rendered
         */
        _startTests : function () {
            this._started = true; // we set this flag to avoid this function to call itself through e.g a template
            // refresh
            this.runTemplateTest();
        },

        /**
         * Helper function, loads the template into the div. Executes the parameter callback once the template has been
         * successfully rendered.
         * @param {aria.core.JsObject.Callback} cb Callback
         */
        _loadTestTemplate : function (cb) {
            Aria.loadTemplate({
                classpath : this.env.template,
                div : this.TEMPLATE_DIV,
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
         * Disposes the template
         */
        _disposeTestTemplate : function () {
            Aria.disposeTemplate(this.TEMPLATE_DIV);
            // templateCtxt is disposed by Aria.disposeTemplate, but we still set the variable
            // to null here
            this.templateCtxt = null;
            this._started = false;
        },

        /**
         * Disposes the current template, sets the test environment with the template passed as parameter. The template
         * with the nwe environment is loaded, and once it's succesfully rendered, the parameter callback is called.
         * @param {Object} env The new test environment.
         * @param {Callback} callback Called when the new template has been succesfully rendered.
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
         */
        _refreshTestTemplate : function () {
            this.templateCtxt.$refresh();
        },

        /**
         * Callback executed when the template/data/moduleCtrl is loaded
         * @private
         */
        _templateLoadCB : function (res, args) {
            this.templateCtxt = res.tplCtxt;
            var cb = args.cb;

            if (!res.success) {
                // in case there is an error while loading the template,
                // go on with the test (as the test may check that the error is correctly
                // raised)
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
         * Implement this method in your template test case. This is the real entry point of your template test. It is
         * called when the template is loaded,and can be interacted with.
         */
        runTemplateTest : function () {},

        /**
         * Call this method from your template test case when the test is finished. Since template tests are
         * asynchronous (template load, user event simulation, ...), calling this method will instruct the system that
         * the test is ended.
         */
        notifyTemplateTestEnd : function () {
            aria.core.Timer.addCallback({
                fn : function () {
                    // Need to dispose the template since we are always using the same div to do Aria.loadTemplate
                    this._disposeTestTemplate();

                    try {
                        this.testDiv.style.height = "0";
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
            var domUtility = domUtil || aria.utils.Dom;
            var tplCtxt = context || this.templateCtxt;
            var genId = tplCtxt.$getId(id), oElm = domUtility.getElementById(genId);
            if (recursive && !oElm) {
                var subTplCtxts = [];
                this.__retrieveDirectSubTemplates(tplCtxt, subTplCtxts);
                var content = tplCtxt._mainSection._content;
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
         * Useful method to emulate the getElementsByClassName on browser which doesn't support this feature
         * @param {HTMLElement} dom The source dom element
         * @param {String} classname The class name to look for
         * @return {Array} Array of Html elements
         */
        getElementsByClassName : function (dom, classname) {
            if (dom.getElementsByClassName) {
                return dom.getElementsByClassName(classname);
            } else {
                var els = dom.getElementsByTagName("*");
                var found = [];
                var regexp = new RegExp("\\b" + classname + "\\b");
                for (var i = 0, ii = els.length; i < ii; i++) {
                    var el = els[i];
                    if (regexp.test(el.className)) {
                        found.push(el);
                    }
                }
                return found;
            }
        },

        /**
         * @param {aria.templates.TemplateCtxt||aria.templates.Section} obj
         * @param {Array} output contains the sub-template contexts
         */
        __retrieveDirectSubTemplates : function (obj, output) {
            var section = (obj.$TemplateCtxt) ? obj._mainSection : obj;
            var content = section._content;
            for (var i = 0, sz = content.length; i < sz; i++) {
                if (content[i].behavior && content[i].behavior.subTplCtxt) {
                    output.push(content[i].behavior.subTplCtxt);
                } else if (content[i]._content) {
                    this.__retrieveDirectSubTemplates(content[i], output);
                }
            }
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
         * Get the icon of a Multi-Select Widget
         * @param {String} templateWidgetID
         * @return {HTMLElement} Returns directly the input element from the DOM, or null if the ID was not found or
         * didn't correspond to an input field
         */
        getMultiSelectIcon : function (msWidgetID) {
            var widget = this.getWidgetInstance(msWidgetID);

            // force widget initialization
            widget.getDom();

            if (widget._frame.getIcon) {
                return widget._frame.getIcon("dropdown");
            } else {
                return null;
            }
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
            var rmgr = aria.templates.RefreshManager;
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
         * wrapped in a try/catch. In order to make that easier, the assertTrue method is overriden in this class to do
         * the try/catch so that it is unnecesary to do it in test cases classes
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
         * @param {aria.utils.Callback} callback Function to be execute when the cycle is complete
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
            var id = arguments[1][0], text = arguments[1][1], callback = arguments[1][2], blur = arguments[1][3];

            if (blur === false) {
                this.$callback(callback);
            } else {
                var input = this.getInputField(id);
                input.blur();
                this.synEvent.click(Aria.$window.document.body, callback);
            }
        },

        /**
         * Free some memory used by this test
         * @param {Boolean} mctrl If true remove any reference of the module controller
         * @private
         */
        __cleanEnv : function (mctrl) {
            var classRef = Aria.getClassRef(this.env.template);
            if (classRef && classRef.classDefinition.$hasScript) {
                aria.core.ClassMgr.unloadClass(this.env.template + "Script");
            }
            aria.core.ClassMgr.unloadClass(this.env.template);

            if (mctrl && this.env.moduleCtrl) {
                if (this.env.moduleCtrl.classpath) {
                    aria.core.ClassMgr.unloadClass(this.env.moduleCtrl.classpath);
                }
            }
        },

        /**
         * Compute the z-index of an element
         * @param {HTMLElement} element
         * @return {Integer} z-index null if unable to compute it
         */
        computeZIndex : function (element) {
            var stopper = Aria.$window.document.body;

            // inspect parent z-Indexes
            while (element && element != stopper) {
                var style = element.style, elementZIndex = style.zIndex;
                if (elementZIndex) {
                    var intZIndex = parseInt(elementZIndex, 10);
                    return intZIndex;
                }
                element = element.parentNode;
            }

            return null;

        }

    }
});
