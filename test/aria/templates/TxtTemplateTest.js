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
 * Test basic text templates
 */
Aria.classDefinition({
    $classpath : 'test.aria.templates.TxtTemplateTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.utils.String'],
    $texts : {
        myTestText : 'test.aria.templates.test.TxtTemplate'
    },
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {
        /**
         * Test keep white space and proper escaping
         */
        test_KeepWhiteSpace : function () {
            var output = this.myTestText.processTextTemplate({
                a : 1
            });
            this.assertTrue(output == '/**\n\t* test1\n\t*/\n', "Ouput from processTextTemplate is wrong.");
        }
    }
});
