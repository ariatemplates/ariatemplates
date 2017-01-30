/*
 * Copyright 2017 Amadeus s.a.s.
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

var Aria = require('ariatemplates/Aria');

var TemplateTestCase = require('ariatemplates/jsunit/TemplateTestCase');

require('./ErrorListCustomTemplate.tpl');



module.exports = Aria.classDefinition({
    $classpath: 'test.aria.widgets.errorlist.displayOptions.ErrorListDisplayOptionsTestCase',
    $extends: TemplateTestCase,

    $constructor: function () {
        this.$TemplateTestCase.$constructor.apply(this, arguments);

        var text = 'This is custom text passed to ErrorList widget instance\'s template through the displayOptions property';
        this._text = text;

        var elementId = 'error_list_template_content';
        this._elementId = elementId;

        this.setTestEnv({
            template: 'test.aria.widgets.errorlist.displayOptions.Tpl',
            data: {
                text: text,
                elementId: elementId
            }
        });
    },

    $prototype: {
        runTemplateTest: function () {
            var contentElement = Aria.$window.document.getElementById(this._elementId);

            this.assertTrue(contentElement != null, 'Custom id should have been passed and output to build the element.');
            this.assertTrue(contentElement.textContent === this._text, 'Custom text should have been passed and output inside the element.');

            this.end();
        }
    }
});
