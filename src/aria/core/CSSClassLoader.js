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
 * ClassLoader for CSS files.
 */
Aria.classDefinition({
    $classpath : "aria.core.CSSClassLoader",
    $extends : "aria.core.ClassLoader",
    $constructor : function () {
        this.$ClassLoader.constructor.apply(this, arguments);
        this._refLogicalPath += ".tpl.css";
        this._classGeneratorClassName = "CSSClassGenerator";
    },
    $statics : {
        // ERROR MESSAGES:
        TEMPLATE_EVAL_ERROR : "Error while evaluating the class generated from CSS template '%1'",
        TEMPLATE_DEBUG_EVAL_ERROR : "Error while evaluating the class generated from CSS template '%1'"
    },
    $prototype : {
        /**
         * Called when the .css file is received.
         * @param {String} classDef Content of the .tpl.css file
         * @param {String} logicalPath Logical path of the .tpl.css file
         * @protected
         */
        _loadClass : function (classDef, logicalPath) {
            this._loadClassAndGenerate(classDef, logicalPath, "aria.templates.CSSMgr");
        }
    }
});
