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
var ariaTemplatesParser = require("./Parser");

/**
 * Parser for text template. It is specific has it keeps whitespaces
 * @class aria.templates.TxtParser
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.templates.TxtParser',
    $extends : ariaTemplatesParser,
    $singleton : true,
    $constructor : function () {
        this.$Parser.constructor.apply(this, arguments);

        /**
         * Override default value
         */
        this._keepWhiteSpace = true;
    },
    $prototype : {
        /**
         * Parse the given template and return a tree representing the template.
         * @param {String} template template to parse
         * @param {object} context template context data, passes additional information the to error log)
         * @param {Object} statements list of statements allowed by the class generator
         * @param {Boolean} throwErrors if true, errors will be thrown instead of being logged
         * @return {aria.templates.TreeBeans:Root} The tree built from the template, or null if an error occured. After
         * the execution of this method, this.template contains the template with comments and some spaces and removed,
         * and this.positionToLineNumber can be used to transform positions in this.template into line numbers.
         */
        parseTemplate : function (template, context, statements, throwErrors) {
            this.context = context;
            this._prepare(template, throwErrors);
            this._computeLineNumbers();
            return this._buildTree(throwErrors);
        }
    }
});
