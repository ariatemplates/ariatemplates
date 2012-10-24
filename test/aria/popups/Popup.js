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
    $classpath : "test.aria.popups.Popup",
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
        testCreateAbsolutePopup : function () {
            var popup = new aria.popups.Popup();
            this.assertTrue(popup !== null);

            var conf = {
                // Content
                section : this.mockSection,
                preferredPositions : [{
                            reference : "bottom right",
                            popup : "top left"
                        }],
                absolutePosition : {
                    top : 200,
                    left : 500
                }
            };

            popup.open(conf);
            popup.close();
            popup.$dispose();
        },

        testCreateReferencePopup : function () {
            var document = Aria.$window.document;
            var popup = new aria.popups.Popup();
            var refDiv = document.createElement("div");
            refDiv.style.position = "absolute";
            refDiv.style.top = "30px";
            refDiv.style.height = "30px";
            refDiv.style.width = "30px";
            refDiv.style.display = "block";
            refDiv.style.left = "230px";
            refDiv.style.backgroundColor = "red";
            document.body.appendChild(refDiv);

            var conf = {
                // Content
                section : this.mockSection,
                domReference : refDiv,
                preferredPositions : [{
                            reference : "top right",
                            popup : "bottom left"
                        }],
                closeOnMouseOut : true
            };

            popup.open(conf);
            popup.close();
            popup.$dispose();

            document.body.removeChild(refDiv);
        },

        /**
         * test of positioning for an element in a scrollable area, in the document scrolled
         */
        testPopupPositioning : function () {
            var document = Aria.$window.document;
            var popup = new aria.popups.Popup();

            var bigContainer = document.createElement("div");
            bigContainer.style.width = "2000px";
            bigContainer.style.height = "2000px";
            bigContainer.style.overflow = "scroll";
            bigContainer.style.position = "absolute";
            bigContainer.style.top = "0px";
            bigContainer.style.left = "0px";
            document.body.appendChild(bigContainer);
            bigContainer.innerHTML = "<div id='subContainer' style='margin:100px;width:200px; height:200px;overflow:scroll'><div style='height:200px;'></div><div id='myTargetDiv' style='height:30px;background:green;'>&nbsp;</div><div style='height:200px;'></div></div>";
            var subContainer = document.getElementById('subContainer');

            subContainer.scrollTop = 100;

            var conf = {
                // Content
                section : this.mockSection,
                domReference : document.getElementById('myTargetDiv'),
                preferredPositions : [{
                            reference : "bottom left",
                            popup : "top left"
                        }],
                closeOnMouseOut : true
            };

            popup.open(conf);

            var popupContent = document.getElementById("myId");

            var top = parseInt(popupContent.parentNode.style.top, 10);
            this.assertTrue(top > 228, "Expected 230, found " + top);

            popup.close();
            popup.$dispose();

            document.body.removeChild(bigContainer);

        },

        /**
         * Make sure everything is unchanged for AriaJSP popup bridge
         */
        test_popupBridgeAPI : function () {
            this.assertTrue(!!aria.popups.PopupManager.connectModalEvents, "Missing bridge API");
            this.assertTrue(!!aria.popups.PopupManager.disconnectModalEvents, "Missing bridge API");

            var popup = new aria.popups.Popup();
            var conf = {
                // Content
                section : this.mockSection,
                modal : true,
                absolutePosition : {
                    top : 200,
                    left : 500
                }
            };

            var evtOpenRaised = false, evtCloseRaised = false;

            aria.popups.PopupManager.$on({
                "popupOpen" : function (evt) {
                    this.assertTrue(!!evt.popup, "Missing popup property in event");
                    evtOpenRaised = true;
                },
                "popupClose" : function (evt) {
                    this.assertTrue(!!evt.popup, "Missing popup property in event");
                    evtCloseRaised = true;
                },
                scope : this
            });

            popup.open(conf);

            this.assertTrue(!!popup.conf, "Missing property conf.");
            this.assertTrue(!!popup.domElement, "Missing property domElement.");
            this.assertTrue(!!popup.computedStyle.zIndex, "Missing property computedStyle.zInde.");
            this.assertTrue(!!popup.modalMaskDomElement, "Missing property modalMaskDomElement.");

            popup.close();

            this.assertTrue(evtOpenRaised, "Event popupOpen not raised");
            this.assertTrue(evtCloseRaised, "Event popupClose not raised");

            popup.$dispose();
        }

    }
});