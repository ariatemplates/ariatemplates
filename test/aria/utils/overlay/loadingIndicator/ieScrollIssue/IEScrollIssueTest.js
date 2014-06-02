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
    $classpath : "test.aria.utils.overlay.loadingIndicator.ieScrollIssue.IEScrollIssueTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.utils.overlay.loadingIndicator.ieScrollIssue.TestTemplate",
            iframe : true
        });
    },
    $prototype : {

        runTemplateTest : function () {
            this.scrollList = [80, 30, 130];
            this.index = 0;
            this.domElt = this.getElementById("mySpan");
            this.domEltWrapper = this.templateCtxt.$getElementById("mySpan");
            this.container = this.templateCtxt.$getElementById("container");

            this.domEltWrapper.setProcessingIndicator(true, "*** Loading span content...");
            this.overlay = this._getOverlay();
            this.overlayElt = this.overlay.overlay;

            this._checkSameGeometry();

            this._scrollAndCheck();
        },

        _scrollAndCheck : function () {
            if (this.index < this.scrollList.length) {
                this.container.setScroll({
                    scrollTop : this.scrollList[this.index]
                });
                this.index++;
                this._checkAndCallback(this._scrollAndCheck);
            } else {

                this.domEltWrapper.setProcessingIndicator(false);

                this.executed = false;

                var that = this;
                var refreshFn = this.overlay.refreshPosition;

                this.testWindow.aria.utils.overlay.Overlay.prototype.refreshPosition = function () {
                    that.executed = true;
                    return refreshFn.apply(this, arguments);
                };

                this.domEltWrapper.setProcessingIndicator(true, "*** Loding span content...");

                this.container.setScroll({
                    scrollTop : 91
                });

                aria.core.Timer.addCallback({
                    fn : this._checkCnt1,
                    scope : this,
                    delay : 100
                });

            }
        },

        _checkCnt1 : function () {
            this.assertTrue(this.executed, "refresh callback not executed");
            this.executed = false;
            this.domEltWrapper.setProcessingIndicator(false);

            this.container.setScroll({
                scrollTop : 201
            });

            aria.core.Timer.addCallback({
                fn : this._checkCnt2,
                scope : this,
                delay : 100
            });
        },

        _checkCnt2 : function () {
            this.assertFalse(this.executed, "refresh callback executed after overlay detach");
            this.end();
        },

        _checkAndCallback : function (fn) {
            // timeout is necessary because onscroll function execution is async
            aria.core.Timer.addCallback({
                fn : this._checkSameGeometry,
                scope : this,
                delay : 100,
                args : {
                    fn : fn
                }
            });
        },

        _checkSameGeometry : function (arg) {
            var geoElt = this.testWindow.aria.utils.Dom.getGeometry(this.domElt);
            var geoOvl = this.testWindow.aria.utils.Dom.getGeometry(this.overlayElt);
            var json = aria.utils.Json;
            this.assertJsonEquals(geoElt, geoOvl, "Overlay and element geometry are different: overlay=" + json.convertToJsonString(geoOvl) + ", element=" + json.convertToJsonString(geoElt));
            if (arg) {
                aria.core.Timer.addCallback({
                    fn : arg.fn,
                    scope : this
                });
            }
        },

        _getOverlay : function () {
            var overlays = this.testWindow.aria.utils.DomOverlay.overlays;
            var keys = aria.utils.Object.keys(overlays);
            return overlays[keys[0]];
        }

    }
});
