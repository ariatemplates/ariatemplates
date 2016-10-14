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
    $classpath : "test.aria.widgets.action.link.disabled.LinkDisabledRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom", "aria.widgets.AriaSkinNormalization"],
    $prototype : {

        setUp : function () {
            var linkSkin = aria.widgets.AriaSkin.skinObject.Link;
            delete linkSkin["aria:skinNormalized"];
            linkSkin.alternative = {
                states: {
                    normal: {
                        color: "#6365ff"
                    }
                },
                disabledColor: "#707070"
            };
            // makes sure the disabledColor value is different between sclass:
            linkSkin.std.disabledColor = "#303030";
            aria.widgets.AriaSkinNormalization.normalizeWidget("Link", linkSkin);
        },

        clickAll : function (cb) {
            var items = [this._link1DomElt, this._link2DomElt, this._toggleDisabledElt];
            var next = function () {
                var item = items.shift();
                if (item) {
                    this.synEvent.click(item, {
                        scope: this,
                        fn: next
                    });
                } else {
                    cb.call(this);
                }
            };
            next.call(this);
        },

        runTemplateTest : function () {
            this._link1DomElt = this.getLink("link1");
            this._link2DomElt = this.getLink("link2");
            this._toggleDisabledElt = this.getElementById("toggleDisabled");

            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber1, 0);
            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber2, 0);

            this.assertFalse(/xLink_disabled/.test(this._link1DomElt.className), "Link 1 should not be in disabled state");
            this.checkRefColor(this._link1DomElt, "stdNormalColor");
            this.assertTrue(/xLink_disabled/.test(this._link2DomElt.className), "Link 2 should be in disabled state");
            this.checkRefColor(this._link2DomElt, "alternativeDisabledColor");

            this.clickAll(this._step1);
        },

        _step1 : function () {
            // only clicks on the previously enabled element are taken into account:
            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber1, 1);
            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber2, 0);

            this.assertTrue(/xLink_disabled/.test(this._link1DomElt.className), "Link 1 should be in disabled state");
            this.checkRefColor(this._link1DomElt, "stdDisabledColor");
            this.assertFalse(/xLink_disabled/.test(this._link2DomElt.className), "Link 2 should be in disabled state");
            this.checkRefColor(this._link2DomElt, "alternativeNormalColor");

            this.clickAll(this._step2);
        },

        _step2 : function () {
            // only clicks on the previously enabled element are taken into account:
            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber1, 1);
            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber2, 1);

            this.assertFalse(/xLink_disabled/.test(this._link1DomElt.className), "Link 1 should not be in disabled state");
            this.checkRefColor(this._link1DomElt, "stdNormalColor");
            this.assertTrue(/xLink_disabled/.test(this._link2DomElt.className), "Link 2 should be in disabled state");
            this.checkRefColor(this._link2DomElt, "alternativeDisabledColor");

            this.clickAll(this._step3);
        },

        _step3 : function () {
            // only clicks on the enabled element are taken into account:
            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber1, 2);
            this.assertEquals(this.templateCtxt._tpl.data.clicksNumber2, 1);

            this._link1DomElt = null;
            this._link2DomElt = null;
            this._toggleDisabledElt = null;
            this.notifyTemplateTestEnd();
        },

        checkRefColor : function (domElt, refColorId) {
            var refColorElt = this.getElementById(refColorId);
            var expectedColor = aria.utils.Dom.getStyle(refColorElt, "color");
            var foundColor = aria.utils.Dom.getStyle(domElt, "color");
            this.assertEquals(foundColor, expectedColor);
        }
    }
});
