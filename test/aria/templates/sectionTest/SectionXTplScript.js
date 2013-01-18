Aria.tplScriptDefinition({
    $classpath : 'test.aria.templates.sectionTest.SectionXTplScript',
    $prototype : {

        $dataReady : function () {
            this.data.mySectionAttributes = {
                "title" : "change section title",
                "name" : "change section name"
            };
        },

        changeAllSectionAttributes : function () {
            var myAttributes = {
                name : 'change section name',
                dir : 'new dir',
                simon : true
            }
            this.$json.setValue(this.data, "mySectionAttributes", myAttributes);
        },

        changeIndividualSectionAttribute : function () {
            this.$json.setValue(this.data.mySectionAttributes, 'title', 'my new title');
        }
    }
});