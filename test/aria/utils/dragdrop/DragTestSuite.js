/**
 * Test suite regrouping all tests on the Drag utility
 */
Aria.classDefinition({
	$classpath : 'test.aria.utils.dragdrop.DragTestSuite',
	$extends : 'aria.jsunit.TestSuite',
	$constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.utils.dragdrop.DragErrorTestCase");
        this.addTests("test.aria.utils.dragdrop.DragTestCase");
        this.addTests("test.aria.utils.dragdrop.DragConstraintTestCase");
        this.addTests("test.aria.utils.dragdrop.OutOfBoundaryTestCase");
        this.addTests("test.aria.utils.dragdrop.DragProxyTestCase");
        this.addTests("test.aria.utils.dragdrop.DragDropBean");
        this.addTests("test.aria.utils.dragdrop.issue397.MovableScrollbarTestCase");

	}
});