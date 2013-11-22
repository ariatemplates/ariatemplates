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
 * ClassLoader for js files.
 */
Aria.classDefinition({
    $classpath : 'aria.core.JsClassLoader',
    $extends : 'aria.core.ClassLoader',
    $constructor : function () {
        this.$ClassLoader.constructor.apply(this, arguments);
        this._refLogicalPath += ".js";
    },
    $prototype : {
        /**
         * Called when the .js file is received. This method simply do an eval of the .js file.
         * @param {String} classdef Content of the .js file
         * @param {String} lp Logical path of the .js file
         * @protected
         */
        _loadClass : function (classdef, lp) {
            Aria["eval"](classdef, lp);
            if (!this._classDefinitionCalled) {
                this.$logError(this.MISSING_CLASS_DEFINITION, [this.getRefLogicalPath(), this._refClasspath]);
                aria.core.ClassMgr.notifyClassLoadError(this._refClasspath);
            }
        }
    }
});
