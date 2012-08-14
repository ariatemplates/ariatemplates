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

/**
 * Base class from which all class loaders inherit. <br />
 * Each class loader must override the <code>_loadClass</code> method to define the action when receiving a class
 * definition. Manage the load of the class files and the synchronization of the class load when all declared
 * dependencies are ready
 */
Aria.classDefinition({
    $classpath : "aria.core.ClassLoader",
    $events : {
        "classReady" : {
            description : "notifies that all class dependencies (and the ref class if any) have been loaded and are ready to use",
            properties : {
                refClasspath : "{String} classpath of the reference class if any"
            }
        },
        "classError" : {
            description : "notifies that the class loading process has failed",
            properties : {
                refClasspath : "{String} classpath of the reference class if any"
            }
        },
        "complete" : {
            description : "notifies that the class loader process is done and that it can be disposed (thus classReady listeners have already been called when this event is raised)",
            properties : {
                refClasspath : "{String} classpath of the reference class if any"
            }
        }
    },

    /**
     * Class loader constructor
     * @param {String} refClasspath reference classpath which this loader is associated to (may be null)
     */
    $constructor : function (refClasspath, classType) {
        /**
         * Reference classpath. It's the classpath of the expected class
         * @type String
         */
        this._refClasspath = refClasspath;
        if (refClasspath) {
            /**
             * Reference logical path. It's the logical path corresponding to the reference classpath
             * @type String
             */
            this._refLogicalPath = aria.core.ClassMgr.getBaseLogicalPath(refClasspath, classType);
        }

        /**
         * Full logical classpath. It's the complete logical path. It might differ from the reference logical path for
         * the presence of additional information like locale/language in resources
         * @type String
         */
        this._fullLogicalPath = null;

        /**
         * Callback to be executed when tha class is loaded. At this time, we don't know which function to call back to
         * load the class, after all its dependencies are loaded (it can be loadClass or loadBean..., depending on the
         * content of the js file). This should be set by extending classes
         * @type aria.core.CfgBeans.Callback
         */
        this.callback = null;

        /**
         * Array of missing dependencies - items have the following structure:
         *
         * <pre>
         * {
         *    classpath : '',
         *    isReady : true/false,
         *    loader : {Object}
         * }
         * </pre>
         *
         * Can either be null (meaning no dependency is missing) or a non-empty array (meaning we are waiting for these
         * dependencies to be ready)
         * @protected
         * @type Array
         */
        this._mdp = null;

        /**
         * Is true if there were errors while retrieving missing dependencies. It becomes true when you call
         * <code>addDependecies</code> with wrong parameters or when one of the missing dependencies raises a class
         * error event
         * @protected
         * @type Boolean
         */
        this._mdpErrors = false;

        /**
         * Each class has its own instance of the class loader. This flag marks the class loader as busy in case the
         * class is required more than once
         * @protected
         * @type Boolean
         */
        this._isLoadingRefDefinition = false;

        /**
         * Whether the class definition was called after an Aria.eval. If this is still false after evaluating the file,
         * it means that an error occurred
         * @protected
         * @type Boolean
         */
        this._classDefinitionCalled = false;

        /**
         * Whether error should be logged or not
         * @type Boolean
         */
        this.handleError = true;
    },
    $statics : {
        // ERROR MESSAGES:
        CLASS_LOAD_FAILURE : "Class definition for %1 cannot be loaded.",
        CLASS_LOAD_ERROR : "Load of class %1 failed",
        CLASS_LOAD_MISSING_REF : "ClassLoader.loadClassDefinition() cannot be called if no reference classpath is defined.",
        MISSING_CLASS_DEFINITION : "Error: the definition of class '%2' was not found in logical path '%1' - please check the classpath defined in this file."
        // note: MISSING_CLASS_DEFINITION is used only in sub-classes (not in this class)
    },
    $prototype : {

        /**
         * Load the class definition associated to the ref class path
         */
        loadClassDefinition : function () {
            if (this._isLoadingRefDefinition) {
                return;
            }
            this._isLoadingRefDefinition = true;

            if (this._refClasspath == null) {
                this.$logError(this.CLASS_LOAD_MISSING_REF);
                return;
            }

            // warning: may be synchronous if the file has already been downloaded
            aria.core.DownloadMgr.loadFile(this.getRefLogicalPath(), {
                fn : this._onClassDefinitionReceive,
                scope : this
            }, {
                fullLogicalPath : this._fullLogicalPath
            });
        },

        /**
         * Get the logical file path associated to the reference class path
         * @return {String}
         */
        getRefLogicalPath : function () {
            return this._refLogicalPath;
        },

        /**
         * Internal callback called when the class definition file has been downloaded
         * @param {aria.core.FileLoader.$events.fileReady} evt
         * @return {Boolean} Whether there was an error or not
         * @protected
         */
        _onClassDefinitionReceive : function (evt) {

            var lp = this.getRefLogicalPath(), classdef = aria.core.DownloadMgr.getFileContent(lp), error = false;
            if (!classdef) {
                // a problem occured..
                if (this.handleError) {
                    this.$logError(this.CLASS_LOAD_FAILURE, this._refClasspath);
                }
                error = true;
            } else {
                try {
                    // Load the class definition file, depending on its type
                    this._loadClass(classdef, lp);
                } catch (ex) {
                    if (this.handleError) {
                        this.$logError(this.CLASS_LOAD_ERROR, [this._refClasspath], ex);
                    }
                    error = true;
                }
            }
            if (error) {
                aria.core.ClassMgr.notifyClassLoadError(this._refClasspath);
            }
            lp = classdef = null;
            return error;
        },

        /**
         * abstract function to be replaced in inherited classes
         * @private
         */
        _loadClass : function (classDef, logicalPath) {
            this.$assert(204, false);
        },

        /**
         * Add classpaths as dependencies associated to the main class. <br />
         * After calling this method (maybe several times), you should immediately call the
         * <code>loadDependencies</code> method to effectively load the added dependencies. This supposes that the
         * reference class definition has already been loaded
         * @param {Array} mdp list of missing dependency classpaths, or false to specify that some dependencies cannot
         * be loaded
         * @param {String} depType type of dependency
         */
        addDependencies : function (mdp, depType) {
            if (mdp == false) {
                // some dependencies could not be loaded
                this._mdpErrors = true;
                return;
            }
            var sz = mdp.length, loader, cp, cm = aria.core.ClassMgr;
            for (var i = 0; sz > i; i++) {
                cp = mdp[i];
                loader = cm.getClassLoader(cp, depType);
                if (loader) {
                    // forward error policy
                    loader.handleError = this.handleError;

                    // class not already loaded: create an entry in _mdp
                    if (!this._mdp) {
                        this._mdp = [];
                    }
                    this._mdp.push({
                        loader : loader,
                        classpath : cp,
                        isReady : false
                    });
                    // register to know when it is loaded
                    // (we must register here, to be notified on all loaded dependencies;
                    // if we do it only in the loadDependencies method, some dependencies may be loaded
                    // before we register on this event and we loose the info)
                    loader.$on({
                        "classReady" : this._onMdpLoad,
                        "classError" : this._onMdpLoad,
                        scope : this
                    });
                }
            }
            loader = cm = null;
        },

        /**
         * Load the dependencies added through the addDependencies method. This method should be called immediately
         * after the addDependencies method.
         */
        loadDependencies : function () {
            var dependencies = this._mdp;
            if (dependencies) {
                var length = dependencies.length;
                for (var i = 0; i < length; i += 1) {
                    var waiting = dependencies[i];
                    if (!waiting.isReady) {
                        waiting.loader.loadClassDefinition();
                    }

                    // if everything is in cache, previous call may load everything, instanciate classes and nullify
                    // this._mdp
                    if (!this._mdp) {
                        break;
                    }
                }
            } else if (this._mdpErrors) {
                this._handleError();
            }
            // else simply there's nothing to do, no dependencies
        },

        /**
         * Check if given classpath is already a dependency.
         * @param {String} classpath Circular classpath to check, or nothing if initial call
         * @return {String|Boolean} classpath of circular dependency found, or true if one is found but is himself
         */
        getCircular : function (classpath) {
            if (!classpath) {
                classpath = this._refClasspath;
            } else {
                if (this._refClasspath == classpath) {
                    return true;
                }
            }
            var circular;

            if (this._mdp) {
                for (var index = 0, l = this._mdp.length; index < l; index++) {
                    circular = this._mdp[index].loader.getCircular(classpath);
                    if (circular) {
                        if (circular === true) {
                            return this._refClasspath;
                        } else {
                            return circular;
                        }
                    }
                }
            }
            return false;
        },

        /**
         * Callback called when a missing dependency class is loaded, either correctly or in error
         * @param {Object} evt classReady or classError event
         * @private
         */
        _onMdpLoad : function (evt) {
            if (evt.name === "classError") {
                this._mdpErrors = true;
            }

            var cp = evt.refClasspath;
            this.$assert(283, cp != '');
            this.$assert(284, this._mdp != null); // check that this was not disposed already
            var sz = this._mdp.length, itm, isReady = true, found = false;
            for (var i = 0; sz > i; i++) {
                itm = this._mdp[i];
                if (!found && !itm.isReady && itm.classpath == cp) {
                    // in case there is twice the same classpath in this._mdp, we mark it only once if it was not marked
                    // already because we know _onMdpClassReady will be called as many times as there are items in
                    // this._mdp
                    found = true;
                    itm.isReady = true;
                } else if (isReady) {
                    isReady = itm.isReady;
                } else if (found) {
                    // isReady is false, and the classpath which is ready is already found,
                    // it is useless to continue the loop
                    break;
                }
            }
            this.$assert(301, found === true); // make sure we always find the classpath in this._mdp

            if (!isReady) {
                return; // current loader not ready yet
            } else {
                // all dependencies are now ready
                if (this._mdpErrors) {
                    this._handleError();
                } else {
                    if (this._refClasspath != null) {
                        this.$assert(286, this.callback != null);
                        this.callback.fn.call(this.callback.scope, this.callback.args);
                    } else {
                        this._mdp = null;
                        // class loader is used to load dependencies
                        this.notifyLoadComplete();
                    }
                }
            }
        },

        /**
         * Notify the class loader error
         * @protected
         */
        _handleError : function () {
            if (this._refClasspath != null) {
                aria.core.ClassMgr.notifyClassLoadError(this._refClasspath);
            } else {
                this.notifyLoadError();
            }
        },

        /**
         * Method called by the Class Manager if the reference class could not be loaded. So we raise the classError and
         * complete events
         */
        notifyLoadError : function () {
            this.$raiseEvent({
                name : "classError",
                refClasspath : this._refClasspath
            });

            this.$raiseEvent({
                name : "complete",
                refClasspath : this._refClasspath
            });
        },

        /**
         * Method called by the Class Manager when the reference class associated to this loader is ready So we raise
         * the classReady and complete events
         */
        notifyLoadComplete : function () {
            this.$raiseEvent({
                name : "classReady",
                refClasspath : this._refClasspath
            });

            this.$raiseEvent({
                name : "complete",
                refClasspath : this._refClasspath
            });
        },

        /**
         * Method called by the Class Manager when the class definition has been called for this class. It is useful to
         * know it, so that it is possible to detect errors in the classpath declared in a the class definition.
         */
        notifyClassDefinitionCalled : function () {
            this._classDefinitionCalled = true;
        }
    }
});