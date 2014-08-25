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
var Aria = require("../Aria");
var ariaUtilsType = require("../utils/Type");
var ariaUtilsArray = require("../utils/Array");
var ariaCoreTimer = require("./Timer");


(function () {
    var typeUtils = ariaUtilsType;
    var arrayUtils = ariaUtilsArray;

    // Mechanism to find filters.
    /**
     * Filter found. Is an item of the _filters array.
     * @type MultiTypes
     * @private
     */
    var findFilterRes;
    /**
     * Filter to be found. Can be of any type accepted for the parameter of isFilterPresent.
     * @type Object
     * @private
     */
    var findFilterSearch;
    /**
     * Return false if the given value matches the search (and no other value matched it before), supposing
     * findFilterSearch is a classpath.
     * @param {Object} value An item in the _filters array.
     * @return {Boolean} false if the value matches the search, true otherwise
     * @private
     */
    var findByClasspath = function (value) {
        if (!findFilterRes && value.filterClasspath === findFilterSearch) {
            findFilterRes = value;
            return false;
        }
        return true;
    };
    /**
     * Return false if the given value matches the search (and no other value matched it before), supposing
     * findFilterSearch is a filter instance.
     * @param {Object} value An item in the _filters array.
     * @return {Boolean} false if the value matches the search, true otherwise
     * @private
     */
    var findByInstance = function (value) {
        if (!findFilterRes && value.obj === findFilterSearch) {
            findFilterRes = value;
            return false;
        }
        return true;
    };
    /**
     * Return false if the given value matches the search (and no other value matched it before), supposing
     * findFilterSearch is an object with the classpath and initArgs properties.
     * @param {Object} value An item in the _filters array.
     * @return {Boolean} false if the value matches the search, true otherwise
     * @private
     */
    var findByClasspathAndInitArgs = function (value) {
        if (!findFilterRes && value.filterClasspath === findFilterSearch.classpath && value.hasOwnProperty("initArgs")
                && value.initArgs === findFilterSearch.initArgs) {
            findFilterRes = value;
            return false;
        }
        return true;
    };
    /**
     * Initialize the search and return one of the findByClasspath, findByInstance or findByClasspathAndInitArgs
     * functions depending on the type of the search parameter.
     * @param {MultiTypes} search Filter to be found. Can be of any type accepted for the parameter of isFilterPresent.
     * @return {Function} either null (if the search parameter has an unexpected type), or a reference to one of the
     * findByClasspath, findByInstance or findByClasspathAndInitArgs functions.
     * @private
     */
    var getFindFilterFunction = function (search) {
        findFilterRes = null;
        findFilterSearch = search;
        if (typeUtils.isString(search)) {
            return findByClasspath;
        } else if (typeUtils.isInstanceOf(search, "aria.core.IOFilter")) {
            return findByInstance;
        } else if (typeUtils.isObject(search)) {
            return findByClasspathAndInitArgs;
        } else {
            return null;
        }
    };
    /**
     * Remove closure reference to filter search. This method should be called when getFindFilterFunction has done its
     * job.
     */
    var clean = function () {
        findFilterSearch = null;
    };

    /**
     * Manages filters for IO.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.core.IOFiltersMgr",
        $singleton : true,
        $constructor : function () {
            /**
             * Array of filter descriptors, each containing three properties: filterClasspath, initArgs and obj.
             * @type Array
             * @private
             */
            this._filters = null;

            /**
             * Number of filters which were specified by their classpath and were not yet loaded.
             * @type Number
             * @private
             */
            this._filtersToBeLoaded = 0;
        },
        $destructor : function () {
            var filters = this._filters, itm;
            if (filters) {
                for (var index = 0, l = filters.length; index < l; index++) {
                    itm = filters[index];
                    if (itm.obj) {
                        itm.obj.$dispose();
                        itm.obj = null;
                    }
                    itm.initArgs = null;
                }
                this._filters = null;
            }
        },
        $statics : {
            INVALID_PARAMETER_FOR_ADDFILTER : "Invalid parameter for addFilter.",
            INVALID_PARAMETER_FOR_ISFILTERPRESENT : "Invalid parameter for isFilterPresent.",
            INVALID_PARAMETER_FOR_REMOVEFILTER : "Invalid parameter for removeFilter.",
            FILTER_INSTANCE_ALREADY_PRESENT : "The same instance of the filter was already added to the list of filters."
        },
        $prototype : {
            /**
             * Add an IO filter.
             * @param {MultiTypes} newFilter It can be one of the following possibilities:
             * <ul>
             * <li>An instance of a filter class.</li>
             * <li>An object containing two properties: classpath and initArgs. In this case, the filter class with the
             * given classpath will be instantiated when needed. Its constructor will be called with the given initArgs
             * parameter.</li>
             * <li>The classpath of a filter class (equivalent to the previous case, but with a null initArgs
             * parameter).</li>
             * </ul>
             * Note that a filter class must extend aria.core.IOFilter. Two different instances of the same filter class
             * can be added at the same time. However, the same instance cannot be added twice (in that case, an error
             * is logged and this method returns false).
             * @return {Boolean} Return true if the filter was successfully added and false if there was an error (in
             * this case, an error is logged).
             */
            addFilter : function (newFilter) {
                var filterInfo = {};
                if (typeUtils.isString(newFilter)) {
                    filterInfo.filterClasspath = newFilter;
                    filterInfo.initArgs = null;
                    this._filtersToBeLoaded++;
                } else if (typeUtils.isInstanceOf(newFilter, "aria.core.IOFilter")) {
                    if (this.isFilterPresent(newFilter)) {
                        this.$logError(this.FILTER_INSTANCE_ALREADY_PRESENT);
                        return false;
                    }
                    filterInfo.filterClasspath = newFilter.$classpath;
                    filterInfo.obj = newFilter;
                } else if (typeUtils.isObject(newFilter)) {
                    filterInfo.filterClasspath = newFilter.classpath;
                    filterInfo.initArgs = newFilter.initArgs;
                    this._filtersToBeLoaded++;
                } else {
                    this.$logError(this.INVALID_PARAMETER_FOR_ADDFILTER);
                    return false;
                }
                if (!this._filters) {
                    this._filters = [];
                }
                this._filters[this._filters.length] = filterInfo;
                return true;
            },

            /**
             * Find if a filter is present in the list of filters.
             * @param {MultiTypes} filter It can be one of the following possibilities:
             * <ul>
             * <li>An instance of a filter class.</li>
             * <li>An object containing two properties: classpath and initArgs.</li>
             * <li>The classpath of a filter class.</li>
             * </ul>
             * @return {Boolean} return true if the filter was found, false if no filter matching the conditions was
             * found.
             */
            isFilterPresent : function (filterDef) {
                var filters = this._filters;
                // stop here if there are no filters
                if (!filters) {
                    return false;
                }
                var isWrongFilter = getFindFilterFunction(filterDef);
                if (isWrongFilter == null) {
                    this.$logError(this.INVALID_PARAMETER_FOR_ISFILTERPRESENT);
                    clean();
                    return false;
                }
                for (var i = 0, l = filters.length; i < l; i++) {
                    if (!isWrongFilter(filters[i])) {
                        clean();
                        return true;
                    }
                }
                clean();
                return false;
            },

            /**
             * Remove a filter added with addFilter, and dispose it.
             * @param {MultiTypes} oldFilter It can be one of the following possibilities:
             * <ul>
             * <li>An instance of a filter class.</li>
             * <li>An object containing two properties: classpath and initArgs.</li>
             * <li>The classpath of a filter class.</li>
             * </ul>
             * @return {Boolean} return true if a filter was removed, false if no filter matching the conditions was
             * found.
             */
            removeFilter : function (oldFilter) {
                var filters = this._filters;
                // stop here if there are no filters
                if (!filters) {
                    return false;
                }
                var selectionCallback = getFindFilterFunction(oldFilter);
                if (selectionCallback == null) {
                    this.$logError(this.INVALID_PARAMETER_FOR_REMOVEFILTER);
                    clean();
                    return false;
                }
                var newFiltersArray = arrayUtils.filter(filters, selectionCallback, this);
                clean();
                var filterToRemove = findFilterRes;
                if (filterToRemove) {
                    if (filterToRemove.obj) {
                        // already loaded, dispose it
                        filterToRemove.obj.$dispose();
                        filterToRemove.obj = null;
                    } else {
                        // not yet loaded, prevent it to be loaded
                        this._filtersToBeLoaded--;
                    }
                    filterToRemove.filterClasspath = null;
                    filterToRemove.initArgs = null;
                    if (newFiltersArray.length === 0) {
                        this._filters = null;
                    } else {
                        this._filters = newFiltersArray;
                    }
                    return true;
                }
                return false;
            },

            /**
             * Call the onRequest method on all the registered filters (and load the ones which are not yet loaded if
             * necessary, and the sender is not the FileLoader).
             * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req request object
             * @param {aria.core.CfgBeans:Callback} cb callback
             */
            callFiltersOnRequest : function (req, cb) {
                this._callFilters(false, req, cb);
            },

            /**
             * Call the onResponse method on all the registered filters (and load the ones which are not yet loaded if
             * necessary, and the sender is not the FileLoader).
             * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req request object
             * @param {aria.core.CfgBeans:Callback} cb callback
             */
            callFiltersOnResponse : function (req, cb) {
                this._callFilters(true, req, cb);
            },

            /**
             * If there are filters to be loaded, load them, then call all the filters.
             * @param {Boolean} isResponse
             * @param {aria.core.CfgBeans:IOAsyncRequestCfg} req request object
             * @param {aria.core.CfgBeans:Callback} cb callback
             * @private
             */
            _callFilters : function (isResponse, request, cb) {
                if (!this._filters) {
                    this.$callback(cb);
                    return;
                }
                var args = {
                    isResponse : isResponse,
                    request : request,
                    cb : cb,
                    filters : this._filters,
                    nbFilters : this._filters.length
                    // store the number of filters so that we do not call filters which were added after the call
                    // to _callFilters
                };
                if (this._filtersToBeLoaded > 0
                        && (request.sender == null || request.sender.classpath != "aria.core.FileLoader")) {
                    this._loadMissingFilters({
                        fn : this._continueCallingFilters,
                        args : args,
                        scope : this
                    });
                } else {
                    this._continueCallingFilters(null, args);
                }
            },

            /**
             * Effectively call filters in the right order.
             * @param {MultiTypes} unused
             * @param {Object} args object containing the following properties: isResponse, request, cb, filters and
             * nbFilters
             * @private
             */
            _continueCallingFilters : function (unused, args) {
                var filters = args.filters;
                var request = args.request;
                var curFilter;
                // initialize the delay
                request.delay = 0;
                if (args.isResponse) {
                    for (var i = args.nbFilters - 1; i >= 0; i--) {
                        curFilter = filters[i].obj;
                        if (curFilter) {
                            curFilter.__onResponse(request);
                        }
                    }
                } else {
                    for (var i = 0, l = args.nbFilters; i < l; i++) {
                        curFilter = filters[i].obj;
                        if (curFilter) {
                            curFilter.__onRequest(request);
                        }
                    }
                }
                if (request.delay > 0) {
                    // wait for the specified delay
                    ariaCoreTimer.addCallback({
                        fn : this._afterDelay,
                        args : args,
                        scope : this,
                        delay : request.delay
                    });
                } else {
                    this._afterDelay(args);
                }
            },

            /**
             * Call the callback after the delay.
             * @param {Object} args object containing the following properties: isResponse, request, cb, filters and
             * nbFilters
             * @private
             */
            _afterDelay : function (args) {
                var request = args.request;
                delete request.delay;
                this.$callback(args.cb);
            },

            /**
             * Load the filters which were added but not yet loaded.
             * @param {aria.core.CfgBeans:Callback} cb callback to be called when the load of filters is finished
             * @private
             */
            _loadMissingFilters : function (cb) {
                var filters = this._filters;
                var curFilter;
                var classpathsToLoad = [];
                for (var i = 0, l = filters.length; i < l; i++) {
                    curFilter = filters[i];
                    if (curFilter.obj == null) {
                        classpathsToLoad.push(curFilter.filterClasspath);
                    }
                }
                Aria.load({
                    classes : classpathsToLoad,
                    oncomplete : {
                        fn : this._continueLoadingMissingFilters,
                        scope : this,
                        args : {
                            cb : cb,
                            filters : filters,
                            nbFilters : filters.length
                        }
                    }
                });
            },

            /**
             * Create instances of each filter once they are loaded.
             * @param {Object} args object containing the following properties: cb, filters, nbFilters
             * @private
             */
            _continueLoadingMissingFilters : function (args) {
                var filters = args.filters;
                for (var i = 0, l = args.nbFilters; i < l; i++) {
                    var curFilter = filters[i];
                    // not that filterClasspath can be null if the filter was removed in the meantime.
                    if (curFilter.filterClasspath != null && curFilter.obj == null) {
                        curFilter.obj = Aria.getClassInstance(curFilter.filterClasspath, curFilter.initArgs);
                        this._filtersToBeLoaded--;
                    }
                }
                this.$callback(args.cb);
            }
        }
    });
})();
