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
    $classpath : "test.aria.templates.inheritance.TemplateInheritanceTestCase",
    $dependencies : ["aria.templates.BaseCtxt"],
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._simpleEnv = {
            template : "test.aria.templates.inheritance.simple.ChildTemplate",
            data : {
                One : 1
            }
        };
        this._macrolibsEnv = {
            template : "test.aria.templates.inheritance.macrolibs.ChildTemplate"
        };
        this._css1Env = {
            template : "test.aria.templates.inheritance.css.ChildTemplate"
        };
        this._css2Env = {
            template : "test.aria.templates.inheritance.css.SecondChildTemplate"
        };
        this._familyEnv = {
            template : "test.aria.templates.inheritance.family.ChildTemplate"
        };
        this._errorsEnv = {
            template : "test.aria.templates.inheritance.errors.ChildTemplate"
        };
        this._dimensionsEnv = {
            template : "test.aria.templates.inheritance.dimensions.MainTemplate"
        };
        this._tmlInheritanceEnv = {
            template : "test.aria.templates.inheritance.tmlInheritance.MainTemplate"
        };
        this._cssTemplateInheritanceEnv = {
            template : "test.aria.templates.inheritance.cssTemplateInheritance.MainTemplate"
        };
        this._inheritanceOfTextEnv = {
            template : "test.aria.templates.inheritance.inheritanceOfText.ChildTemplate"
        };

        this.setTestEnv(this._simpleEnv);
    },
    $prototype : {
        runTemplateTest : function () {
            this.myTestSimple();
        },

        _checkDivContent : function (divNumber, expectedValue) {
            var content = aria.utils.String.trim(this.testDiv.children[0].children[divNumber].innerHTML);
            this.assertEquals(content.toLowerCase(), expectedValue.toLowerCase());
        },

        myTestSimple : function () {
            // simple test to verify the inheritance of the main() macro
            this._checkDivContent(0, "a = 1");

            // test the inheritance of the template vars of the father
            this._checkDivContent(1, "b = 3");

            // test the usability of parent macros through the reference to the parent template
            this._checkDivContent(2, "parent mymacro2");

            // test parent macros inheritance without overriding
            this._checkDivContent(3, "parent mymacro3");

            // test usability of functions in the script prototype
            this._checkDivContent(4, "script works");

            // test usability of the statics of the script
            this._checkDivContent(5, "script static 5");

            // test usability of the resources of the script
            this._checkDivContent(6, "script resources red");

            // test usability of the functions in the parent script prototype
            this._checkDivContent(7, "myParentMethod called");

            // test the correct overriding of script functions of the parent
            this._checkDivContent(8, "childscript mymethod1");

            // test the possibility of using the parent script functions through the reference to the parent template
            this._checkDivContent(9, "parentscript mymethod1");

            // test usability of the statics of the parent script
            this._checkDivContent(10, "parentscript static 10");

            // test usability of the resources of the parent script
            this._checkDivContent(11, "parentscript resources austen");

            // test usability of the resources of the parent template
            this._checkDivContent(12, "parent res peter");

            // test usability of the resources of the parent template throughthrough the reference to the parent
            // template
            this._checkDivContent(13, "parent res tim");

            // test that the parent resources can be overridden
            this._checkDivContent(14, "overridden res james");

            this._replaceTestTemplate(this._macrolibsEnv, {
                fn : this.myTestMacrolibs,
                scope : this
            });

        },
        myTestMacrolibs : function () {
            // verify the inheritance of the vars defined in the parent libraries
            this._checkDivContent(0, "parentLibVar");

            // verify the inheritance of the macros defined in the parent libraries
            this._checkDivContent(1, "libParent output");

            // verify the inheritance of the scripts in the parent libraries scripts
            this._checkDivContent(2, "macroscript output");

            // verify the overriding of parent libraries (which are ignored)
            this._checkDivContent(3, "LibChild2 output");

            this._replaceTestTemplate(this._css1Env, {
                fn : this.myTestCss1,
                scope : this
            });
        },

        myTestCss1 : function () {
            // test that the child template css are applied correctly
            var test1 = this.getElementById("titleoneid");
            var style1 = aria.utils.Dom.getStyle(test1, "fontSize");
            this.assertEquals(style1, "2px");

            // test that the parent template css are completely ignored
            var test2 = this.getElementById("titletwoid");
            var style2 = aria.utils.Dom.getStyle(test2, "fontSize");
            this.assertNotEquals(style2, "200px");

            this._replaceTestTemplate(this._css2Env, {
                fn : this.myTestCss2,
                scope : this
            });

        },

        myTestCss2 : function () {
            // test that the parent template css are inherited when the child
            // has no css template associated to it
            var test1 = this.getElementById("titleoneid");
            var style1 = aria.utils.Dom.getStyle(test1, "fontSize");
            this.assertEquals(style1, "1px");

            var test2 = this.getElementById("titletwoid");
            var style2 = aria.utils.Dom.getStyle(test2, "fontSize");
            this.assertEquals(style2, "200px");

            this._replaceTestTemplate(this._familyEnv, {
                fn : this.myTestFamily,
                scope : this
            });
        },

        myTestFamily : function () {
            // test vars inheritance and overriding
            this._checkDivContent(0, "varGP = 3");
            this._checkDivContent(1, "b = 3");

            // test macros inheritance and overriding
            this._checkDivContent(2, "mymacrograndparent");
            this._checkDivContent(3, "parent mymacro3");
            this._checkDivContent(4, "parent mymacro2");
            this._checkDivContent(5, "child mymacro2");

            // test resources
            this._checkDivContent(6, "peter");
            this._checkDivContent(7, "james");
            this._checkDivContent(8, "tim");
            this._checkDivContent(9, "tim");

            // test script methods
            this._checkDivContent(10, "myGrandParentMethod called");
            this._checkDivContent(11, "childscript mymethod1");
            this._checkDivContent(12, "grandparentscript mymethod1");
            this._checkDivContent(13, "resources gide");

            // test library inheritance
            this._checkDivContent(14, "libGrandParent output");
            this._checkDivContent(15, "libChild output");
            this._checkDivContent(16, "macroscript output");

            // test CSS inheritance
            var test18 = this.getElementById("titleoneid");
            var style18 = aria.utils.Dom.getStyle(test18, "fontSize");
            this.assertEquals(style18, "40px");

            this._replaceTestTemplate(this._errorsEnv, {
                fn : this.myTestErrors,
                scope : this
            });
        },

        myTestErrors : function () {
            this.assertErrorInLogs(aria.core.TplClassLoader.MISSING_TPLSCRIPTDEFINITION, 2);
            this.assertErrorInLogs(aria.templates.BaseCtxt.TEMPLATE_CONSTR_ERROR);

            this._replaceTestTemplate(this._dimensionsEnv, {
                fn : this.myTestDimensions,
                scope : this
            });
        },

        myTestDimensions : function () {
            var test1 = this.testDiv.children[0].children[0].children[0].children[0].innerHTML;
            this.assertEquals(test1, "first child width 140");
            var test2 = this.testDiv.children[0].children[0].children[0].children[1].innerHTML;
            this.assertEquals(test2, "first child height 85");
            var test3 = this.testDiv.children[0].children[2].children[0].children[0].innerHTML;
            this.assertEquals(test3, "second child width 240");
            var test4 = this.testDiv.children[0].children[2].children[0].children[1].innerHTML;
            this.assertEquals(test4, "second child height 105");
            var test5 = this.testDiv.children[0].children[4].children[0].children[0].innerHTML;
            this.assertEquals(test5, "third child width 240");
            var test6 = this.testDiv.children[0].children[4].children[0].children[1].innerHTML;
            this.assertEquals(test6, "third child height 85");

            this._replaceTestTemplate(this._tmlInheritanceEnv, {
                fn : this.myTestTmlInheritance,
                scope : this
            });

        },

        myTestTmlInheritance : function () {
            this._checkDivContent(0, "parentMacro from LibParent called");
            this._checkDivContent(1, "overriddenMacro from LibParent called");
            this._checkDivContent(2, "overriddenMacro from LibChild called");

            this._replaceTestTemplate(this._cssTemplateInheritanceEnv, {
                fn : this.myTestCssTemplateInheritance,
                scope : this
            });
        },

        myTestCssTemplateInheritance : function () {
            var test1 = this.getElementById("cssinheritance");
            var style1 = aria.utils.Dom.getStyle(test1, "fontSize");
            this.assertEquals(style1, "80px");
            var style2 = aria.utils.Dom.getStyle(test1, "fontWeight");
            this.assertEquals(parseInt(style2, 10), 800);

            this._replaceTestTemplate(this._inheritanceOfTextEnv, {
                fn : this.myTestInheritanceOfText,
                scope : this
            });
        },

        myTestInheritanceOfText : function () {
            this._checkDivContent(0, "parent text");
            this._checkDivContent(1, "child overridden text");

            this.end();
        }
    }
});
