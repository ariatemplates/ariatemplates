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
    $classpath : "test.aria.widgets.action.link.disabled.LinkDisabled",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {

        runTemplateTest : function () {
            this._linkDomElt = this.getLink("link");
            this._spanLink = this.getElementById("TestID");
            this.assertEquals(this._linkDomElt.className, 'xLink_std', "Link should be in active state");
            this.synEvent.click(this._spanLink, {
                scope : this,
                fn : this._step1
            });
        },

        _step1 : function () {
            this.assertEquals(this._linkDomElt.className, 'xLink_disabled', "Link should be in disabled state");
            this.synEvent.click(this._spanLink, {
                scope : this,
                fn : this._step2
            });
        },

        _step2 : function () {
            this.assertEquals(this._linkDomElt.className, 'xLink_std', "Link should be in active state");
            this._linkDomElt = null;
            this._spanLink = null;
            this.notifyTemplateTestEnd();
        }
    }
});
