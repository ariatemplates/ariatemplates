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
 * Generate the class definition for a CSS Template library
 * @class aria.templates.CmlClassGenerator
 */
Aria.classDefinition({
    $classpath : 'aria.templates.CmlClassGenerator',
    $extends : 'aria.templates.ClassGenerator',
    $singleton : true,
    $dependencies : ['aria.templates.CSSParser', 'aria.templates.CSSClassGenerator'],
    $constructor : function () {
        this.$ClassGenerator.constructor.call(this);

        // Load the Template specific statements
        this._loadStatements(["CSSLibrary"]);

        // Redefine the protected parser
        this._parser = aria.templates.CSSParser;

        // Redefine the class used as the parent for templates which do not inherit from any other template
        this._superClass = "aria.templates.CSSTemplate";

        this._classType = "CML";
        this._rootStatement = "CSSLibrary";
        this._templateParamBean = "aria.templates.CfgBeans.CSSLibraryCfg";
    },
    $prototype : {
        /**
         * Write to the current block of the class writer the $init method which is used both to import the script
         * prototype (if any) and to handle csslibs inheritance.
         * @param {aria.templates.ClassWriter} out
         * @protected
         */
        _writeClassInit : function (out) {
            var tplParam = out.templateParam;
            out.enterBlock("classInit");
            this._writeMapInheritance(out, "__$csslibs", out.templateParam.$csslibs, "{}");
            out.leaveBlock();
            this.$ClassGenerator._writeClassInit.call(this, out);
        }
    }
});