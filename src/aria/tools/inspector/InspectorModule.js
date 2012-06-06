/**
 * Utility to manage and highligh template and modules on an application
 * @class aria.tools.inspector.InpectorModule
 */
Aria.classDefinition({
	$classpath : 'aria.tools.inspector.InspectorModule',
	$extends : 'aria.templates.ModuleCtrl',
	$dependencies : ['aria.utils.Event', 'aria.utils.Dom', 'aria.utils.Json'],
	$templates : ['aria.tools.inspector.InspectorDisplay'],
	$implements : ['aria.tools.inspector.IInspectorModule'],
	$constructor : function () {

		// call parent constructor
		this.$ModuleCtrl.constructor.call(this);

		/**
		 * Bridge used to communicate with main window.
		 * @type {aria.tools.Bridge}
		 */
		this.bridge = null;

		/**
		 * Datas analysis of the application
		 * @type Object
		 */
		this._data = {
			templates : [],
			modules : [],
			dataFragments : [],
			selectedTemplate : null,
			selectedModule : null,
			// Boolean to notify a lock of the UI
			locked : false
		};

		/**
		 * Container for highlighter
		 * @type HTMLElement
		 * @protected
		 */
		this._holder = null;

		/**
		 * Timeout to clear the display after a mouseover. Used to cancel this timeout on "on demand" clear display
		 * @type Number
		 */
		this._hideTimeout = null;

		/**
		 * Shortcut to main contextual menu
		 * @protected
		 * @type aria.tools.contextual.ContextualMenu
		 */
		this._mainContextual = null;

		/**
		 * Original function that will trigger external display (aria.utils.Dom.replaceHtml). This function will be
		 * replaced by another one which raise events when its called.
		 * @protected
		 * @type Function
		 */
		this._replaceHtmlOriginal = null;

	},
	$destructor : function () {
		this.clearHightlight();

		var mainUtilDom = this.bridge.getAriaPackage().utils.Dom;
		mainUtilDom.replaceHTML = this._replaceHtmlOriginal;
		this._replaceHtmlOriginal = null;
		mainUtilDom.insertAdjacentHTML = this._insertAdjacentHtmlOriginal;
		this._insertAdjacentHtmlOriginal = null;
		mainUtilDom.removeElement = this._removeElementOriginal;
		this._removeElementOriginal = null;

		this.$ModuleCtrl.$destructor.call(this);
	},
	$prototype : {
		$publicInterfaceName : "aria.tools.inspector.IInspectorModule",

		init : function (args, cb) {

			this.bridge = args.bridge;
			this.$assert(77, !!this.bridge);

			// Hijack functions to listen for changes
			var mainUtilDom = this.bridge.getAriaPackage().utils.Dom;
			// replaceHTML is used during normal template refresh
			this._replaceHtmlOriginal = mainUtilDom.replaceHTML;
			mainUtilDom.replaceHTML = this._interceptMethod(this._replaceHtmlOriginal);
			// insertAdjacentHTML is used with dynamic sections (and the repeater)
			this._insertAdjacentHtmlOriginal = mainUtilDom.insertAdjacentHTML;
			mainUtilDom.insertAdjacentHTML = this._interceptMethod(this._insertAdjacentHtmlOriginal);
			// removeElement is used both with dynamic sections (and the repeater) and with popups
			this._removeElementOriginal = mainUtilDom.removeElement;
			mainUtilDom.removeElement = this._interceptMethod(this._removeElementOriginal);

			// plug the refresh on the bridge
			this.bridge.$on({
				'forwardEvent' : this._onForward,
				scope : this
			});

			var appDocument = this.bridge.getDocument();
			this._holder = appDocument.createElement('div');
			appDocument.body.appendChild(this._holder);

			// starts the job
			this.refreshInformations();

			// check contextual menu for selected template context
			this._mainContextual = Aria.nspace("tools.contextual.ContextualMenu", false, this.bridge.getAriaPackage());
			if (this._mainContextual && this._mainContextual.targetTemplateCtxt) {
				this._selectFromTemplateCtxt(this._mainContextual.targetTemplateCtxt);
			}

			// call parent init
			this.$ModuleCtrl.init.apply(this, arguments);

		},

		/**
		 * Return a method which calls the given method and also call the refreshInformations method on this object
		 * (with a timeout).
		 * @param {Function} originalMethod
		 * @return {Function}
		 * @protected
		 */
		_interceptMethod : function (originalMethod) {
			var oSelf = this;
			var callRefreshInfos = function () {
				try {
					oSelf.refreshInformations();
				} catch (e) {
					// the function in the setTimeout must never fail
					// (especially needed in IE)
				}
			};
			return function (arg1, arg2, arg3) {
				// var res = originalMethod.call(this, arg1, arg2, arg3);
				var res = originalMethod.call(this, arg1, arg2, arg3);
				// Note: IE does not support having apply with the arguments array here:
				// var res = originalMethod.apply(this, arguments);
				setTimeout(callRefreshInfos);
				return res;
			};
		},

		/**
		 * Retrieve information from current display
		 */
		refreshInformations : function () {
			// clean
			this._data.templates = [];
			this._data.modules = [];
			this._data.dataFragments = [];
			// refresh

			var startTemplates = this._data.templates;
			var startModules = this._data.modules;
			var startDatas = this._data.dataFragments;

			// this two should change if not null, as new objects are created.
			var selectedTemplate = this._data.selectedTemplate;
			var selectedModule = this._data.selectedModule;

			// The previous way of retrieving elements was to recursively look in the DOM
			// But a problem appeared with this when event delegation was implemented (because DOM elements
			// do not have any more a reference to the widget instance object until the getDom() method on the widget is
			// called, which may not happen at all, so we cannot recognize corresponding widgets).
			// We now use the hierarchies from the refresh manager.

			var refreshMgr = this.bridge.getAriaPackage().templates.RefreshManager;
			if (refreshMgr != null) {
				refreshMgr.updateHierarchies();
				var hierarchies = refreshMgr.getHierarchies();
				this._convertRefreshMgrHierarchies(hierarchies, startTemplates, startModules, startDatas);
			}

			// not used now, but could be used later to display customizations in the inspector
			// this._data.customizations = this.bridge.getAriaPackage().environment.Environment.getCustomizations();

			// if not -> nullify
			if (selectedTemplate == this._data.selectedTemplate) {
				this._data.selectedTemplate = null;
			}
			if (selectedModule == this._data.selectedModule) {
				this._data.selectedModule = null;
			}

			this.$raiseEvent("contentChanged");
		},

		/**
		 * Recursively convert hierarchies from the refresh manager into the data structures used by the inspector.
		 * @param {Array} hierarchies array of nodes in the RefreshManager hierarchy
		 * @param {Array} tplContainer container for templates found
		 * @param {Array} moduleContainer container for modules found
		 * @param {Array} dataFragmentsContainer container for data fragment, pieces of data not associated with a
		 * module (not used currently)
		 * @param {Array} widgetsContainer container for widgets found
		 */
		_convertRefreshMgrHierarchies : function (hierarchies, startTemplates, startModules, startDatas,
				widgetsContainer) {
			for (var i = 0, l = hierarchies.length; i < l; i++) {
				this._convertRefreshMgrHierarchy(hierarchies[i], startTemplates, startModules, startDatas, widgetsContainer);
			}
		},

		/**
		 * Recursively convert a node from the refresh manager into the data structures used by the inspector.
		 * @protected
		 * @param {Object} node node in the RefreshManager hierarchy to start with
		 * @param {Array} tplContainer container for templates found
		 * @param {Array} moduleContainer container for modules found
		 * @param {Array} dataFragmentsContainer container for data fragment, pieces of data not associated with a
		 * module (not used currently)
		 * @param {Array} widgetsContainer container for widgets found
		 */
		_convertRefreshMgrHierarchy : function (node, tplContainer, moduleContainer, dataFragmentsContainer,
				widgetsContainer) {
			if (node.type == "template" || node.type == "templateWidget") {
				var templateCtxt = node.elem;
				if (node.type == "templateWidget") {
					if (templateCtxt.behavior) {
						templateCtxt = templateCtxt.behavior.subTplCtxt;
					} else {
						templateCtxt = templateCtxt.subTplCtxt;
					}
				}
				var selectedTemplate = this._data.selectedTemplate;
				var selectedModule = this._data.selectedModule;
				var subContent = [], widgets = [], moduleRegistered = false, moduleDescription;
				var moduleCtrlFactory = this.bridge.getAriaPackage().templates.ModuleCtrlFactory;
				this.$assert(190, !!templateCtxt);
				this.$assert(191, !!moduleCtrlFactory);
				var data = templateCtxt.data;
				var moduleCtrl = templateCtxt.moduleCtrl;

				if (moduleCtrl) {
					// check if module is already in the list of modules of the application
					for (var index = 0, len = moduleContainer.length; index < len; index++) {
						moduleDescription = moduleContainer[index];
						if (moduleDescription.moduleCtrl == moduleCtrl) {
							// if it was a subtemplate with the same module, current would be true -> new outer template
							if (!moduleDescription.current) {
								moduleDescription.outerTemplateCtxts.push(templateCtxt);
								moduleDescription.current = true;
							}
							moduleRegistered = true;
						} else {
							moduleDescription.current = false;
						}
					}
					// if not, add it, with current dom to identify
					if (!moduleRegistered) {
						var newModuleDescription = {
							moduleCtrl : moduleCtrl,
							outerTemplateCtxts : [templateCtxt],
							current : true,
							isReloadable : moduleCtrlFactory.isModuleCtrlReloadable(moduleCtrl)
						};

						if (selectedModule && selectedModule.moduleCtrl == moduleCtrl) {
							this._data.selectedModule = newModuleDescription;
						}
						moduleContainer.push(newModuleDescription);
					}
				}

				var templateDescription = {
					templateCtxt : templateCtxt,
					content : subContent,
					moduleCtrl : moduleCtrl,
					widgets : widgets
				};

				if (selectedTemplate && selectedTemplate.templateCtxt == templateCtxt) {
					this._data.selectedTemplate = templateDescription;
				}

				tplContainer.push(templateDescription);

				widgetsContainer = widgets;
				tplContainer = subContent;
			} else if (node.type == "widget") {
				var widget = node.elem.behavior;
				// register widgets
				if (widgetsContainer && widget) {
					var widgetDescription = {
						widget : widget
					}
					widgetsContainer.push(widgetDescription);
					if (node.content) {
						var content = [];
						widgetDescription.content = content;
						widgetsContainer = content;
					}

				}
			} // else if (node.type == "section") {
			// we do not currently display sections in the inspector (but this could be improved in the future)
			// }
			if (node.content) {
				this._convertRefreshMgrHierarchies(node.content, tplContainer, moduleContainer, dataFragmentsContainer, widgetsContainer);
			}
		},

		/**
		 * Clean the display
		 */
		clearHightlight : function () {
			if (this._hideTimeout) {
				clearInterval(this._hideTimeout);
				this._hideTimeout = null;
			}
			this._holder.innerHTML = "";
		},

		/**
		 * Highlight a dom element with borders
		 * @param {HTMLElement} domElt
		 * @param {String} color. default is #ACC2FF
		 */
		displayHighlight : function (domElt, color) {
			this.clearHightlight();
			color = color ? color : "#ACC2FF";
			var pos = this.bridge.getAriaPackage().utils.Dom.calculatePosition(domElt);
			var marker = this.bridge.getDocument().createElement('div');
			marker.style.cssText = ["position:absolute;top:", pos.top, "px;left:", pos.left, "px;width:",
					((domElt.offsetWidth - 8 > 0) ? domElt.offsetWidth - 8 : 0), "px;height:",
					((domElt.offsetHeight - 8 > 0) ? domElt.offsetHeight - 8 : 0),
					"px; border:dashed 4px " + color + ";z-index: 999999999999999;z-index: 999999999999999;"].join('');
			this._holder.appendChild(marker);
			marker = null;
			this._hideTimeout = setTimeout(aria.utils.Function.bind(this.clearHightlight, this), 2000);
		},

		/**
		 * Reload a template for given template context
		 * @param {aria.templates.TemplateCtxt} templateCtxt
		 * @source {Boolean} tplSource optional template source provided ?
		 */
		reloadTemplate : function (templateCtxt, tplSource) {

			aria.utils.Json.setValue(this._data, "locked", true);

			if (tplSource) {
				tplSource = this._data.selectedTemplate.tplSrcEdit;
			}

			// do some cleaning
			this.clearHightlight();

			// do not close if target IS the contextual menu
			if (this._mainContextual && templateCtxt.tplClasspath != this._mainContextual.CONTEXTUAL_TEMPLATE_CLASSPATH) {
				this._mainContextual.close();
			}

			// replace in this scope Aria and aria
			var oSelf = this;
			var doIt = function () {
				var Aria = oSelf.bridge.getAria(), aria = oSelf.bridge.getAriaPackage();

				// ... and call for reload
				templateCtxt.$reload(tplSource, {
					fn : oSelf._unlock,
					scope : oSelf
				});
			};
			doIt();

		},

		/**
		 * Unlock UI after impacting action
		 */
		_unlock : function () {
			var data = this._data;
			setTimeout(function () {
				aria.utils.Json.setValue(data, "locked", false);
			}, 500);
		},

		/**
		 * Reload a module
		 * @param {aria.templates.ModuleCtrl} moduleCtrl
		 */
		reloadModule : function (moduleCtrl) {
			var moduleFactory = this.bridge.getAriaPackage().templates.ModuleCtrlFactory;
			aria.utils.Json.setValue(this._data, "locked", true);

			// do some cleaning
			this.clearHightlight();

			moduleFactory.reloadModuleCtrl(moduleCtrl, {
				fn : this._unlock,
				scope : this
			});
		},

		/**
		 * Refresh a template context
		 * @param {aria.templates.TemplateCtxt} templateCtxt
		 */
		refreshTemplate : function (templateCtxt) {
			this.clearHightlight();
			templateCtxt.$refresh();
		},

		/**
		 * Called when an event is forwarded by the bridge: e.g when contextual menu is used to inspect a template.
		 * @protected
		 * @param {Object} event
		 */
		_onForward : function (event) {
			if (event.event.name == "ContextualTargetFound") {
				var templateCtxt = event.event.templateCtxt;
				// NO NEED TO REFRESH -> displaying the context menu does it already
				this._selectFromTemplateCtxt(templateCtxt);
			}
		},

		/**
		 * Set in selected template and moduleCtrl descriptions from a given template context
		 * @protected
		 * @param {aria.templates.TemplateCtxt} templateCtxt
		 */
		_selectFromTemplateCtxt : function (templateCtxt) {
			var moduleCtrl = templateCtxt.moduleCtrlPrivate;
			// find associated module
			var modules = this._data.modules, i, l;
			for (i = 0, l = modules.length; i < l; i++) {
				if (modules[i].moduleCtrl == moduleCtrl) {
					this._data.selectedModule = modules[i];
					break;
				} else {
					this._data.selectedModule = null;
				}
			}
			// find associated template description
			this._data.selectedTemplate = this._findTemplateDes(this._data.templates, templateCtxt);

		},

		/**
		 * Find description linked with given templateCtxt
		 * @protected
		 * @param {Array} container
		 * @param {aria.templates.TemplateCtxt} templateCtxt
		 * @return {Object}
		 */
		_findTemplateDes : function (container, templateCtxt) {
			var contentSearch = null, i, l;
			for (i = 0, l = container.length; i < l; i++) {
				var description = container[i];
				if (description.templateCtxt == templateCtxt) {
					return description;
				} else {
					contentSearch = this._findTemplateDes(description.content, templateCtxt);
					if (contentSearch) {
						return contentSearch;
					}
				}
			}
			return null;
		},

		/**
		 * Get source corresponding to filepath in main window
		 * @param {String} filePath
		 */
		getSource : function (filePath) {
			return this.bridge.getAriaPackage().core.Cache.getItem("files", filePath, false);
		}
	}
});
