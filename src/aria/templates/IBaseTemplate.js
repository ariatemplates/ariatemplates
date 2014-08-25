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


/**
 * Base Interface for template context. It is extended by aria.templates.ITemplate to expose methods on
 * aria.templates.TemplateCtxt, and by aria.templates.ICSS for aria.templates.CSSCtxt It defines all the methods that
 * are called by the general macros in aria.templates.ClassGenerator
 * @class aria.templates.IBaseTemplate
 */
module.exports = Aria.interfaceDefinition({
    $classpath : 'aria.templates.IBaseTemplate',
    $events : {},
    $interface : {
        /**
         * Write some markup. This method is intended to be called only from the generated code of templates (created in
         * aria.templates.ClassGenerator) and never directly from developer code. A call to this method is generated for
         * simple text in templates and for ${...} statements.
         * @param {String} markup Markup to write.
         * @private
         */
        __$write : function (markup) {}
    }
});
