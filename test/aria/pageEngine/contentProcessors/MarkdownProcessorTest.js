/**
 * test.aria.pageEngine.contentProcessors.MarkdownProcessor test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.contentProcessors.MarkdownProcessorTest",
    $extends : "test.aria.NodeCoverageTestCase",
    $dependencies : ["aria.pageEngine.contentProcessors.MarkdownProcessor"],
    $prototype : {

        testProcessContent : function () {
            var mdProc = aria.pageEngine.contentProcessors.MarkdownProcessor;
            this.assertTrue("processContent" in mdProc, "the markdown process kas not been initialized correctly.");

            var input = {
                value : "# title #"
            };
            var output = mdProc.processContent(input);

            this.assertTrue(output != null, "The processContent method returned null.");
            this.assertTrue(output.contentType == "text/html", "Wrong output contentType: " + output.contentType
                    + " instead of text/html.");
            this.assertTrue(output.value == "<h1>title</h1>");

            input = {
                value : "# title\n\nAn [example][id]. Then, anywhere\nelse in the doc, define the link:\n\n  [id]: http://example.com/  \"Title\""
            };
            output = mdProc.processContent(input);
            this.assertTrue(output.value == "<h1>title</h1>\n\n<p>An <a href=\"http://example.com/\" title=\"Title\">example</a>. Then, anywhere\nelse in the doc, define the link:</p>");

            input = {
                value : "*italic*\n**bold**\n_italic_\n__bold__"
            };
            output = mdProc.processContent(input);
            this.assertTrue(output.value == "<p><em>italic</em>\n<strong>bold</strong>\n<em>italic</em>\n<strong>bold</strong></p>");

        }
    }
});
