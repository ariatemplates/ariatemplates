/*
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

(function () {
    var idMgr = null;

    var TYPE_SECTION = 0;
    var TYPE_BEHAVIOR = 1;

    var regexpForId = /^[\w\-:\.]+\+?$/;

    /**
     * Represents a section in a template.
     */
    Aria.classDefinition({
        $classpath : "aria.templates.Section",
        $dependencies : ["aria.utils.Array", "aria.utils.Json", "aria.utils.Delegate",
                "aria.templates.NavigationManager", "aria.templates.CfgBeans", "aria.utils.Dom", "aria.utils.String",
                "aria.utils.Json", "aria.templates.DomElementWrapper", "aria.utils.Html",
                "aria.templates.DomEventWrapper", "aria.utils.IdManager", "aria.templates.SectionWrapper",
                "aria.utils.DomOverlay"],
        $onload : function () {
            idMgr = new aria.utils.IdManager("s");
        },
        $onunload : function () {
            idMgr.$dispose();
            idMgr = null;
        },
        /**
         * Constructor
         * @param {aria.templates.TemplateCtxt} tplCtxt
         * @param {aria.templates.CfgBeans:SectionCfg} configuration of this section (id, type, ...).
         */
        $constructor : function (tplCtxt, cfg, options) {
            var binding, bindings, id, type;

            /**
             * Array of objects which are either a section (recognizable through its _type property = TYPE_SECTION) or
             * the following structure: {_type: TYPE_BEHAVIOR, behavior: behavior, id: id }
             * @protected
             * @type Array
             */
            this._content = [];

            /**
             * Section which contains this section, or null if this section has no parent (either it has not been
             * included in the template section tree yet, or it is the root of a template section tree)
             * @type aria.templates.Section
             */
            this.parent = null;

            /**
             * The following variable is set to true when init has been done.
             * @protected
             * @type Boolean
             */
            this._initWidgetsDone = false;

            /**
             * HTML content of the section. Maybe null for subsections.
             * @type String
             */
            this.html = null;

            /**
             * List of bindings done for this section
             * @protected
             * @type Array
             */
            this._bindings = [];

            /**
             * Binding between processing indicator and this section
             * @protected
             * @type Object
             */
            this._processing = null;

            /**
             * Overlay id, in case a processing indicator is linked to this section.
             * @protected
             * @type String
             */
            this._overlayId = null;

            /**
             * Array of delegateIds
             * @type Array
             */
            this.delegateIds = [];

            /**
             * Configuration has gone OK
             * @type Boolean
             */
            this.cfgOk = true;

            /**
             * Template context of this section
             * @type aria.templates.TemplateCtxt
             */
            this.tplCtxt = tplCtxt;

            /**
             * List of callback for on statements in this section
             * @type Array
             */
            this.delegateCallbacks = [];

            /**
             * Specificies that this section is a root section (content of a template, without name of id)
             * @type Boolean
             */
            this.isRoot = (options && options.isRoot === true);

            /**
             * Id map of the section. It is only present on root sections and on sections which have been added to the
             * root section. Sub-sections reuse the idMap of their parent section.
             * @type Object
             */
            this.idMap = (options && options.ownIdMap) ? {} : null;

            /**
             * The widget configuration, as declared in the template.
             * @protected
             * @type Object
             */
            this._cfg = cfg;

            this._normalizeCallbacks();

            /**
             * Id for event delegation (used for keyboard navigation and events specified in section configuration)
             * @type String
             */
            this.delegateId = aria.utils.Delegate.add({
                fn : this._onDomEvent,
                scope : this
            });

            // stop here for root context
            if (this.isRoot) {
                return;
            }

            // normalize configuration
            this.cfgOk = aria.core.JsonValidator.validateCfg("aria.templates.CfgBeans." + this.$class + "Cfg", cfg, {
                msg : this.INVALID_CONFIGURATION,
                params : [this.tplCtxt.tplClasspath, cfg.id]
            });
            if (!this.cfgOk) {
                return;
            }

            type = cfg.type;
            bindings = cfg.bindRefreshTo;
            id = cfg.id;

            var domId;
            if (id) {
                if (!regexpForId.test(id)) {
                    this.$logError(this.INVALID_SECTION_ID, [this.tplCtxt.tplClasspath, id]);
                    this.cfgOk = false;
                    return;
                }

                if (id.indexOf('+') > -1) {
                    if (Aria.testMode) {
                        domId = this.tplCtxt.$getAutoId(id);
                    }
                    // From the application's point of view, an id with a '+' inside it is equivalent to no id at all.
                    // We only use the id with a '+' inside it to generate the id used in the DOM
                    delete cfg.id;
                    id = null;
                }

            }

            /**
             * DOM type for this section
             * @type String
             */
            this.domType = type;

            /**
             * Specify the DomId for the section
             * @type String
             */
            this._domId = domId || (id ? this.tplCtxt.$getId(id) : this._createDynamicId());

            /**
             * Id of the section
             * @type String
             */
            this.id = id || "_gen_" + this._domId;

            /**
             * CSS class for the section
             * @type String
             */
            this.cssClass = cfg.cssClass;

            /**
             * Configuration for keyboard shortcuts
             * @type Object
             */
            this.keyMap = cfg.keyMap;

            /**
             * Configuration for table navigation
             * @type Object
             */
            this.tableNav = cfg.tableNav;

            /**
             * Processing label of this section
             * @type String
             */
            this.processingLabel = cfg.processingLabel;

            /**
             * Don't change the processing indicator. Flag to avoid updating the datamodel more than once
             * @type Boolean
             * @private
             */
            this.__skipProcessingChange = false;

            /**
             * Macro to use when refreshing the section.
             * @type aria.templates.CfgBeans:MacroCfg
             */
            this.macro = cfg.macro ? tplCtxt.checkMacro(cfg.macro) : null;

            /**
             * SectionWrapper object
             * @type aria.templates.SectionWrapper
             */
            this.wrapper = null;

            // register binding on this section
            for (var i = 0; binding = bindings[i]; i++) {
                this.registerBinding(binding, this._notifyDataChange);
            }

            // register binding to the processing indicator
            this.registerProcessing(cfg.bindProcessingTo);

            /**
             * TODOC
             * @type Object
             * @protected
             */
            this._refreshMgrInfo = null;

            /**
             * Html attributes of the section
             * @type aria.templates.CfgBeans:HtmlAttribute
             */
            this.attributes = cfg.attributes;

            // register binding for attributes
            var attributeBind = (cfg.bind && cfg.bind.attributes) ? cfg.bind.attributes : null;
            if (attributeBind) {
                this.attributes = attributeBind.inside[attributeBind.to];
                this.registerBinding(attributeBind, this._notifyAttributeChange);
            }
        },
        $destructor : function () {

            this.disposeProcessingIndicator();
            this.removeDelegateIdsAndCallbacks();
            this._releaseAllDynamicIds();

            // remove delegation for this section
            if (this.delegateId) {
                aria.utils.Delegate.remove(this.delegateId);
                this.delegateId = null;
            }

            if (this._content) {
                this.removeContent();
                if (this.id && this.idMap) {
                    this.idMap[this.id] = null;
                    delete this.idMap[this.id];
                }
                this._content = null;
                this.idMap = null;
            }
            var parent = this.parent;
            if (parent) {
                this.parent = null;
                parent.removeSubSection(this);
            }

            if (this._listenersStopped !== true) {
                this.stopListeners();
            }
            this._processing = null;

            this.setDom(null);
            this.html = null;
            this._refreshMgrInfo = null;
            this.tplCtxt = null;
            this._cfg = null;
        },
        $events : {
            "beforeRemoveContent" : "Raised just before the section content is disposed.",
            "afterRemoveContent" : "Raised just after the section content is disposed."
        },
        $statics : {
            // ERROR MESSAGES:
            MISSING_TO_BINDING : "Invalid Binding Configuration: 'to' is mandatory",
            INVALID_TO_BINDING : "Invalid Binding Configuration: 'to' must be a Boolean value or null",
            WIDGETCALL_ERROR : "Error in '%2' for widget '%1'.",
            INVALID_SECTION_ID : "Error in template '%1': invalid section id '%2'.",
            SECTION_ALREADY_EXISTS : "Error in template '%1': section uses already used id '%2'.",
            SECTION_BINDING_ERROR : "Section binding failed. Inside: %1, to: %2. Section id: %3, template: %4.",
            INVALID_CONFIGURATION : "Error in template '%1': invalid configuration for section id '%2'.",
            WIDGET_ID_NOT_UNIQUE : "The %1 widget with id %2 does not have a unique id",
            SECTION_CALLBACK_ERROR : "The callback function raised an exception. Template: '%1'\nSection: '%2'\nEvent: '%3' "

        },
        $prototype : {

            /**
             * Prototype init method called at prototype creation time Allows to store class-level objects that are
             * shared by all instances
             * @param {Object} p the prototype object being built
             * @param {Object} def the class definition
             * @param {Object} sdef the superclass class definition
             */
            $init : function (p, def, sdef) {
                p.__navigationManager = aria.templates.NavigationManager;
                p.__json = aria.utils.Json; // shortcut
            },

            // type used to identify the sections in the behaviours
            _type : TYPE_SECTION,

            /**
             * Initialize the widgets contained in the section if not already done
             * @return {Array} List of element that will be rendered later on
             */
            initWidgets : function () {
                var differed = [];
                // it is possible, with the dialog, that we insert an already initialized section inside a non
                // initialized section
                if (this._initWidgetsDone) {
                    return differed;
                }
                this._initWidgetsDone = true;
                this.html = null; // html should no longer be used once widgets are initialized
                var content = this._content;
                var contentSize = content.length;
                for (var i = 0; i < contentSize; i++) {
                    var elt = content[i];
                    // case widget
                    if (elt._type == TYPE_BEHAVIOR) {
                        var bhv = elt.behavior;
                        if (bhv.initWidget) {
                            try {
                                bhv.initWidget();
                                if (bhv.isDiffered) {
                                    differed.push(bhv);
                                }
                            } catch (e) {
                                this.$logError(this.WIDGETCALL_ERROR, [bhv.$classpath, "initWidget"], e);
                            }

                        }
                    } else { // case section
                        differed = differed.concat(elt.initWidgets());
                    }
                }
                // The following line displays the processing indicator on the section (if needed)
                this.refreshProcessingIndicator();
                return differed;
            },

            /**
             * Remove any content from the section. The dom is not modified by this call.
             */
            removeContent : function () {

                this.$raiseEvent("beforeRemoveContent");
                // so that the children section can see that it is useless to remove themselves from
                // their parent:
                this._removingContent = true;
                var content = this._content;
                var contentLength = content.length;
                for (var i = 0; i < contentLength; i++) {
                    var elt = content[i];
                    if (elt._type == TYPE_BEHAVIOR) {
                        var bhv = elt.behavior;
                        if (elt.id && this.idMap) {
                            this.idMap[elt.id] = null;
                            delete this.idMap[elt.id];
                        }
                        bhv.$dispose();
                    } else {
                        elt.$dispose();
                    }
                }
                this._content = [];
                this._initWidgetsDone = false;
                this._removingContent = false;
                this.$raiseEvent("afterRemoveContent");
            },

            /**
             * Remove the delegateIds from the aria.utils.Delegate maps and disposes the delegated callbacks
             */
            removeDelegateIdsAndCallbacks : function () {
                // remove delegation done with "on" statement
                if (this.delegateIds) {
                    for (var i = 0, l = this.delegateIds.length; i < l; i++) {
                        aria.utils.Delegate.remove(this.delegateIds[i]);
                    }
                    this.delegateIds = [];
                }
                for (var i = 0, l = this.delegateCallbacks.length; i < l; i++) {
                    this.delegateCallbacks[i].$dispose();
                }
                this.delegateCallbacks = [];

            },
            /**
             * Register a widget in this section
             * @param {Object} bhv the behaviour to add to this section
             */
            addBehavior : function (bhv) {
                var bhvId = (bhv.getId ? bhv.getId() : null);

                var element = {
                    _type : TYPE_BEHAVIOR,
                    behavior : bhv,
                    section : this,
                    id : bhvId
                };

                if (bhvId && this.idMap) {
                    if (this.idMap[bhvId]) {
                        // TODO: change error message as this may be, in the future, other things than a widget
                        // TODO: add context info
                        this.$logError(this.WIDGET_ID_NOT_UNIQUE, [this.tplCtxt.tplClasspath, bhvId, bhv.$class]);
                        element.id = null;
                    } else {
                        this.idMap[bhvId] = element;
                    }
                }
                this._content.push(element);
            },

            /**
             * Returns a behaviour with given id from this section
             * @param {String} id
             */
            getBehaviorById : function (id) {
                var res = this.idMap ? this.idMap[id] : null;
                if (res && res._type == TYPE_BEHAVIOR) {
                    return res.behavior;
                }
                return null;
            },

            /**
             * Returns a section with given id from this section
             * @param {String} id
             */
            getSectionById : function (id) {
                var res = this.idMap ? this.idMap[id] : null;
                if (res && res._type == TYPE_SECTION) {
                    return res;
                }
                return null;
            },

            /**
             * It is more efficient to have an empty or small sub-section. The size of the current section or its
             * ancestors has no impact. addSubSection add elements from the subsection to its parent map (used for
             * retrieving elements) and replace map of subsection
             * @param {aria.templates.Section} subSection
             */
            addSubSection : function (subSection) {
                this.$assert(141, !subSection.parent);
                this.$assert(142, subSection._type == TYPE_SECTION);
                this.$assert(143, subSection.tplCtxt == this.tplCtxt);
                subSection.parent = this;
                subSection.__updateIdMap(this.idMap);
                this._content.push(subSection);
            },

            /**
             * Used to replace the sub-sections idMap with the one from the parent, and to add to the parent's map the
             * ids from sub-sections
             * @param {Object} idMap
             * @private
             */
            __updateIdMap : function (idMap) {
                if (this.idMap == idMap) {
                    // already the same id map (especially useful if both are null)
                    return;
                }
                // set child idMap to its parent value
                this.idMap = idMap;
                var id = this.id;
                if (id && idMap) {
                    if (idMap[id]) {
                        this.$logError(this.SECTION_ALREADY_EXISTS, [this.tplCtxt.tplClasspath, id]);
                    } else {
                        idMap[id] = this;
                    }
                }
                var content = this._content;
                var contentSize = content.length;
                // add the ids found in this section to the parent map:
                // and recursively call __updateIdMap
                for (var i = 0; i < contentSize; i++) {
                    var elt = content[i];
                    if (elt._type == TYPE_SECTION) {
                        elt.__updateIdMap(idMap);
                    } else {
                        id = elt.id;
                        if (id && idMap) {
                            if (idMap[id]) {
                                this.$logError(this.WIDGET_ID_NOT_UNIQUE, [this.tplCtxt.tplClasspath, id,
                                        elt.behavior.$class]);
                            } else {
                                idMap[id] = elt;
                            }
                        }
                    }
                }
            },

            /**
             * Remove a subsection
             * @param {aria.templates.Section} subSection
             */
            removeSubSection : function (subSection) {
                // filter the case where the parent is controlling itself the removal
                if (!this._removingContent) {
                    aria.utils.Array.remove(this._content, subSection);
                }
            },

            /**
             * RegisterBinding is used to add bindings to Templates and sections.
             * @public
             * @param {Object} bind
             * @param {Object} callback
             *
             * <pre>
             *  {
             *      inside : ...
             *      to : ...
             *  }
             * </pre>
             */
            registerBinding : function (bind, callback) {

                // register as listener for the bindings defined for this control:
                if (bind) {
                    var jsonChangeCallback = {
                        fn : callback || this._notifyDataChange,
                        scope : this,
                        args : {
                            tplCtxt : this.tplCtxt
                        }
                    };

                    // addListener throws errors
                    try {
                        // normalize recursive
                        bind.recursive = bind.recursive !== false;
                        this.__json.addListener(bind.inside, bind.to, jsonChangeCallback, true, bind.recursive);
                        // save for disposal
                        this._bindings.push({
                            inside : bind.inside,
                            callback : jsonChangeCallback,
                            to : bind.to,
                            recursive : bind.recursive
                        });
                    } catch (e) {
                        this.$logError(this.SECTION_BINDING_ERROR, [bind.inside, bind.to, this.id,
                                this.tplCtxt.tplClasspath]);
                    }

                }
            },

            /**
             * Check if the binding given is valid for a processing indicator. "to" is mandatory and must be a boolean
             * value
             * @param {Object} bind
             *
             * <pre>
             *  {
             *      inside : ...
             *      to : ...
             *  }
             * </pre>
             *
             * @return {Boolean} true is the binding is valid
             * @private
             */
            __isValidProcessingBind : function (bind) {
                if (bind.to == null) {
                    // bind.to is mandatory
                    this.$logError(this.MISSING_TO_BINDING);
                    return false;
                }

                var bindedValue = bind.inside[bind.to];
                if (bindedValue == null || aria.utils.Type.isBoolean(bindedValue)) {
                    // If it is bound to something that doesn't exist or a boolean, it is valid
                    return true;
                }

                this.$logError(this.INVALID_TO_BINDING);
                return false;
            },

            /**
             * Add bindings to loading overlay and sections.
             * @public
             * @param {Object} bind
             *
             * <pre>
             *  {
             *      inside : ...
             *      to : ...
             *  }
             * </pre>
             */
            registerProcessing : function (bind) {
                if (!this.__isValidProcessingBind(bind)) {
                    return;
                }

                this.registerBinding(bind, this._notifyProcessingChange);

                // save for later use and disposal
                this._processing = {
                    inside : bind.inside,
                    to : bind.to
                };
            },

            /**
             * Set the state of the processing indicator. It updates the datamodel if the section has a processing
             * binding
             * @param {Boolean} visible True if the loading indicator should be visible
             * @param {String} message Text message to display inside the loading indicator
             */
            setProcessingIndicator : function (visible, message) {
                visible = !!visible;
                var alreadyVisible = !!this._overlayId;

                if (visible !== alreadyVisible) {
                    if (visible) {
                        this._overlayId = aria.utils.DomOverlay.create(this.getDom(), message);
                    } else {
                        this.disposeProcessingIndicator();
                    }

                    var processing = this._processing;
                    if (processing) {
                        // Update the value in the datamodel (someone else might be listening to it)
                        this.__skipProcessingChange = true;
                        this.__json.setValue(processing.inside, processing.to, visible);
                        this.__skipProcessingChange = false;
                    }
                } else if (visible) {
                    // refresh the overlay
                    aria.utils.DomOverlay.overlays[this._overlayId].refresh();
                }
            },

            /**
             * Refresh the status of the processing indicator above this section. This is called after a template
             * refresh to display again the loading overlay above a section bound to the datamodel
             * @param {Boolean} recursive if true the refresh is done on all subsections and subtemplates
             */
            refreshProcessingIndicator : function (recursive) {
                if (recursive) {
                    var content = this._content;
                    for (var i = 0, len = content.length; i < len; i++) {
                        if (content[i].refreshProcessingIndicator) {
                            content[i].refreshProcessingIndicator(true);
                        } else if (content[i].behavior && content[i].behavior.subTplCtxt) {
                            content[i].behavior.subTplCtxt.refreshProcessingIndicator();
                        }
                    }
                }
                var processing = this._processing, isBound = !!processing;

                if (isBound && processing.inside[processing.to]) {
                    // Display the loading indicator
                    this.setProcessingIndicator(true, this.processingLabel);
                }
            },

            /**
             * Remove the processing indicator from this section, if any.
             */
            disposeProcessingIndicator : function () {
                if (this._overlayId) {
                    aria.utils.DomOverlay.disposeOverlays([this._overlayId]);
                    this._overlayId = null;
                }
            },

            /**
             * JSON listener callback: called anytime a bindable property value has changed on a holder object defined
             * in one of the bindings
             * @protected
             * @param {Object} res Object containing information about the data that changed
             * @param {Object} args Custom arguments
             * @see initWidget()
             */
            _notifyDataChange : function (res, args) {
                if (!this._initWidgetsDone || !args.tplCtxt._cfg || !args.tplCtxt._cfg.tplDiv) {
                    return;
                }
                if (this.macro) {
                    args.tplCtxt.$refresh({
                        section : this.id,
                        macro : this.macro
                    });
                } else {
                    args.tplCtxt.$refresh({
                        filterSection : this.id
                    });
                }
            },

            /**
             * JSON listener callback: called anytime a bindable attribute property has changed on a holder object
             * defined in one of the bindings
             * @protected
             * @param {Object} res Object containing information about the attribute that changed
             * @see initWidget()
             */
            _notifyAttributeChange : function (res) {
                var attribute, domElt = this.getDom(), deleteAttribute;
                // determine if multiple attributes have changed
                if (this._cfg.bind && res.dataName === this._cfg.bind.attributes.to) {
                    // remove old members
                    for (attribute in res.oldValue) {
                        if (res.oldValue.hasOwnProperty(attribute) && !res.newValue[attribute]) {
                            domElt.removeAttribute(attribute);
                        }
                    }
                    // add new members
                    for (attribute in res.newValue) {
                        if (res.newValue.hasOwnProperty(attribute) && !aria.utils.Json.isMetadata(attribute)
                                && aria.templates.DomElementWrapper.attributesWhiteList.test(attribute)
                                && res.newValue[attribute] !== res.oldValue[attribute]
                                && res.newValue[attribute] != null) {
                            domElt.setAttribute(attribute, res.newValue[attribute]);
                        }
                    }
                    // check if an individual attribute has changed
                } else if (aria.templates.DomElementWrapper.attributesWhiteList.test(res.dataName)
                        && res.newValue !== res.oldValue) {
                    deleteAttribute = (!res.newValue) ? true : false;
                    if (deleteAttribute) {
                        domElt.removeAttribute(res.dataName, res.newValue);
                    } else {
                        domElt.setAttribute(res.dataName, res.newValue);
                    }
                }
            },

            /**
             * JSON listener callback: called anytime the processing property value has changed on a holder object
             * defined in the binding
             * @protected
             * @param {Object} res Object containing information about the data that changed
             *
             * <pre>
             * {
             *   dataHolder : {Object},
             *   dataName : {String},
             *   newValue : {Object},
             *   oldValue : {Object}
             * }
             * </pre>
             */
            _notifyProcessingChange : function (res) {
                // Check that the binding is correct and the value updated
                if (this.__skipProcessingChange) {
                    return;
                }

                // set/unset the loading indicator
                this.setProcessingIndicator(res.newValue, this.processingLabel);
            },

            /**
             * Get a wrapper on this section
             * @return {aria.templates.SectionWrapper} SectionWrapper
             */
            getWrapper : function () {
                var wrapper = this.wrapper;
                if (!wrapper) {
                    this.wrapper = wrapper = new aria.templates.SectionWrapper(this.getDom(), this);
                }

                return wrapper;
            },

            /**
             * Write the beginning of the DOM source for the section container
             * @param {aria.templates.MarkupWriter} out
             */
            writeBegin : function (out) {
                if (this.domType) {
                    // if domType is empty, we do not output anything for the section
                    // (used in the tooltip)
                    var cssClass = this.cssClass ? ' class="' + this.cssClass + '"' : '';
                    var attributeList = this.attributes ? aria.utils.Html.buildAttributeList(this.attributes) : '';
                    var h = ['<', this.domType, attributeList, cssClass, ' id="', this._domId, '" ',
                            aria.utils.Delegate.getMarkup(this.delegateId), '>'];
                    out.write(h.join(''));// opening the section
                }
            },
            /**
             * Write the end of the DOM source for the section container
             * @param {aria.templates.MarkupWriter} out
             */
            writeEnd : function (out) {
                if (this.domType) {
                    // if domType is empty, we do not output anything for the section
                    // (used in the tooltip)
                    out.write('</' + this.domType + '>');// closing the section
                }
            },

            /**
             * Event handler for keyboard navigation
             * @param {aria.DomEvent} evt
             */
            _onDomEvent : function (evt) {
                // forward event and configuration to a dedicated handler
                this.__navigationManager.handleNavigation(this.keyMap, this.tableNav, evt);

                if (this._cfg && this._cfg.on) {
                    var callback = this._cfg.on[evt.type];
                    if (callback) {
                        var wrapped = new aria.templates.DomEventWrapper(evt), returnValue;
                        try {
                            returnValue = callback.fn.call(callback.scope, wrapped, callback.args);
                        } catch (e) {
                            this.$logError(this.SECTION_CALLBACK_ERROR, [this.tplCtxt.tplClasspath, this._cfg.id,
                                    evt.type], e);
                        }
                        wrapped.$dispose();
                        return returnValue;
                    }
                }
            },
            /**
             * Since event's callback can have several signatures as specified in aria.widgetLibs.CommonBeans.Callback
             * this function normalizes the callbacks for later use. It will also ask Delegate to generate a delegateId
             * if needed.
             * @protected
             */
            _normalizeCallbacks : function () {
                var eventListeners = this._cfg ? this._cfg.on : null;
                if (eventListeners) {
                    for (var listener in eventListeners) {
                        if (eventListeners.hasOwnProperty(listener)) {
                            eventListeners[listener] = this.$normCallback(eventListeners[listener]);
                        }
                    }
                }
            },

            /**
             * Copy this section configuration on another section. Note that this method should only be used with
             * targetSections that have no idMap.
             * @param {aria.templates.Section} targetSection
             */
            copyConfigurationTo : function (targetSection) {
                this.$assert(708, targetSection.idMap == null); // check that there is no id map so that it is not a
                // problem to change the id
                targetSection.id = this.id;
                targetSection.domType = this.domType;
                targetSection.tableNav = this.tableNav;
                targetSection.keyMap = this.keyMap;
                targetSection.macro = this.macro;
            },

            /**
             * FIXME: missing doc
             * @param {Object} args
             */
            notifyRefreshPlanned : function (args) {
                var refreshMgrInfo = this._registerInRefreshMgr();
                refreshMgrInfo.queue = null;
                refreshMgrInfo.refreshArgs = args;
            },

            /**
             * FIXME: missing doc
             * @protected
             */
            _registerInRefreshMgr : function () {
                var refreshMgrInfo = this._refreshMgrInfo;
                if (!refreshMgrInfo) {
                    refreshMgrInfo = {
                        refreshArgs : null,
                        queue : []
                        // queue is used in the repeater
                    };
                    this._refreshMgrInfo = refreshMgrInfo;
                    aria.templates.RefreshManager.queue({
                        fn : this._refreshManagerCallback,
                        scope : this
                    }, this);
                }
                return refreshMgrInfo;
            },

            /**
             * FIXME: missing doc
             * @protected
             */
            _refreshManagerCallback : function () {
                var refreshMgrInfo = this._refreshMgrInfo;
                if (!refreshMgrInfo) {
                    // may have already been disposed
                    return;
                }
                this._refreshMgrInfo = null;
                var queue = refreshMgrInfo.queue;
                if (!queue) {
                    this.tplCtxt.$refresh(refreshMgrInfo.refreshArgs);
                }
            },

            /**
             * Method called when this section is about to be refreshed.
             * @param {aria.templates.CfgBeans:GetRefreshedSectionCfg} args arguments given to the getRefreshedSection
             * method. The arguments are modified to add default parameters (macro) if not specified.
             */
            beforeRefresh : function (args) {
                var sectionMacro = this.macro;
                if (sectionMacro) {
                    // a macro is defined in the section, it is the default macro to use when refreshing
                    if (!args.macro) {
                        args.macro = sectionMacro;
                    } else {
                        var targetMacro = args.macro;
                        if (aria.utils.Type.isObject(targetMacro) && !targetMacro.name) {
                            targetMacro.name = sectionMacro.name;
                            targetMacro.scope = sectionMacro.scope;
                            if (!targetMacro.args) {
                                targetMacro.args = sectionMacro.args;
                            }
                        }
                    }
                }
                // Remove cached reference to the dom element, as it may change during the refresh
                // (occurs in tables in IE)
                this._domElt = null;
            },

            /**
             * Return the dom element corresponding to this section.
             * @return {HTMLElement}
             */
            getDom : function () {
                if (!this._domElt) {
                    this._domElt = aria.utils.Dom.getElementById(this._domId);
                }
                return this._domElt;
            },

            /**
             * Set the dom element corresponding to this section.
             * @param {HTMLElement} dom
             */
            setDom : function (dom) {
                this._domElt = dom;
                if (this.wrapper) {
                    // The wrapper may contain a reference to the old DOM element
                    this.wrapper.$dispose();
                    this.wrapper = null;
                }
            },

            /**
             * Create a dynamic id to be used in the markup generated by the widget in order to get a reference to the
             * corresponding DOM element later (for example in initWidget).
             * @return {String}
             */
            _createDynamicId : function () {
                var res = idMgr.getId();
                if (this._dynamicIds) {
                    this._dynamicIds.push(res);
                } else {
                    this._dynamicIds = [res];
                }
                return res;
            },

            /**
             * Release all dynamic ids created with _createDynamicId, so that they can be reused for other widgets.
             */
            _releaseAllDynamicIds : function () {
                var dynamicIds = this._dynamicIds;
                if (dynamicIds) {
                    for (var i = dynamicIds.length - 1; i >= 0; i--) {
                        idMgr.releaseId(dynamicIds[i]);
                    }
                    this._dynamicIds = null;
                }
            },

            /**
             * Move the content of this section to another section, and initialize section widgets if widgets are
             * already initialized in the target section. Note that this method should only be used on sections with no
             * idMap.
             * @param {aria.templates.Section} targetSection
             * @return {Array} List of element that will be rendered later on
             */
            moveContentTo : function (targetSection) {
                var content = this._content;
                this.$assert(805, this.idMap == null);
                this.$assert(806, content);
                var targetContent = targetSection._content;
                var targetLength = targetContent.length;
                // first move all children from this to target _content array
                // updating the parent reference for sections
                for (var i = 0, l = content.length; i < l; i++) {
                    var item = content[i];
                    targetContent[targetLength + i] = item;
                    if (item._type == TYPE_SECTION) {
                        item.parent = targetSection;
                    }
                }
                // then register content in the target idMap
                this.__updateIdMap(targetSection.idMap);

                // move the {on...} statement callbacks:
                targetSection.delegateIds = targetSection.delegateIds.concat(this.delegateIds);
                targetSection.delegateCallbacks = targetSection.delegateCallbacks.concat(this.delegateCallbacks);
                this.delegateIds = [];
                this.delegateCallbacks = [];

                // and initialize widgets
                var res = null;
                if (targetSection._initWidgetsDone) {
                    res = this.initWidgets();
                }
                // set back idMap to null (may have been changed by __updateIdMap)
                this.idMap = null;
                // this section becomes empty:
                this._content = [];

                return res;
            },

            /**
             * Stop listeners on this section: bindings and processing
             */
            stopListeners : function () {
                this.$assert(838, this._listenersStopped !== true);
                this._listenersStopped = true;
                var bindings = this._bindings;
                if (bindings) {
                    // remove binding
                    for (var index = 0, bind; bind = bindings[index]; index++) {
                        // remove the recursive listener
                        this.__json.removeListener(bind.inside, bind.to, bind.callback, bind.recursive);
                    }
                }
            },

            /**
             * Resume listeners on this section: bindings and processing
             */
            resumeListeners : function () {
                this.$assert(859, this._listenersStopped === true);
                this._listenersStopped = false;
                var bindings = this._bindings;
                if (bindings) {
                    for (var index = 0, bind; bind = bindings[index]; index++) {
                        this.__json.addListener(bind.inside, bind.to, bind.callback, true, bind.recursive);
                    }
                }
            },

            /**
             * Write the content of the section, if any (used if a macro is specified in the section configuration).
             * @param {aria.templates.MarkupWriter} out
             */
            writeContent : function (out) {
                // if a macro is defined in the section, call it
                if (this.macro) {
                    out.callMacro(this.macro);
                }
            }

        }
    });
})();
