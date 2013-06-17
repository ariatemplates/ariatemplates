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

/**
 * Verify the manual behavior of the loading indicator works correctly. No refreshes are done during the test
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.overlay.loadingIndicator.manual.ManualTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["test.aria.utils.overlay.loadingIndicator.IndicatorHelper", "aria.utils.DomOverlay"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this._envDomBody = {
            template : "test.aria.utils.overlay.loadingIndicator.manual.DomBody"
        };

        this._envDomInside = {
            template : "test.aria.utils.overlay.loadingIndicator.manual.DomInside"
        };

        this._envDomOutside = {
            template : "test.aria.utils.overlay.loadingIndicator.manual.DomOutside"
        };

        this._envSection = {
            template : "test.aria.utils.overlay.loadingIndicator.manual.Section"
        };

        this._envSectionBind = {
            template : "test.aria.utils.overlay.loadingIndicator.manual.SectionBind",
            data : {
                processing : false
            }
        };

        this._envTwice = {
            template : "test.aria.utils.overlay.loadingIndicator.manual.Twice"
        };

        this.helper = test.aria.utils.overlay.loadingIndicator.IndicatorHelper;

        this.setTestEnv(this._envDomBody);
    },
    $prototype : {
        runTemplateTest : function () {
            this._DomBody();
        },

        _DomBody : function () {
            var document = Aria.$window.document;
            // Check that it's not in the DOM
            this.assertFalse(this.helper.isInDom());

            // Put a loading indicator
            aria.utils.DomOverlay.create(document.body, "Some text");

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertTrue(this.helper.getText() === "Some text");

            // Remove it
            aria.utils.DomOverlay.detachFrom(document.body);

            // Check that it's removed
            this.assertFalse(this.helper.isInDom());

            // Add it again without text
            aria.utils.DomOverlay.create(document.body);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertFalse(!!this.helper.getText());

            // Remove it for the last time
            aria.utils.DomOverlay.detachFrom(document.body);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Go to the next test
            this._replaceTestTemplate(this._envDomInside, {
                fn : this._DomInside,
                scope : this
            });
        },

        _DomInside : function () {
            // Check that it's not in the DOM
            this.assertFalse(this.helper.isInDom());

            // Put a loading indicator
            var span = this.templateCtxt.$getElementById("spanOverlay");
            this.assertTrue(!!span.$DomElementWrapper);
            span.setProcessingIndicator(true, "Some text");

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertTrue(this.helper.getText() === "Some text");

            // Remove it
            span.setProcessingIndicator(false);

            // Check that it's removed
            this.assertFalse(this.helper.isInDom());

            // Add it again without text
            span.setProcessingIndicator(true);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertFalse(!!this.helper.getText());

            // Remove it for the last time
            span.setProcessingIndicator(false);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Do it again for an id inside a section
            this.assertFalse(this.helper.isInDom());

            // Put a loading indicator
            var div = this.templateCtxt.$getElementById("overlay0");
            this.assertTrue(!!div.$DomElementWrapper);
            div.setProcessingIndicator(true, "Some text");

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertTrue(this.helper.getText() === "Some text");

            // Remove it
            div.setProcessingIndicator(false);

            // Check that it's removed
            this.assertFalse(this.helper.isInDom());

            // Add it again without text
            div.setProcessingIndicator(true);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertFalse(!!this.helper.getText());

            // Remove it for the last time
            div.setProcessingIndicator(false);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Go to the next test
            this._replaceTestTemplate(this._envDomOutside, {
                fn : this._DomOutside,
                scope : this
            });
        },

        _DomOutside : function () {
            var document = Aria.$window.document;
            // Put a div outside aria templates
            var div = document.createElement("div");

            div.style.height = "100px";
            div.id = "outside";

            document.body.insertBefore(div, document.body.firstChild);

            // Check that it's not in the DOM
            this.assertFalse(this.helper.isInDom());

            // Put a loading indicator
            div = aria.utils.Dom.getElementById("outside");
            aria.utils.DomOverlay.create(div, "Some text");

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertTrue(this.helper.getText() === "Some text");

            // Remove it
            aria.utils.DomOverlay.detachFrom(div);

            // Check that it's removed
            this.assertFalse(this.helper.isInDom());

            // Add it again without text
            aria.utils.DomOverlay.create(div);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertFalse(!!this.helper.getText());

            // Remove it for the last time
            aria.utils.DomOverlay.detachFrom(div);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Remove the outside div
            div.parentNode.removeChild(div);

            // Go to the next test
            this._replaceTestTemplate(this._envSection, {
                fn : this._Section,
                scope : this
            });
        },

        _Section : function () {
            // Check that it's not in the DOM
            this.assertFalse(this.helper.isInDom());

            // Put a loading indicator
            var section = this.templateCtxt.$getElementById("s1");
            this.assertTrue(!!section.$SectionWrapper);
            section.setProcessingIndicator(true, "Some text");

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertTrue(this.helper.getText() === "Some text");

            // Remove it
            section.setProcessingIndicator(false);

            // Check that it's removed
            this.assertFalse(this.helper.isInDom());

            // Add it again without text
            section.setProcessingIndicator(true);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertFalse(!!this.helper.getText());

            // Remove it for the last time
            section.setProcessingIndicator(false);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Go to the next test
            this._replaceTestTemplate(this._envSectionBind, {
                fn : this._SectionBind,
                scope : this
            });
        },

        _SectionBind : function () {
            var data = this.templateCtxt.data;

            // Check that it's not in the DOM
            this.assertFalse(this.helper.isInDom());
            // Check also the value in the datamodel
            this.assertFalse(data.processing);

            // Put a loading indicator
            var section = this.templateCtxt.$getElementById("s2");
            this.assertTrue(!!section.$SectionWrapper);
            section.setProcessingIndicator(true, "Some text");
            this.assertTrue(data.processing);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertTrue(this.helper.getText() === "Some text");

            // Remove it
            section.setProcessingIndicator(false);
            this.assertFalse(data.processing);

            // Check that it's removed
            this.assertFalse(this.helper.isInDom());

            // Add it again without text
            section.setProcessingIndicator(true);
            this.assertTrue(data.processing);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());
            this.assertFalse(!!this.helper.getText());

            // Remove it for the last time
            section.setProcessingIndicator(false);
            this.assertFalse(data.processing);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Go to the next test
            this._replaceTestTemplate(this._envTwice, {
                fn : this._Twice,
                scope : this
            });
        },

        _Twice : function () {
            // Set and unset the process indicator twice on the same wrapper
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(false);
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(false);

            this.templateCtxt.$getElementById("d1").setProcessingIndicator(false);
            this.templateCtxt.$getElementById("d1").setProcessingIndicator(false);

            this.templateCtxt.$getElementById("s1").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(true);

            this.templateCtxt.$getElementById("d1").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("d1").setProcessingIndicator(true);

            // There should be only two loading indicators
            this.assertTrue(this.helper.countInDom() === 2);
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 2, "Overlays not disposed: " + overlays);

            this.notifyTemplateTestEnd();
        }
    }
});
