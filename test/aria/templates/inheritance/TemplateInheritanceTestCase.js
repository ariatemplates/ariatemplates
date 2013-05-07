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

        myTestSimple : function () {
            // simple test to verify the inheritance of the main() macro
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "a = 1".toLowerCase());

            // test the inheritance of the template vars of the father
            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "b = 3".toLowerCase());

            // test the usability of parent macros through the reference to the parent template
            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].innerHTML);
            this.assertTrue(test3.toLowerCase() == "parent mymacro2".toLowerCase());

            // test parent macros inheritance without overriding
            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[3].innerHTML);
            this.assertTrue(test4.toLowerCase() == "parent mymacro3".toLowerCase());

            // test usability of functions in the script prototype
            var test5 = aria.utils.String.trim(this.testDiv.children[0].children[4].innerHTML);
            this.assertTrue(test5.toLowerCase() == "script works".toLowerCase());

            // test usability of the statics of the script
            var test6 = aria.utils.String.trim(this.testDiv.children[0].children[5].innerHTML);
            this.assertTrue(test6.toLowerCase() == "script static 5".toLowerCase());

            // test usability of the resources of the script
            var test7 = aria.utils.String.trim(this.testDiv.children[0].children[6].innerHTML);
            this.assertTrue(test7.toLowerCase() == "script resources red".toLowerCase());

            // test usability of the functions in the parent script prototype
            var test8 = aria.utils.String.trim(this.testDiv.children[0].children[7].innerHTML);
            this.assertTrue(test8.toLowerCase() == "myParentMethod called".toLowerCase());

            // test the correct overriding of script functions of the parent
            var test9 = aria.utils.String.trim(this.testDiv.children[0].children[8].innerHTML);
            this.assertTrue(test9.toLowerCase() == "childscript mymethod1".toLowerCase());

            // test the possibility of using the parent script functions through the reference to the parent template
            var test10 = aria.utils.String.trim(this.testDiv.children[0].children[9].innerHTML);
            this.assertTrue(test10.toLowerCase() == "parentscript mymethod1".toLowerCase());

            // test usability of the statics of the parent script
            var test11 = aria.utils.String.trim(this.testDiv.children[0].children[10].innerHTML);
            this.assertTrue(test11.toLowerCase() == "parentscript static 10".toLowerCase());

            // test usability of the resources of the parent script
            var test12 = aria.utils.String.trim(this.testDiv.children[0].children[11].innerHTML);
            this.assertTrue(test12.toLowerCase() == "parentscript resources austen".toLowerCase());

            // test usability of the resources of the parent template
            var test13 = aria.utils.String.trim(this.testDiv.children[0].children[12].innerHTML);
            this.assertTrue(test13.toLowerCase() == "parent res peter".toLowerCase());

            // test usability of the resources of the parent template throughthrough the reference to the parent
            // template
            var test14 = aria.utils.String.trim(this.testDiv.children[0].children[13].innerHTML);
            this.assertTrue(test14.toLowerCase() == "parent res tim".toLowerCase());

            // test that the parent resources can be overridden
            var test15 = aria.utils.String.trim(this.testDiv.children[0].children[14].innerHTML);
            this.assertTrue(test15.toLowerCase() == "overridden res james".toLowerCase());

            this._replaceTestTemplate(this._macrolibsEnv, {
                fn : this.myTestMacrolibs,
                scope : this
            });

        },
        myTestMacrolibs : function () {
            // verify the inheritance of the vars defined in the parent libraries
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "parentLibVar".toLowerCase());

            // verify the inheritance of the macros defined in the parent libraries
            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "libParent output".toLowerCase());

            // verify the inheritance of the scripts in the parent libraries scripts
            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].innerHTML);
            this.assertTrue(test3.toLowerCase() == "macroscript output".toLowerCase());

            // verify the overriding of parent libraries (which are ignored)
            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[3].innerHTML);
            this.assertTrue(test4.toLowerCase() == "LibChild2 output".toLowerCase());

            this._replaceTestTemplate(this._css1Env, {
                fn : this.myTestCss1,
                scope : this
            });
        },

        myTestCss1 : function () {
            // test that the child template css are applied correctly
            var test1 = this.getElementById("titleoneid");
            var style1 = aria.utils.Dom.getStyle(test1, "fontSize");
            this.assertTrue(style1.toLowerCase() == "2px".toLowerCase());

            // test that the parent template css are completely ignored
            var test2 = this.getElementById("titletwoid");
            var style2 = aria.utils.Dom.getStyle(test2, "fontSize");
            this.assertFalse(style2.toLowerCase() == "200px".toLowerCase());

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
            this.assertTrue(style1.toLowerCase() == "1px".toLowerCase());

            var test2 = this.getElementById("titletwoid");
            var style2 = aria.utils.Dom.getStyle(test2, "fontSize");
            this.assertTrue(style2.toLowerCase() == "200px".toLowerCase());

            this._replaceTestTemplate(this._familyEnv, {
                fn : this.myTestFamily,
                scope : this
            });
        },

        myTestFamily : function () {
            // test vars inheritance and overriding
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "varGP = 3".toLowerCase());
            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "b = 3".toLowerCase());

            // test macros inheritance and overriding
            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].innerHTML);
            this.assertTrue(test3.toLowerCase() == "mymacrograndparent".toLowerCase());
            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[3].innerHTML);
            this.assertTrue(test4.toLowerCase() == "parent mymacro3".toLowerCase());
            var test5 = aria.utils.String.trim(this.testDiv.children[0].children[4].innerHTML);
            this.assertTrue(test5.toLowerCase() == "parent mymacro2".toLowerCase());
            var test6 = aria.utils.String.trim(this.testDiv.children[0].children[5].innerHTML);
            this.assertTrue(test6.toLowerCase() == "child mymacro2".toLowerCase());

            // test resources
            var test7 = aria.utils.String.trim(this.testDiv.children[0].children[6].innerHTML);
            this.assertTrue(test7.toLowerCase() == "peter".toLowerCase());
            var test8 = aria.utils.String.trim(this.testDiv.children[0].children[7].innerHTML);
            this.assertTrue(test8.toLowerCase() == "james".toLowerCase());
            var test9 = aria.utils.String.trim(this.testDiv.children[0].children[8].innerHTML);
            this.assertTrue(test9.toLowerCase() == "tim".toLowerCase());
            var test10 = aria.utils.String.trim(this.testDiv.children[0].children[9].innerHTML);
            this.assertTrue(test10.toLowerCase() == "tim".toLowerCase());

            // test script methods
            var test11 = aria.utils.String.trim(this.testDiv.children[0].children[10].innerHTML);
            this.assertTrue(test11.toLowerCase() == "myGrandParentMethod called".toLowerCase());
            var test12 = aria.utils.String.trim(this.testDiv.children[0].children[11].innerHTML);
            this.assertTrue(test12.toLowerCase() == "childscript mymethod1".toLowerCase());
            var test13 = aria.utils.String.trim(this.testDiv.children[0].children[12].innerHTML);
            this.assertTrue(test13.toLowerCase() == "grandparentscript mymethod1".toLowerCase());
            var test14 = aria.utils.String.trim(this.testDiv.children[0].children[13].innerHTML);
            this.assertTrue(test14.toLowerCase() == "resources gide".toLowerCase());

            // test library inheritance
            var test15 = aria.utils.String.trim(this.testDiv.children[0].children[14].innerHTML);
            this.assertTrue(test15.toLowerCase() == "libGrandParent output".toLowerCase());
            var test16 = aria.utils.String.trim(this.testDiv.children[0].children[15].innerHTML);
            this.assertTrue(test16.toLowerCase() == "libChild output".toLowerCase());
            var test17 = aria.utils.String.trim(this.testDiv.children[0].children[16].innerHTML);
            this.assertTrue(test17.toLowerCase() == "macroscript output".toLowerCase());

            // test CSS inheritance
            var test18 = this.getElementById("titleoneid");
            var style18 = aria.utils.Dom.getStyle(test18, "fontSize");
            this.assertTrue(style18.toLowerCase() == "40px".toLowerCase());

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
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "first child width 140".toLowerCase());
            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[0].children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "first child height 85".toLowerCase());
            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].children[0].children[0].innerHTML);
            this.assertTrue(test3.toLowerCase() == "second child width 240".toLowerCase());
            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[2].children[0].children[1].innerHTML);
            this.assertTrue(test4.toLowerCase() == "second child height 105".toLowerCase());
            var test5 = aria.utils.String.trim(this.testDiv.children[0].children[4].children[0].children[0].innerHTML);
            this.assertTrue(test5.toLowerCase() == "third child width 240".toLowerCase());
            var test6 = aria.utils.String.trim(this.testDiv.children[0].children[4].children[0].children[1].innerHTML);
            this.assertTrue(test6.toLowerCase() == "third child height 85".toLowerCase());

            this._replaceTestTemplate(this._tmlInheritanceEnv, {
                fn : this.myTestTmlInheritance,
                scope : this
            });

        },

        myTestTmlInheritance : function () {
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "parentMacro from LibParent called".toLowerCase());
            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "overriddenMacro from LibParent called".toLowerCase());
            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].innerHTML);
            this.assertTrue(test3.toLowerCase() == "overriddenMacro from LibChild called".toLowerCase());

            this._replaceTestTemplate(this._cssTemplateInheritanceEnv, {
                fn : this.myTestCssTemplateInheritance,
                scope : this
            });
        },

        myTestCssTemplateInheritance : function () {
            var test1 = this.getElementById("cssinheritance");
            var style1 = aria.utils.Dom.getStyle(test1, "fontSize");
            this.assertTrue(style1.toLowerCase() == "80px".toLowerCase());
            var style2 = aria.utils.Dom.getStyle(test1, "fontWeight");
            this.assertTrue(parseInt(style2, 10) == 800);

            this._replaceTestTemplate(this._inheritanceOfTextEnv, {
                fn : this.myTestInheritanceOfText,
                scope : this
            });
        },

        myTestInheritanceOfText : function () {
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "parent text".toLowerCase());
            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "child overridden text".toLowerCase());

            this.end();
        }
    }
});
