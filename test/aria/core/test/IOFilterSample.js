/**
 * IO filter sample class used to test the IOFilter class.
 * @class test.aria.core.test.IOFilterSample
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.test.IOFilterSample',
	$extends : 'aria.core.IOFilter',
	$constructor : function (args) {
		this.$IOFilter.constructor.call(this);
		if (args == null) {
			args = {};
		}
		this.initArgs = args;
		if (this.initArgs.constructor) {
			this.initArgs.constructor.call(this, args);
		}
	},
	$destructor : function () {
		if (this.initArgs.destructor) {
			this.initArgs.destructor.call(this);
		}
		this.initArgs = null;
		this.$IOFilter.$destructor.call(this);
	},
	$prototype : {
		onRequest : function (req) {
			if (this.initArgs.onRequest) {
				this.initArgs.onRequest.call(this, req);
			}
		},

		onResponse : function (req) {
			if (this.initArgs.onResponse) {
				this.initArgs.onResponse.call(this, req);
			}
		}
	}
});