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

Aria.classDefinition({
    $classpath : "test.aria.popups.PopupAnimationsTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.popups.Popup", "aria.templates.Section", "aria.popups.PopupManager"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.mockSection = {
            html : "<span id='myId'>test</span>",
            initWidgets : function () {},
            $unregisterListeners : function () {},
            removeContent : function () {},
            $dispose : function () {},
            refreshProcessingIndicator : function () {}
        };

    },
    $prototype : {

        /**
         * Make sure the right events are thrown, even if there is only one animation set
         */
        testAsync_checkEvents : function () {

            var browserVersion = parseInt(aria.core.Browser.version, 10);
            var cssAnimationsNotSupported = (aria.core.Browser.isOldIE && browserVersion < 10)
                    || (aria.core.Browser.isFirefox && browserVersion < 4);

            if (cssAnimationsNotSupported) {
                this.notifyTestEnd("testAsync_checkEvents");
                return;
            }

            this.eventsFired = [];
            var conf = {
                // Content
                section : this.mockSection,
                modal : true,
                absolutePosition : {
                    top : 200,
                    left : 500
                },
                animateIn : "slide right",
                animateOut : null
            };

            this.popup = new aria.popups.Popup();
            var popup = this.popup;
            popup.$on({
                "*" : function (evt) {
                    this.eventsFired.push(evt.name);
                },
                scope : this
            });

            this.assertEquals(this.eventsFired.length, 0);

            popup.open(conf);

            this.assertJsonEquals(["onBeforeOpen", "onPositioned"], this.eventsFired);
            // reset
            this.eventsFired = [];

            this.waitFor({
                condition : {
                    fn : this.checkEventFired,
                    scope : this
                },
                callback : {
                    fn : this.checkEventsArrayAfterOpen,
                    scope : this
                }
            });
        },

        checkEventFired : function () {
            return this.eventsFired.length > 0;
        },

        checkEventsArrayAfterOpen : function () {
            this.assertJsonEquals(["onAfterOpen"], this.eventsFired);
            this.eventsFired = [];
            this.popup.close();
            this.assertJsonEquals(["onBeforeClose", "onAfterClose"], this.eventsFired);
            this.popup.$dispose();
            this.eventsFired = null;
            this.notifyTestEnd("testAsync_checkEvents");

        }

    }
});
