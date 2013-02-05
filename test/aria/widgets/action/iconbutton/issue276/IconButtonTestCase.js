Aria.classDefinition({
    $classpath : "test.aria.widgets.action.iconbutton.issue276.IconButtonTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.action.iconbutton.issue276.TemplateIconBtn"
        });

    },

    $prototype : {
        runTemplateTest : function () {
            var iconInfo = this.getWidgetInstance("myid")._icon._iconInfo;
            var width = iconInfo.width;
            var height = iconInfo.height;
            var imageURL = iconInfo.imageURL;
            // Background url is different for different browsers, so just checking image name
            var imagename = imageURL.substring(imageURL.lastIndexOf('/') + 1);
            this.assertEquals(width, 42, "Width is not proper");
            this.assertEquals(height, 16, "Height is not proper");
            this.assertEquals(imagename, "icon-check.png", "Image is not proper");
            this.end();
        }
    }
});