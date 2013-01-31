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
    $classpath : "test.aria.templates.sectionTest.RefreshSection",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.sectionTest.SectionXTpl"
        });
        this.attributes = [{
                    name : 'name',
                    value : 'change section name'
                }, {
                    name : 'title',
                    value : 'change section title'
                }];
    },

    $prototype : {
        runTemplateTest : function () {
            this._checkSectionAttributes();
            this.refreshSectionAttributes();
        },
        /**
         * This method tests the refreshing of section attributes.
         */
        refreshSectionAttributes : function () {
            this.attributes = [{
                        name : 'name',
                        value : 'change section name'
                    }, {
                        name : 'dir',
                        value : 'new dir'
                    }];
            this.templateCtxt._tpl.changeAllSectionAttributes();
            this._checkSectionAttributes();
            this.attributes = [{
                        name : 'name',
                        value : 'change section name'
                    }, {
                        name : 'title',
                        value : 'my new title'
                    }, {
                        name : 'dir',
                        value : 'new dir'
                    }];
            this.templateCtxt._tpl.changeIndividualSectionAttribute();
            this._checkSectionAttributes();
            this._end();
        },
        _checkSectionAttributes : function () {
            // check attributes
            var domElt = this.getElementById('sectionx');
            for (var h = 0; h < this.attributes.length; h++) {
                this._checkAttribute(this.attributes[h].name, this.attributes[h].value, domElt);
            }
        },
        _checkAttribute : function (name, value, domElt) {
            var attributeValue = domElt.getAttribute(name);
            this.assertEquals(value, attributeValue);
        },
        _end : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
