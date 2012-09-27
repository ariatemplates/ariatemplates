
/**
 * Sample class defining some events
 */
Aria.classDefinition({
	$classpath:'test.aria.core.test.ClassA',
	$events: {
		"start":"sample event raised when start() begins",
		"end": {
			description: "sample event raised when start() ends",
			properties: {
				endCount:"{Integer} the counter value"
			}
		},
		"countChange":{
			description:"raised when count property changes",
			properties:{
				oldCountValue:"{Integer} the previous value of the count property",
				newCountValue:"{Integer} the new value of the count property"
			}
		}
	},
	$constructor:function() {
		this.count=0;
	},
	$prototype:{
		/**
		 * Sample method raising start and end events
		 */
		start:function() {
			// start event with no arg
			this.$raiseEvent("start");

			// end argument
			this.$raiseEvent({name:"end",endCount:this.count});
		},
		/**
		 * Sample method that increments the count property
		 * @param {Integer} incr increment value (can be negative)
		 */
		incrementCount:function(incr) {
			if (incr!=0) {
				var prevCount=this.count;
				this.count+=incr;
				this.$raiseEvent({
					name:"countChange",
					oldCountValue:prevCount,
					newCountValue:this.count
				});
			}
		},
		/**
		 * Sample method to test errors if invalid event names are used
		 */
		raiseInvalidEvent:function(){
			this.$raiseEvent("sampleInvalidEvent");
		}
	}
});
