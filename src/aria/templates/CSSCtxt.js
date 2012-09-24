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
 * A CSSCtxt object is the interface toward an Aria CSS template. CSSCtxt is used to generate the CSS selectors from a
 * CSS Template class.
 * @class aria.templates.CSSCtxt
 * @extends aria.templates.BaseCtxt
 */
Aria.classDefinition({
    $classpath : 'aria.templates.CSSCtxt',
    $dependencies : ['aria.templates.CfgBeans', 'aria.utils.String'],
    $implements : ['aria.templates.ICSS'],
    $extends : "aria.templates.BaseCtxt",
    $constructor : function (classPath) {
        this.$BaseCtxt.constructor.apply(this, arguments);

        /**
         * Classpath of the CSS Template
         * @type String
         */
        this.tplClasspath = null;

        /**
         * Cached output of the CSS template.
         * @type String
         * @private
         */
        this.__cachedOutput = null;

        /**
         * Prefix for CSS selectors
         * @type String
         * @private
         */
        this.__prefix = "";

        /**
         * Result of the prefixing operation.
         * @type String
         * @private
         */
        this.__prefixedText = "";

        /**
         * Number of CSS selectors
         * @type Number
         * @private
         */
        this.__numSelectors = NaN;
    },

    $destructor : function () {
        if (this._tpl) {
            try {
                this._tpl.$dispose();
            } catch (e) {
                this.$logError(this.TEMPLATE_DESTR_ERROR, [this.tplClasspath], e);
            }
            // dispose the template interface wrapper as well:
            aria.templates.ICSS.prototype.$destructor.call(this._tpl);
            this._tpl = null;
        }

        this.data = null;
        this.moduleRes = null;
        this.moduleCtrl = null;
        this.moduleCtrlPrivate = null;

        this.$BaseCtxt.$destructor.call(this);
    },
    $statics : {
        MEDIA_RULE : /@media\b/
    },
    $prototype : {
        /**
         * Init the CSS template with the given configuration.
         * @param {aria.templates.CfgBeans.InitCSSTemplateCfg} cfg Template context configuration
         * @return {Boolean} true if there was no error
         */
        initTemplate : function (cfg) {
            if (!aria.core.JsonValidator.normalize({
                json : cfg,
                beanName : "aria.templates.CfgBeans.InitCSSTemplateCfg"
            })) {
                return false;
            }
            this._cfg = cfg;

            // Get an insatnce of the CSS template
            var tpl = Aria.getClassInstance(cfg.classpath);
            if (!tpl) {
                this.$logError(this.TEMPLATE_CONSTR_ERROR, [cfg.classpath]);
                return false;
            }
            this._tpl = tpl;

            // Main macro (not configurable)
            cfg.macro = this.checkMacro({
                name : "main",
                args : cfg.args
            });
            this.tplClasspath = cfg.classpath;

            // We no longer create new methods in a closure each time a new instance of a template is created,
            // instead we use the interface mechanism to expose methods to the template and prevent access to the
            // template context
            aria.templates.ICSS.call(tpl, this);

            // TEMPORARY PERF IMPROVMENT : interface on these two functions results in poor performances.
            // Investigation ongoing on interceptors

            var oSelf = this;

            tpl.__$write = function () {
                return oSelf.__$write.apply(oSelf, arguments);
            };

            if (!tpl.__$initTemplate()) {
                return false;
            }
            this.__loadLibs(tpl.__$csslibs, "csslibs");
            return true;
        },

        /**
         * Is this Template context linked to a CSS template that requires selector prefixing ? TODO configurabule
         * through initArgs ?
         * @return Boolean
         */
        doPrefixing : function () {
            // Widget don't need prefixing
            if (this._tpl.disablePrefix) {
                return;
            }
            return !this._cfg.isWidget;
        },

        /**
         * Is this Template context linked to a Widget CSS template?
         */
        isWidget : function () {
            return this._cfg.isWidget;
        },

        /**
         * Is this Template context linked to a Widget CSS template?
         */
        isTemplate : function () {
            return this._cfg.isTemplate;
        },

        /**
         * Returns the output of the main macro. It only actually calls the main macro the first time, and then only
         * returns a cached version.
         */
        _getOutput : function () {
            if (this.__cachedOutput) {
                return this.__cachedOutput;
            }

            // Call the main macro to let the template engine evaluate the text
            this.$assert(156, this._out == null);
            this._out = [];
            this._callMacro(null, "main");
            var text = this._out.join("");
            this._out = null;

            this.__cachedOutput = text;
            return text;
        },

        /**
         * Prefix the CSS text
         * @param {String} classPrefix class prefix for each selector
         */
        prefixText : function (classPrefix) {
            var text = this._getOutput();

            // Format the prefix for the CSS text
            var prefix = "." + classPrefix + " ";

            var prefixed = this.__prefixingAlgorithm(text, prefix);
            this.__prefixedText = prefixed.text;
            this.__numSelectors = prefixed.selectors;
        },

        /**
         * Actual prefixing algorithm. It's in a different function to be unit testable
         * @param {String} text CSS text to prefix, output of teh template engine
         * @param {String} prefix prefix to be added to each selector for example '.prefix '
         * @return {Object}
         * 
         * <pre>
         * {text: prefixed text, selectors: number of selectors}
         * </pre>
         * 
         * @private
         */
        __prefixingAlgorithm : function (text, prefix) {
            // Here i work on the assumption that all the bad inputs are removed
            var parts = text.split("}"), length = parts.length;

            // There should be at least two pieces to be a CSS selector
            if (length < 2) {
                return {
                    text : text,
                    selectors : 0
                };
            }

            var trim = aria.utils.String.trim;
            var MEDIA_RULE = this.MEDIA_RULE;

            /* Splitting on } means that each line is a CSS rule */
            var decomposed, selectors, prefixed, number = 0;
            for (var i = 0; i < length; i += 1) {
                decomposed = parts[i].split("{");
                selectors = trim(decomposed[0]);

                if (!selectors) {
                    continue;
                }

                var isMediaRule = MEDIA_RULE.test(selectors);
                if (isMediaRule) {
                    decomposed[0] = selectors; // after the trim
                    // media rules must not be prefixed, but rules inside them must be
                    selectors = trim(decomposed[1]);
                    if (!selectors) {
                        continue;
                    }
                }

                selectors = selectors.split(",");

                prefixed = [];

                for (var j = 0, k = selectors.length; j < k; j += 1) {
                    prefixed.push(prefix + trim(selectors[j]));
                    number += 1;
                }

                if (isMediaRule) {
                    prefixed[0] = '\n' + prefixed[0];
                    decomposed[1] = prefixed.join(", ");
                } else {
                    decomposed[0] = prefixed.join(", ");
                }

                parts[i] = decomposed.join(" {");
            }

            return {
                text : parts.join("}\n"),
                selectors : number
            };
        },

        /**
         * Get the CSS text, prefixing the selectors
         * @return {String} CSS text
         */
        getText : function () {
            if (this._cfg.isWidget || this._tpl.disablePrefix) {
                return this._getOutput();
            } else {
                return this.__prefixedText;
            }
        },

        /**
         * Get the number of CSS selectors
         * @return Number number of selectors
         */
        getNumLines : function () {
            return this.__numSelectors;
        },

        /**
         * Write some text. This method is intended to be called only from the generated code of templates (created in
         * aria.templates.ClassGenerator) and never directly from developer code. A call to this method is generated for
         * simple text in templates and for ${...} statements.
         * @param {Array} text Text to write.
         * @private
         * @implements aria.templates.ICSS
         */
        __$write : function (text) {
            this._out = this._out.concat(text);
        }
    }
});