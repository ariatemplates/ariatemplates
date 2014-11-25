/*
 * Copyright 2014 Amadeus s.a.s.
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
 * This is the base class for tests which check that the overlay is correctly created, moved and disposed along with the
 * element it is attached to.
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.overlay.loadingIndicator.ieScrollIssue2.IEScrollIssue2Base",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.DomOverlay", "aria.utils.Object", "aria.utils.overlay.Overlay"],
    $prototype : {

        setUp : function () {
            var self = this;
            this._trueRefreshPosition = aria.utils.overlay.Overlay.prototype.refreshPosition;
            aria.utils.overlay.Overlay.prototype.refreshPosition = function () {
                self.refreshPositionCalled++;
                return self._trueRefreshPosition.apply(this, arguments);
            };
        },

        tearDown : function () {
            aria.utils.overlay.Overlay.prototype.refreshPosition = this._trueRefreshPosition;
        },

        runTemplateTest : function () {
            this.refreshPositionCalled = 0;
            this.templateCtxt.$getElementById("mySpan").setProcessingIndicator(true, "Loading...");
            this.assertSameGeometry(this.getElementById("mySpan"), this.getUniqueOverlay());
            this.getElementById("container").scrollTop = 50;
            this.waitFor({
                condition : function () {
                    return this.refreshPositionCalled === 1;
                },
                callback : this._step1
            });
        },

        _step1 : function () {
            this.assertEquals(this.refreshPositionCalled, 1);
            this.refreshPositionCalled = 0;
            this.assertEquals(this.getElementById("container").scrollTop, 50);
            this.assertSameGeometry(this.getElementById("mySpan"), this.getUniqueOverlay());
            var tpl = this.templateCtxt._tpl;
            tpl.$json.setValue(tpl.data, "isHidden", true);
            this.waitFor({
                condition : function () {
                    return this.getElementById("mySpan") == null;
                },
                callback : this._step2
            });
        },

        _step2 : function () {
            this.assertNull(this.getElementById("mySpan"));
            var tpl = this.templateCtxt._tpl;
            tpl.$json.setValue(tpl.data, "isHidden", false);
            this.waitFor({
                condition : function () {
                    return this.getElementById("mySpan") != null;
                },
                callback : this._step3
            });
        },

        _step3 : function () {
            this.assertNotNull(this.getElementById("mySpan"));
            this.getElementById("container").scrollTop = 75;
            this.waitFor({
                condition : function () {
                    return this.refreshPositionCalled === 0;
                },
                callback : this._step4
            });
        },

        _step4 : function () {
            this.assertEquals(this.refreshPositionCalled, 0);
            var container = this.getElementById("container");
            this.assertEquals(container.scrollTop, 75);
            this.templateCtxt.$getElementById("mySpan").setProcessingIndicator(true, "Loading...");
            this.assertSameGeometry(this.getElementById("mySpan"), this.getUniqueOverlay());
            container.scrollTop = 25;
            this.waitFor({
                condition : function () {
                    return this.refreshPositionCalled === 1;
                },
                callback : this._step5
            });
        },

        _step5 : function () {
            this.assertEquals(this.refreshPositionCalled, 1);
            this.assertEquals(this.getElementById("container").scrollTop, 25);
            this.assertSameGeometry(this.getElementById("mySpan"), this.getUniqueOverlay());
            this.end();
        },

        getUniqueOverlay : function () {
            var overlays = aria.utils.DomOverlay.overlays;
            var keys = aria.utils.Object.keys(overlays);
            this.assertEquals(keys.length, 1);
            return overlays[keys[0]].overlay;
        },

        assertSameGeometry : function (elt1, elt2) {
            var geom1 = aria.utils.Dom.getGeometry(elt1);
            var geom2 = aria.utils.Dom.getGeometry(elt2);
            this.assertJsonEquals(geom1, geom2);
        }
    }
});
