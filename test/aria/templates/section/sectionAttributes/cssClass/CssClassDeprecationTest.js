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
/* BACKWARD-COMPATIBILITY-BEGIN (cssclass) */
// This class must be completely deleted when the cssClass feature is completely removed
Aria.classDefinition({
    $classpath : "test.aria.templates.section.sectionAttributes.cssClass.CssClassDeprecationTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.$constructor.call(this);
        this.testData = {
            sectionTwo : {
                attributes : {
                    lang : "en"
                }
            },
            sectionThree : {
                attributes : {
                    lang : "en",
                    classList : ["classFour", "classFive"]
                }
            },
            sectionFour : {
                attributes : {
                    lang : "en",
                    classList : ["classSix", "classSeven"]
                }
            },
            sectionFive : {
                attributes : null
            },
            sectionSix : {
                attributes : {
                    lang : "en"
                }
            }
        };

        this._listenerOne = {
            fn : this._onAttributeChange,
            scope : this,
            args : "sectionFive"
        };

        this._listenerTwo = {
            fn : this._onAttributeChange,
            scope : this,
            args : "sectionSixRecursive"
        };

        this._listenerThree = {
            fn : this._onAttributeChange,
            scope : this,
            args : "sectionSixNonRecursive"
        };

        this._notifiedDataChanges = {
            sectionFive : 0,
            sectionSixRecursive : 0,
            sectionSixNonRecursive : 0
        };

        var jsonUtil = aria.utils.Json;

        jsonUtil.addListener(this.testData.sectionFive, "attributes", this._listenerOne);
        jsonUtil.addListener(this.testData.sectionSix, "attributes", this._listenerTwo, false, true);
        jsonUtil.addListener(this.testData.sectionSix, "attributes", this._listenerThree);

        this.setTestEnv({
            data : this.testData
        });

    },
    $destructor : function () {
        var jsonUtil = aria.utils.Json;
        jsonUtil.removeListener(this.testData.sectionFive, "attributes", this._listenerOne);
        jsonUtil.removeListener(this.testData.sectionSix, "attributes", this._listenerTwo, false, true);
        jsonUtil.removeListener(this.testData.sectionSix, "attributes", this._listenerThree);
        this._listenerOne = null;
        this._listenerTwo = null;
        this._listenerThree = null;

        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.assertErrorInLogs(aria.templates.Section.DEPRECATED_CSSCLASS, 6);

            // just cssClass
            this._checkCssClasses("sectionOne", "classOne classTwo classThree");

            // cssClass and non-conflicting attributes. check that attributes are correctly updated
            this._checkCssClasses("sectionTwo", "classOne classTwo classThree");
            this.assertEquals(this.testData.sectionTwo.attributes.classList.join(" "), "classOne classTwo classThree");

            // cssClass and conflicting attributes. check that attributes are not updated
            this._checkCssClasses("sectionThree", "classFour classFive");
            this.assertEquals(this.testData.sectionThree.attributes.classList.join(" "), "classFour classFive");

            // cssClass and conflicting binding
            this._checkCssClasses("sectionFour", "classSix classSeven");
            this.assertEquals(this.testData.sectionFour.attributes.classList.join(" "), "classSix classSeven");

            // cssClass and non-conflicting binding to null
            this._checkCssClasses("sectionFive", "classOne classTwo classThree");
            this.assertEquals(this.testData.sectionFive.attributes.classList.join(" "), "classOne classTwo classThree");
            this.assertEquals(this._notifiedDataChanges.sectionFive, 1, "Listeners have not been called on classList update");

            // cssClass and non-conflicting binding to a non-empty object
            this._checkCssClasses("sectionSix", "classOne classTwo classThree");
            this.assertEquals(this.testData.sectionSix.attributes.classList.join(" "), "classOne classTwo classThree");
            this.assertEquals(this._notifiedDataChanges.sectionSixRecursive, 1, "Listeners have not been called on classList update");
            this.assertEquals(this._notifiedDataChanges.sectionSixNonRecursive, 0, "A non-recursive listeners have erroneously been called");

            this.end();
        },

        _checkCssClasses : function (sectionId, className) {
            var wrapper = this.templateCtxt.$getElementById(sectionId);
            this.assertEquals(wrapper.classList.getClassName(), className, "Css classes have not been correctly set on the section wrapper");
            var sectionDom = this.getElementById(sectionId);
            this.assertEquals(sectionDom.className, className, "Css classes have not been correctly set on the section HTML element");
        },

        _onAttributeChange : function (change, label) {
            this._notifiedDataChanges[label]++;
        }
    }
});
/* BACKWARD-COMPATIBILITY-END (cssclass) */