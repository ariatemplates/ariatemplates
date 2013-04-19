Aria.classDefinition({
    $classpath : "test.aria.NodeCoverageTestCase",
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        /**
         * Submit coverage results to node coverage tool before actually ending the test
         */
        _endTest : function () {
            if (Aria.$window.$$_l) {
                Aria.$window.$$_l.submit(this.$classpath);
            }
            this.$TestCase._endTest.call(this);
        }

    }
});
