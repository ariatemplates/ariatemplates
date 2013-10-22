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
    $classpath : "test.aria.templates.ParserTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.TplParser", "aria.templates.TreeBeans"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {
        testPrepare : function () {
            aria.templates.TplParser._prepare("   line 1   \n line2 // with my comment  \n//line 3\n line 4\n\n");
            this.assertTrue(aria.templates.TplParser.template == "line 1\nline2\n\nline 4\n\n");

            // PTR 05020716: a comment should not remove the character preceeding '//'
            // comments need to have a preceeding whitespace
            aria.templates.TplParser._prepare("   line 1   \n line2 // with my comment  \n//line 3\n line 4\n\n");
            this.assertTrue(aria.templates.TplParser.template == "line 1\nline2\n\nline 4\n\n");
        },

        testComputeLineNumbers : function () {
            aria.templates.TplParser.template = "line 1\nline2\n\nline 4\n\n";
            aria.templates.TplParser._computeLineNumbers();
            this.assertTrue(aria.templates.TplParser.positionToLineNumber(3) == 1);
            this.assertTrue(aria.templates.TplParser.positionToLineNumber(6) == 2);
            this.assertTrue(aria.templates.TplParser.positionToLineNumber(11) == 2);
            this.assertTrue(aria.templates.TplParser.positionToLineNumber(12) == 3);
        },

        testUnescapeParam : function () {
            var parser = aria.templates.TplParser;
            this.assertTrue(parser.__unescapeParam("\\{", 0, 2) == "{");
            this.assertTrue(parser.__unescapeParam("\\}", 0, 2) == "}");
            this.assertTrue(parser.__unescapeParam("\\/", 0, 2) == "/");
            this.assertTrue(parser.__unescapeParam("\\$", 0, 2) == "$");
            this.assertTrue(parser.__unescapeParam("\\\\{", 0, 3) == "\\{");
            this.assertTrue(parser.__unescapeParam("\\\\}", 0, 3) == "\\}");
            this.assertTrue(parser.__unescapeParam("\\\\\\}", 0, 4) == "\\}");
            this.assertTrue(parser.__unescapeParam("\n\r\n some\n thing \n\n", 0, 18) == " some\n thing ");
        },

        testParseTemplate : function () {
            var p = aria.templates.TplParser;
            var tree = p.parseTemplate(""); // an empty text is valid from the parser point of view
            aria.core.JsonValidator.check(tree, 'aria.templates.TreeBeans.Root');
            this.assertTrue(tree.content.length === 0);
            var tpl = "simpleText\\{with an escaped brace {containerStatement params}${dollarExpression}{/containerStatement}{singleStatement/}";
            tree = p.parseTemplate(tpl);
            aria.core.JsonValidator.check(tree, 'aria.templates.TreeBeans.Root');
            this.assertTrue(tree.content[0].name == "#TEXT#");
            this.assertTrue(tree.content[0].paramBlock == "simpleText{with an escaped brace ");
            this.assertTrue(tree.content[1].name == "containerStatement");
            this.assertTrue(tree.content[1].paramBlock == "params");
            this.assertTrue(tpl.substring(tree.content[1].firstCharContentIndex, tree.content[1].lastCharContentIndex) == "${dollarExpression}");
            this.assertTrue(tree.content[1].content[0].name == "#EXPRESSION#");
            this.assertTrue(tree.content[1].content[0].paramBlock == "dollarExpression");
            this.assertTrue(tree.content[2].name == "singleStatement");
            this.assertTrue(tree.content[2].paramBlock === "");
        },

        /**
         * New test added for PTR05572779 - white space now option between widget name and configuration: supports with
         * space (original preferred method)
         *
         * <pre>
         *  {@aria:Button {
         *    label:&quot;Enable/Disable Important Button&quot;,
         *    onclick : {fn : changeState}
         *  } /}
         * </pre>
         *
         * and now supports without white space
         *
         * <pre>
         *  {@aria:Button{
         *    label:&quot;Enable/Disable Important Button&quot;,
         *    onclick : {fn : changeState}
         *  } /}
         * </pre>
         */
        testParseTemplateWidget : function () {
            var p = aria.templates.TplParser;
            var tree = p.parseTemplate(""); // an empty text is valid from the parser point of view
            aria.core.JsonValidator.check(tree, 'aria.templates.TreeBeans.Root');
            this.assertTrue(tree.content.length === 0);
            var widget = "{@aria:Button{label:'Enable/Disable Important Button',onclick : {fn : changeState}} /}{@aria:Button {label:'Enable/Disable Important Button',onclick : {fn : changeState}} /}";
            tree = p.parseTemplate(widget);
            aria.core.JsonValidator.check(tree, 'aria.templates.TreeBeans.Root');
            this.assertTrue(tree.content[0].name == "@aria:Button");// widget definition without white space between
                                                                    // name and configuration
            this.assertTrue(tree.content[1].name == "@aria:Button");// prefered widget definition with white space
                                                                    // between name and configuration
        },

        testParseTemplateErrors : function () {
            var p = aria.templates.TplParser;
            this.assertTrue(p.parseTemplate("{") === null);
            this.assertErrorInLogs(p.MISSING_CLOSINGBRACES);
            this.assertTrue(p.parseTemplate("{statement {}") === null);
            this.assertErrorInLogs(p.MISSING_CLOSINGBRACES);
            this.assertTrue(p.parseTemplate("{ invalid statement}") === null);
            this.assertErrorInLogs(p.INVALID_STATEMENT_NAME);
            this.assertTrue(p.parseTemplate("{#ROOT#}") === null);
            this.assertErrorInLogs(p.INVALID_STATEMENT_NAME);
            this.assertTrue(p.parseTemplate("{statement1}{statement2}{/statement1}") === null);
            this.assertErrorInLogs(p.EXPECTING_OTHER_CLOSING_STATEMENT);
            this.assertTrue(p.parseTemplate("{statement1}{/sttement1}") === null);
            this.assertErrorInLogs(p.STATEMENT_CLOSED_NOT_OPEN);
            this.assertTrue(p.parseTemplate("{/#ROOT#}") === null);
            this.assertErrorInLogs(p.STATEMENT_CLOSED_NOT_OPEN);
            this.assertTrue(p.parseTemplate("{statement1}") === null);
            this.assertErrorInLogs(p.MISSING_CLOSING_STATEMENT);
            this.assertTrue(p.parseTemplate("{CDATA}") === null);
            this.assertErrorInLogs(p.MISSING_CLOSING_STATEMENT);
        },

        testCdata : function () {
            var parser = aria.templates.TplParser;
            var tree = parser.parseTemplate("{CDATA}{}${a}{/CDATA}");
            aria.core.JsonValidator.check(tree, "aria.templates.TreeBeans.Root");
            this.assertTrue(tree.content[0].name == "#CDATA#");
        }
    }
});
