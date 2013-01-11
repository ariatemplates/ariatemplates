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
            var iconBtnId = this.getWidgetInstance("myid")._domId;
            var domUtil = aria.utils.Dom;
            // for getting iconbutton image style
            var iconBtnElement = domUtil.getDomElementsChildByTagName(domUtil.getElementById(iconBtnId), 'span')[4];
            var width = domUtil.getStyle(iconBtnElement, "width");
            var height = domUtil.getStyle(iconBtnElement, "height");
            // Background url is different for different browsers, so just checking image name
            var imageURL = domUtil.getStyle(iconBtnElement, "background").split(' ')[0].replace(/("|')/g, "");
            var imagename = imageURL.substring(imageURL.lastIndexOf('/') + 1, imageURL.lastIndexOf(')'));;

            this.assertEquals(width, "42px", "Width is not proper");
            this.assertEquals(height, "16px", "Height is not proper");
            this.assertEquals(imagename, "icon-check.png", "Image is not proper");

            this.end();
        }
    }
});