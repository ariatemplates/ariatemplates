/*
 * Copyright 2013 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.widgets.action.link.LinkClick",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {

        _initCpt : function () {
            this.env.data.linkClickCalled = 0;
            this.env.data.divClickCalled = 0;
        },

        runTemplateTest : function () {
            this._linkDomElt = this.getLink("link");
            this._initCpt();
            this.env.data.stopPropagation = false;
            this.synEvent.click(this._linkDomElt, {
                scope : this,
                fn : this._step1
            });
        },

        _step1 : function () {
            this.assertTrue(this.env.data.linkClickCalled == 1);
            this.assertTrue(this.env.data.divClickCalled == 1);
            this._initCpt();
            this.env.data.stopPropagation = true;
            this.synEvent.click(this._linkDomElt, {
                scope : this,
                fn : this._step2
            });
        },

        _step2 : function () {
            this.assertTrue(this.env.data.linkClickCalled == 1);
            this.assertTrue(this.env.data.divClickCalled === 0);
            var tooltipInQuotes = this._linkDomElt.parentNode.title;
            this.assertEquals(tooltipInQuotes, '"Tooltip" in quotes', "Tooltip string is not properly escaped");
            this._linkDomElt = null;
            this.notifyTemplateTestEnd();
        }
    }
});
