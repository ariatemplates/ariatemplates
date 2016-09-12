/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath : "test.aria.templates.TplClassGeneratorParseOnlyTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.TplClassGenerator"],
    $prototype : {
        testParseTemplate : function () {
            var result;
            aria.templates.TplClassGenerator.parseTemplate([
                '{Template {',
                '   $classpath: "x.y.Z",',
                '   $extends: "x.y.Y",',
                '   $wlibs: {',
                '      myLib: "x.y.MyWidgetsLibThatDoesNotExistButShouldNotBeChecked"',
                '   }',
                '}}',
                '   {macro main()}',
                '      {call test(null, "value", "data")/}',
                '      {call $Y.main()/}',
                '   {/macro}',
                '   {macro test(  a ,   bb , c   )}Date:${a|empty:new Date()|dateformat:"dd/MM/yyyy"}',
                '      {@myLib:MyWidget {',
                '         something: b',
                '      }/}',
                '   {/macro}',
                '{/Template}'
            ].join("\n"), {
                parseOnly: true,
                dontLoadWidgetLibs: true
            }, function (res) {
                result = res;
            });

            this.assertTruthy(result, "The callback should have been called synchronously.");
            this.assertEquals(result.tree.content[0].properties.$classpath, "x.y.Z");
            this.assertEquals(result.tree.content[0].properties.$extends, "x.y.Y");

            var mainMacroStatement = result.tree.properties.macros.main.definition;
            this.assertEquals(mainMacroStatement.name, "macro");
            this.assertEquals(mainMacroStatement.paramBlock, "main()");
            this.assertEquals(result.tree.source.substring(mainMacroStatement.firstCharParamIndex, mainMacroStatement.lastCharParamIndex), "main()");
            this.assertEquals(mainMacroStatement.properties.name, "main");
            this.assertJsonEquals(mainMacroStatement.properties.args, []);

            var callTestStatement = mainMacroStatement.content[0];
            this.assertEquals(callTestStatement.name, "call");
            this.assertEquals(callTestStatement.properties.name, "test");
            this.assertEquals(callTestStatement.properties.container, undefined);
            this.assertEquals(callTestStatement.properties.args, 'null, "value", "data"');

            var callMainStatement = mainMacroStatement.content[1];
            this.assertEquals(callMainStatement.name, "call");
            this.assertEquals(callMainStatement.properties.name, "main");
            this.assertEquals(callMainStatement.properties.container, "$Y");
            this.assertEquals(callMainStatement.properties.args, "");

            var testMacroStatement = result.tree.properties.macros.test.definition;
            this.assertEquals(testMacroStatement.name, "macro");
            this.assertEquals(testMacroStatement.paramBlock, "test(  a ,   bb , c   )");
            this.assertEquals(testMacroStatement.properties.name, "test");
            this.assertJsonEquals(testMacroStatement.properties.args, ["a", "bb", "c"]);

            var textStatement = testMacroStatement.content[0];
            this.assertEquals(textStatement.name, "#TEXT#");
            this.assertEquals(textStatement.paramBlock, "Date:");

            var exprStatement = testMacroStatement.content[1];
            this.assertEquals(exprStatement.name, "#EXPRESSION#");
            this.assertEquals(exprStatement.paramBlock, 'a|empty:new Date()|dateformat:"dd/MM/yyyy"');
            this.assertEquals(exprStatement.properties.expression, 'a');
            this.assertJsonEquals(exprStatement.properties.modifiers, [{
                "name": "empty",
                "args": 'new Date()'
            }, {
                "name": "dateformat",
                "args": '"dd/MM/yyyy"'
            }]);

            var widgetStatement = testMacroStatement.content[2];
            this.assertEquals(widgetStatement.name, "@myLib:MyWidget");
            this.assertEquals(widgetStatement.properties.libName, "myLib");
            this.assertEquals(widgetStatement.properties.libClasspath, "x.y.MyWidgetsLibThatDoesNotExistButShouldNotBeChecked");
            this.assertEquals(widgetStatement.properties.widgetName, "MyWidget");

        }
    }
});
