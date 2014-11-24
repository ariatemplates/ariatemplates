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
/* BACKWARD-COMPATIBILITY-BEGIN (deprecate escape modifier) */
Aria.classDefinition({
    $classpath : "test.aria.templates.escapemodifier.EscapeModifierLogTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.Modifiers", "aria.utils.String"],
    $prototype : {
        /**
         * Call escape modifier and check for the log
         */
        testLogWarnRaisedForEscape : function () {
            var escapedValue = aria.templates.Modifiers.callModifier("escape", ["<escape string>"]);
            this.assertEquals(escapedValue, "&lt;escape string&gt;", "String is not escaped properly");
            this.assertErrorInLogs(aria.templates.Modifiers.DEPRECATED_ESCAPE_MODIFIER, 1);
        }
    }
});
/* BACKWARD-COMPATIBILITY-END (deprecate escape modifier) */