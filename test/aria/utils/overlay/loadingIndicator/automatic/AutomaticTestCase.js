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
 * Verify the automatic behavior of the loading indicator works correctly. During the test there are template refreshes
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.overlay.loadingIndicator.automatic.AutomaticTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["test.aria.utils.overlay.loadingIndicator.IndicatorHelper", "aria.utils.DomOverlay",
            "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this._envBody = {
            template : "test.aria.utils.overlay.loadingIndicator.automatic.Body",
            data : {
                countRefresh : 0
            }
        };

        this._envBindings = {
            template : "test.aria.utils.overlay.loadingIndicator.automatic.Bindings",
            data : {
                parentSections : false,
                subSection : false,
                countRefresh : 0
            }
        };

        this._envNasty = {
            template : "test.aria.utils.overlay.loadingIndicator.automatic.Nasty",
            data : {
                bindHere : false,
                countRefresh : 0
            }
        };

        this.helper = test.aria.utils.overlay.loadingIndicator.IndicatorHelper;

        this.setTestEnv(this._envBody);
    },
    $prototype : {
        runTemplateTest : function () {
            this._Body();
        },

        __getSubTemplateContext : function () {
            // Go backward because I think that the template widget is at the end
            for (var i = this.templateCtxt._mainSection._content.length; i--;) {
                var content = this.templateCtxt._mainSection._content[i];

                if (content._type === 1 && content.behavior.$Template) { // TYPE_BEHAVIOR
                    return content.behavior.subTplCtxt;
                }
            }
        },

        __getSubTemplateSectionWrapper : function (name) {
            var context = this.__getSubTemplateContext();

            if (context) {
                return context.$getElementById(name);
            }
        },

        _Body : function () {
            var document = Aria.$window.document;
            // Put a loading indicator on the body
            aria.utils.DomOverlay.create(document.body);
            // Check the refresh
            var countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "0");
            countRefresh = null;

            // Check that now it's in the DOM
            this.assertTrue(this.helper.isInDom());

            // Call a refresh on the template
            this.templateCtxt.data.countRefresh += 1;
            this.templateCtxt.$refresh();
            // Check the refresh
            countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "1");
            countRefresh = null;

            // Check that it's still in the DOM
            this.assertTrue(this.helper.isInDom());

            // Call a partial refresh
            this.templateCtxt.data.countRefresh += 1;
            this.templateCtxt.$refresh({
                filterSection : "s2"
            });

            // Check that it's still in the DOM
            this.assertTrue(this.helper.isInDom());
            // Check the refresh
            countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "1"); // it was a partial refresh
            countRefresh = null;

            // Remove it
            aria.utils.DomOverlay.detachFrom(document.body);

            // Check that it's removed
            this.assertFalse(this.helper.isInDom());

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Go to the next test (there is no need to change the environment for this test)
            this.templateCtxt.data.countRefresh = 0;
            this._Section();
        },

        _Section : function () {
            var document = Aria.$window.document;
            // Put a div outside aria templates
            var div = document.createElement("div");

            div.style.height = "100px";
            div.id = "outside";

            document.body.insertBefore(div, document.body.firstChild);

            // Put a loading indicator on all the elements except the body
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("s2").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("d1").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("d2").setProcessingIndicator(true);
            aria.utils.DomOverlay.create(div);
            var subsection = this.__getSubTemplateSectionWrapper("subSection");
            subsection.setProcessingIndicator(true);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.countInDom() === 6);

            // Call a refresh on the template
            this.templateCtxt.data.countRefresh += 1;
            this.templateCtxt.$refresh();
            // Check the refresh
            var countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "1");
            countRefresh = null;

            // Check that the only indicator is the one outside of AT
            this.assertTrue(this.helper.countInDom() === 1);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 1, "Overlays not disposed: " + overlays);

            // Put again loading a indicator on all the elements including the body
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("s2").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("d1").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("d2").setProcessingIndicator(true);
            aria.utils.DomOverlay.create(div);
            subsection = this.__getSubTemplateSectionWrapper("subSection");
            subsection.setProcessingIndicator(true);
            aria.utils.DomOverlay.create(document.body);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.countInDom() === 7);

            // Call a partial refresh
            this.templateCtxt.data.countRefresh += 1;
            this.templateCtxt.$refresh({
                filterSection : "s2"
            });

            // Check the refresh
            countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "1"); // it was a partial refresh
            countRefresh = null;

            // The overlay in the DOM sould be
            // - body
            // - outside of AT
            // - s1
            // - subSection
            // the others should be destroyed after a refresh ?
            this.assertTrue(this.helper.countInDom() === 4);

            // Destroy it
            aria.utils.DomOverlay.detachFrom(document.body);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 3, "Overlays not disposed: " + overlays);

            // Destroy all of them
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(false);
            subsection = this.__getSubTemplateSectionWrapper("subSection");
            subsection.setProcessingIndicator(false);
            aria.utils.DomOverlay.detachFrom(div);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Remove the outside div
            div.parentNode.removeChild(div);

            // Go to the next test
            this.templateCtxt.data.countRefresh = 0;
            this._replaceTestTemplate(this._envBindings, {
                fn : this._SectionBind,
                scope : this
            });
        },

        _SectionBind : function () {
            // Put a loading indicator on all the sections (s1 and s2 are bound to the same value)
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(true);

            // There should be two indicator already
            this.assertTrue(this.helper.countInDom() === 2);

            // This one should do nothing, the indicator is already there
            this.templateCtxt.$getElementById("s2").setProcessingIndicator(true);

            var subsection = this.__getSubTemplateSectionWrapper("subSection");
            subsection.setProcessingIndicator(true);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.countInDom() === 3);
            // The check on the value in the data model is already done in manual test

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 3, "Overlays not disposed: " + overlays);

            // Call a refresh on the template
            this.templateCtxt.data.countRefresh += 1;
            this.templateCtxt.$refresh();
            // Check the refresh
            var countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "1");
            countRefresh = null;

            // Check that the indicators are still there
            this.assertTrue(this.helper.countInDom() === 3);

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 3, "Overlays not disposed: " + overlays);

            // Close them
            subsection = this.__getSubTemplateSectionWrapper("subSection");
            subsection.setProcessingIndicator(false);

            // This should close also the indicator on s1
            this.templateCtxt.$getElementById("s2").setProcessingIndicator(false);

            // Check that there are no overlays
            this.assertFalse(this.helper.isInDom());

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Close also s1 that shouldn't give errors
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(false);

            // Put again loading a indicator on all the sections
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(true);
            this.templateCtxt.$getElementById("s2").setProcessingIndicator(true);
            subsection = this.__getSubTemplateSectionWrapper("subSection");
            subsection.setProcessingIndicator(true);

            // Check that now it's in the DOM
            this.assertTrue(this.helper.countInDom() === 3);

            // Call a partial refresh
            this.templateCtxt.data.countRefresh += 1;
            this.templateCtxt.$refresh({
                filterSection : "s2"
            });

            // Check the refresh
            countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "1"); // it was a partial refresh
            countRefresh = null;

            // Check that the overlays are still there
            this.assertTrue(this.helper.countInDom() === 3);

            // Destroy them
            subsection = this.__getSubTemplateSectionWrapper("subSection");
            subsection.setProcessingIndicator(false);

            // This should close also the indicator on s2
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(false);

            // Check that there are no overlays
            this.assertFalse(this.helper.isInDom());

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // Go to the next test
            this.templateCtxt.data.countRefresh = 0;
            this._replaceTestTemplate(this._envNasty, {
                fn : this._Nasty,
                scope : this
            });
        },

        _Nasty : function () {
            // Try a combination of nasty bindings
            this.templateCtxt.$getElementById("s1").setProcessingIndicator(true);

            // Four sections are bound
            this.assertTrue(this.helper.countInDom() === 4);

            // Call a refresh on the template
            this.templateCtxt.data.countRefresh += 1;
            this.templateCtxt.$refresh();
            // Check the refresh
            var countRefresh = aria.utils.Dom.getElementById("countRefresh");
            this.assertTrue(countRefresh.innerHTML === "1");
            countRefresh = null;

            // The four sections should still be loading
            this.assertTrue(this.helper.countInDom() === 4);
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 4, "Overlays not disposed: " + overlays);

            // Close one that was not opened directly
            this.templateCtxt.$getElementById("s4").setProcessingIndicator(false);

            // The four sections should be disposed
            this.assertFalse(this.helper.isInDom());

            // Check for leaks
            var overlays = this.helper.totalOverlays();
            this.assertTrue(overlays === 0, "Overlays not disposed: " + overlays);

            // End of tests
            this.notifyTemplateTestEnd();
        }
    }
});
