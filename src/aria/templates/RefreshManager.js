/**
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
/**
 * Helper for templates/widgets refresh. It allows to reduce the number of refreshes by queueing and computing the
 * minimum subset of needed refreshes.
 */
Aria.classDefinition({
	$classpath : "aria.templates.RefreshManager",
	$singleton : true,
	$constructor : function () {
		/**
		 * Number of times the RefreshManager has been stopped
		 * @type Number
		 */
		this._stops = 0;

		/**
		 * This array stores pointers to the refresh functions for Templates, Secions and Widgets, in their order of
		 * arrival since the last stop(). An element in this queue is
		 *
		 * <pre>
		 * {
		 *    cb : aria.utils.Callback,
		 *    elem : Template Context or Widget instance
		 * }
		 * </pre>
		 *
		 * @type Array
		 */
		this._queue = [];

		/**
		 * This array stores the containment hierarchy (a tree) for Templates, Sections and widgets. Each object in the
		 * array is a template loaded with with Aria.loadTemplate and is the root of a tree. The node object has the
		 * following structure:
		 *
		 * <pre>
		 * {
		 *    type : 'template' | 'templateWidget' | 'section' | 'widget',
		 *    elem : TemplateCtxt | Section | {
		 *       _type : 1,
		 *       behavior : [instance of the widget, including template widgets ]
		 *    },
		 *    content : Array of sub elements
		 * }
		 * </pre>
		 *
		 * @type Array
		 */
		this._hierarchies = [];

		/**
		 * Array of elements which correspond to all widgets, templates and sections which need to be refreshed when
		 * resume() is called. The set is complete but not minimal (elements can contain other elements)
		 * @type Array
		 */
		this._updatedNodes = [];

		/**
		 * Array of elements which correspond to a minimal refresh set computed with _computeMinimal() Array elements
		 * are of the same format as in this._hierarchies
		 * @type Array
		 */
		this._nodesToRefresh = [];

		/**
		 * Internal flag, is true if the Refresh Manager is in the process of executing refresh functions which had been
		 * queued
		 * @type Boolean
		 */
		this._isResuming = false;
	},
	$destructor : function () {
		this._queue = null;
		this._hierarchies = null;
		this._updatedNodes = null;
		this._nodesToRefresh = null;
	},
	$statics : {
		/**
		 * The property used in the "containment hierarchy" to access a template/section/widget's container parent
		 * @type String
		 */
		PARENT_PROP : Aria.FRAMEWORK_PREFIX + "containedIn"
	},
	$prototype : {

		/**
		 * Queue a refresh. It'll be execute on resume.
		 * @param {aria.utils.Callback} cb A callback to aria.templates.TemplateCtxt.$refresh (in the case of a template
		 * or section refresh) or to aria.widgets.Widget._notifyDataChangeCB in the case of a Widget refresh
		 * @param {Object} element A TemplateContext, in the case of a Template or Section refresh, or a Widget in the
		 * case of a widget refresh
		 */
		queue : function (cb, element) {
			// PROFILING // this.$logTimestamp("queue");
			this._queue.push({
				cb : cb,
				elem : element
			});
		},

		/**
		 * Puts the Refresh Manager in "STOPPED" state, effectively causing all template/section/widget refreshes to be
		 * queued insted of being fired immediately.
		 */
		stop : function () {
			if (!this._isResuming) {
				// PROFILING // this.$logTimestamp("stop");
				this._stops++;
			}
		},

		/**
		 * Internal function to execute callbacks in the queue. It is different from JsObject.$callback
		 * because the order of parameters is different if the scope is a Widget
		 * @param {aria.utils.Callback} cb Callback to be executed
		 * @private
		 */
		_triggerCB : function (cb) {
			var scope = cb.scope, callback;
			scope = scope ? scope : this;
			if (!cb.fn) {
				callback = cb;
			} else {
				callback = cb.fn;
			}

			if (typeof(callback) == 'string') {
				callback = scope[callback];
			}
			if (cb.scope.$Widget) {
				callback.call(scope, null, cb.args);
			} else {
				callback.call(scope, cb.args);
			}
		},

		/**
		 * Triggers the minimal set of refreshes which covers all the templates/sections/widgets found in the queue.
		 * Puts the Refresh Manager back in "RUNNING" state.
		 */
		resume : function () {
			if (this._isResuming) {
				return;
			}

			this._stops--;
			if (this._stops > 0) {
				return; // we're in a nested resume()
			} else {
				this._stops = 0;
			}
			this._isResuming = true;

			// PROFILING // var profilingId = this.$startMeasure("resume");
			var queueLength = this._queue.length;

			// compute necessary refreshes
			// 1-update hierarchies
			if (Aria.rootTemplates == null || Aria.rootTemplates.length === 0) {

				// trigger all cb's in the queue
				for (var i = 0; i < queueLength; i++) {
					this._triggerCB(this._queue[i].cb);
				}

				// empty queue
				this._queue = [];
				// PROFILING // this.$stopMeasure(profilingId);
				this._isResuming = false;
				return;
			}

			this.updateHierarchies();

			this._updatedNodes.length = 0;
			var hierarchiesLength = this._hierarchies.length, freeCallbacks = [];

			// 2-color the tree
			for (var rootIdx = 0; rootIdx < hierarchiesLength; rootIdx++) {
				// for (var rootIdx = 0; rootIdx < 1; rootIdx++) {
				var rootNode = this._hierarchies[rootIdx];

				for (var queueIdx = 0; queueIdx < queueLength; queueIdx++) {
					var qElem = this._queue[queueIdx];
					var colorandum = this._findInHierarchy(qElem, rootNode);
					if (colorandum) {
						if (!colorandum.updated) {
							// handle replacements i.e. repeated refreshes
							colorandum.updated = true;
							colorandum.qElem = qElem;
							this._updatedNodes.push(colorandum);
						}
						this._queue.splice(queueIdx, 1);
						// elements shift -> change index
						queueIdx--;
						// update queue length
						queueLength--;
					}
				}
			}

			// calculate minimal updates tree
			this._computeMinimal();
			// consider subsequent call to setvalue on same data when analyzing the queue

			var qElem, cb;
			for (var i = 0, len = this._nodesToRefresh.length; i < len; i++) {
				qElem = this._nodesToRefresh[i].qElem;
				cb = qElem.cb;
				this._triggerCB(cb);
			}
			// handle 'free' callbacks, not linked to a node
			for (var i2 = 0; i2 < queueLength; i2++) {
				qElem = this._queue[i2];
				cb = qElem.cb;
				this._triggerCB(cb);
			}

			// prepare new queue
			this._queue = [];

			this._isResuming = false;
			// PROFILING // this.$stopMeasure(profilingId);
		},

		/**
		 * Tells if the Refresh Manager is in the process of executing delayed refreshes
		 * @return {Boolean}
		 */
		isResuming : function () {
			return this._isResuming;
		},

		/**
		 * Recursively looks for a node in the "containment hierarchy" which corresponds to an element in the updates
		 * queue. If found, the node is returned, otherwise the method returns null.
		 * @param {Object} qElem The element in the updates queue (see this._queue)
		 * @param {Object} node The node in the "containment hierarchy" (see this._hierarchies)
		 * @private
		 */
		_findInHierarchy : function (qElem, node) {
			if (this._elemMatches(qElem, node)) {
				// base case
				return node;
			} else {
				// content can be null if it's a widget different from Template
				if (node.content == null) {
					return null;
				}
				if (node.content.length > 0) {
					// look within the subnodes
					for (var i = 0; i < node.content.length; i++) {
						var subnode = node.content[i];
						var res = this._findInHierarchy(qElem, subnode);
						if (res != null) {
							// found match!
							return res;
						}
					}
				}
			}
			return null;
		},

		/**
		 * Internal helper function, performs comparisons between elements of the queue and nodes in the "containment
		 * hierarchy"
		 * @param {Object} qElem An element in the queue (see this._queue)
		 * @param {Object} node An element in the containment hierarchy (see this._hierarchies)
		 * @return {Boolean} True if the elements correspond to the same Template, section or widget, false otherwise.
		 * @private
		 */
		_elemMatches : function (qElem, node) {
			var isSectionRefresh = (qElem.cb.args && (qElem.cb.args.filterSection != null || qElem.cb.args.outputSection != null));
			if (isSectionRefresh) {
				if (node.type == "section") {
					var secCtxt = node.elem.tplCtxt;
					if (secCtxt != qElem.elem) {
						return false; // must belong to the same templateCtxt!
					}
					var filterId = qElem.cb.args.filterSection || qElem.cb.args.outputSection;
					var sectionId = node.elem.id;
					return (filterId == sectionId);
				} else {
					return false;
				}
			} else if (node.type == "template") {
				return (qElem.elem == node.elem);
			} else if (node.type == "templateWidget") {
				if (node.elem.behavior) {
					return (node.elem.behavior.subTplCtxt == qElem.elem);
				} else {
					return (node.elem.subTplCtxt == qElem.elem);
				}
			} else if (node.type == "widget") {
				if (node.elem.behavior._subTplCtxt == qElem.elem) {
					// it's a template-based widget
					return true;
				} else {
					return (node.elem.behavior == qElem.elem);
				}
			} else if (node.type == "section") {
				return (node.elem == qElem.elem);
			}
		},

		/**
		 * Tells if the RefreshManager is in "STOPPED" state [after a stop(), but before a resume()],
		 * @return {Boolean}
		 */
		isStopped : function () {
			return this._stops > 0;
		},

		/**
		 * See this._hierarchies
		 * @return {Array} the Refresh Manager's internal representation of the "containment hierarchy" of
		 * templates/sections/widgets.
		 */
		getHierarchies : function () {
			return this._hierarchies;
		},

		/**
		 * Updates the Refresh Manager's internal representation of the "containment hierarchy" of
		 * templates/sections/widgets. See this._hierarchies
		 */
		updateHierarchies : function () {
			// TODO destroy data structure
			this._hierarchies.length = 0;

			for (var i = 0; i < Aria.rootTemplates.length; i++) {
				var rootTemplate = Aria.rootTemplates[i];
				if (rootTemplate._mainSection) {
					var rootEntry = this._fillNode(rootTemplate);
					this._hierarchies.push(rootEntry);
				}
			}
		},

		/**
		 * Internal helper function, computes the minimal set of refreshes which covers all the
		 * templates/sections/widgets found in the queue, and stores it as elements of this._nodesToRefresh
		 * @private
		 */
		_computeMinimal : function () {
			// searches the elements tree depth-first
			// whenever an udpated node is found, it is added to the "toRefresh" queue
			// and its descendants are not traversed
			this._nodesToRefresh.length = 0;
			for (var i = 0; i < this._hierarchies.length; i++) {
				this._markSubnodesToRefresh(this._hierarchies[i]);
			}

		},

		/**
		 * Recursively colors all the subnodes of the argument node which need a refresh. If the argument node itself
		 * needs a refresh, it is marked as "updated" and the descendendants are not explored nor colored.
		 * @param {Object} node The starting node in the "containment hierarchy"
		 * @private
		 */
		_markSubnodesToRefresh : function (node) {
			if (node.updated) {
				// add node to refresh list
				this._nodesToRefresh.push(node);
				var elem = node.elem;
				if (elem.refreshManagerWholeUpdate) {
					if (elem.refreshManagerWholeUpdate()) {
						return;
					}
					// if it is not a whole update of the section, we go on looking for nodes to refresh
				} else {
					// ignore descendants
					return;
				}
			}
			if (node.content && node.content.length > 0) {
				for (var i = 0; i < node.content.length; i++) {
					// look in children, recursively
					var subnode = node.content[i];
					this._markSubnodesToRefresh(subnode);
				}
			}

		},

		/**
		 * Fills a node in the "containment hierarchy" with its type, element (a TemplateContext, Section or Widget)
		 * @param {Object} node An Object in the namespace (can be a TemplateCtxt, Widget or Section)
		 * @return {Object} A node in the "containment hierarchy"
		 * @private
		 */
		_fillNode : function (node) {
			var content = [];
			var nodeEntry = {
				type : null,
				elem : node,
				content : []
			};

			// TODO major refactoring
			if (node.$classpath == "aria.templates.TemplateCtxt") {
				// 1----------it's a template. typeof(elem)==templateCtxt
				nodeEntry.type = "template";
				var templateCtxtContent = node._mainSection._content;
				this._addContent(nodeEntry, templateCtxtContent);
			} else if (node.$classpath == "aria.widgets.Template") {
				// it's a template widget
				nodeEntry.type = "templateWidget";
				if (node.subTplCtxt && node.subTplCtxt._mainSection) {
					// and it's being displayed !
					var widgetTemplateCtxtContent = node.subTplCtxt._mainSection._content;
					this._addContent(nodeEntry, widgetTemplateCtxtContent);
				}
			} else if (node._type == 1) {
				// 2----------it's a behavior
				var behavior = node.behavior;
				if (behavior.$classpath == "aria.widgets.Template") {
					// 2a----it's a template widget
					nodeEntry.type = "templateWidget";
					if (behavior.subTplCtxt && behavior.subTplCtxt._mainSection) {
						// 2a ... and it's being displayed !
						var widgetTemplateCtxtContent = behavior.subTplCtxt._mainSection._content;
						this._addContent(nodeEntry, widgetTemplateCtxtContent);
					}
				} else {
					nodeEntry.type = "widget"; // it's a widget
					if (node.behavior._subTplCtxt) {
						// it's a tenmplate-based widget
						var templateBasedContent = node.behavior._subTplCtxt._mainSection._content;
						this._addContent(nodeEntry, templateBasedContent);
					} else if (node.behavior.$classpath == "aria.widgets.form.DatePicker") {
						// date pickers have calendars
						if (node.behavior.controller._calendar && node.behavior.controller._calendar._tplWidget) {
							// this datepicker has a calendar: add it
							var dpContent = [node.behavior.controller._calendar._tplWidget];
							this._addContent(nodeEntry, dpContent);
						}
					} else if (node.behavior.$classpath == "aria.widgets.form.MultiSelect") {
						// date pickers have calendars
						if (node.behavior.controller._listWidget) {
							// this datepicker has a calendar: add it
							var dpContent = [node.behavior.controller._listWidget._tplWidget];
							this._addContent(nodeEntry, dpContent);
						}
					} else {
						// 2b-----it's a normal widget: don't recurse
						nodeEntry.content = null;
					}

				}

			} else if (node.idMap != null) {
				// 3-------it's a section
				nodeEntry.type = "section";
				var sectionContent = node._content;
				this._addContent(nodeEntry, node._content);
			}

			return nodeEntry;

		},

		/**
		 * Recursively add child nodes into the "containment hierarchy"
		 * @param {Object} node A node in the "containment hierarchy"
		 * @param {Array} content An array of TemplateCtxt, Widget or Section
		 * @private
		 */
		_addContent : function (node, content) {
			for (var i = 0; i < content.length; i++) {
				var child = this._fillNode(content[i]);
				child[this.PARENT_PROP] = node;
				node.content.push(child);
			}
		}
	}
});