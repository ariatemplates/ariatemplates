/**
 * Module controller for contextual menu.
 * @class aria.tools.contextual.ContextualModuleCtrl
 */
Aria.classDefinition({
	$classpath : 'aria.tools.contextual.ContextualModule',
	$extends : 'aria.templates.ModuleCtrl',
	$constructor : function () {
		this.$ModuleCtrl.constructor.call(this);
	},
	$prototype : {
		init : function (args, cb) {
			this._data = args;
			this.$callback(cb);
		}
	}
});