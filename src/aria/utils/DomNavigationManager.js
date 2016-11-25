/*
 * Copyright 2016 Amadeus s.a.s.
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



////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////

var Aria = require('../Aria');

var ariaCoreJsObject = require('../core/JsObject');

var ariaUtilsType = require('./Type');
var ariaUtilsArray = require('./Array');
var ariaUtilsObject = require('./Object');
var ariaUtilsFunction = require('./Function');

var ariaUtilsEvent = require('./Event');
var ariaUtilsDom = require('./Dom');

var ariaTemplatesNavigationManager = require('../templates/NavigationManager');

var document = Aria.$window.document;

var DOM_NAVIGATION_MANAGER_CLASSPATH = 'aria.utils.DomNavigationManager';



////////////////////////////////////////////////////////////////////////////////
// Library: API
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a flexible constructor, which can interchangeably be called with or without the "new" operator.
 *
 * @param {Function} init The actual initialization function, as you would have inside a standard constructor
 *
 * @return {Function} The enhanced constructor
 */
function createConstructor(init) {
    // -------------------------------------------------------------- processing

    function publicConstructor() {
        var self = this instanceof privateConstructor ? this : new privateConstructor();
        init.apply(self, arguments);
        return self;
    }

    function privateConstructor() {}
    privateConstructor.prototype = publicConstructor.prototype;

    // ------------------------------------------------------------------ return

    return publicConstructor;
}
exports.createConstructor = createConstructor;

/**
 * Turns all or part of the "arguments" of a function into an array. An optional start index can be specified, for the common use case of "splat args".
 *
 * @param {Arguments} args The arguments of a function
 * @param {Number} startIndex An optional index at which to start the copy of the arguments; defaults to 0
 *
 * @return {Array} The copy of the arguments
 */
function sliceArguments(args, startIndex) {
    if (startIndex == null) {
        startIndex = 0;
    }

    return Array.prototype.slice.call(args, startIndex);
}
exports.sliceArguments = sliceArguments;



////////////////////////////////////////////////////////////////////////////////
// Library: Collections
////////////////////////////////////////////////////////////////////////////////

/**
 * Collects items from an iterator into an array.
 *
 * <p>
 * The iterator follows a subset of the ES6 specifications: an object with the property "next" which is a function returning the next item specification. An item specification consists in two properties: "done" to indicate whether there are no more elements (when it's true) or not, and "value" which corresponds to the value of the item.
 * </p>
 *
 * @param {Object} iterator The iterator used to get items, see description for more details about its interface
 *
 * @return {Array} The collected items as an array
 */
function collect(iterator) {
    var result = [];

    for (;;) {
        var item = iterator.next();
        if (item.done) {
            break;
        }
        result.push(item.value);
    }

    return result;
}
exports.collect = collect;

/**
 * Collects items from a given callback until one of them is void (null or undefined).
 *
 * @param {Function} callback Function returning the next item
 *
 * @return {Array} The collected items as an array
 */
function collectUntilVoid(callback) {
    return collect({
        next: function() {
            var value = callback.apply(this, arguments);
            return value == null ? {done: true} : {done: false, value: value};
        }
    });
}
exports.collectUntilVoid = collectUntilVoid;



////////////////////////////////////////////////////////////////////////////////
// Library: DOM
////////////////////////////////////////////////////////////////////////////////

/**
 * Get all siblings of the given element, with various views on it (see description).
 *
 * <p>
 * There are two kinds of siblings: the previous ones and the next ones. There can be many use cases involving the traversal of siblings. Most common use cases are:
 * <ul>
 * <li>traversing next siblings</li>
 * <li>traversing previous siblings from the element to the limit</li>
 * <li>traversing all siblings in natural order (from the first to the last), thus traversing all children of the parents, skipping the current element</li>
 * </ul>
 * To match these various use cases, the following collections are returned:
 * <ul>
 * <li>"siblings": all siblings in natural order</li>
 * <li>"previous": previous siblings in natural order</li>
 * <li>"next": next siblings in natural order</li>
 * <li>"previousOriginalOrder": previous siblings from given element to the first child of the parent (the limit)</li>
 * </ul>
 * </p>
 *
 * @param {HTMLElement} element The DOM element to get the siblings from
 *
 * @return {Object} The different views of the siblings ("siblings" for all of them in natural order) — see description for more information
 */
function getSiblings(element) {
    // -------------------------------------------------------------- processing

    // previous ------------------------------------------------------------------

    var currentElement = element;
    var previous = collectUntilVoid(function() {
        currentElement = ariaUtilsDom.getPreviousSiblingElement(currentElement);
        return currentElement;
    });
    var previousOriginalOrder = ariaUtilsArray.clone(previous);
    previous.reverse();

    // after -------------------------------------------------------------------

    var currentElement = element;
    var next = collectUntilVoid(function() {
        currentElement = ariaUtilsDom.getNextSiblingElement(currentElement);
        return currentElement;
    });

    // all ---------------------------------------------------------------------

    var siblings = [].concat(previous, next);

    // ------------------------------------------------------------------ return

    return {
        siblings: siblings,
        previous: previous,
        previousOriginalOrder: previousOriginalOrder,
        next: next
    };
}
exports.getSiblings = getSiblings;

/**
 * Traverses siblings of the given element, and then does the same for its parent, until the limit (root) is reached. The limit is either the document's body or a custom one according to a given predicate.
 *
 * <p>
 * The callback receives the following parameters:
 * <ul>
 * <li>sibling: the currently traversed element</li>
 * <li>current element: the current reference for the siblings (kind of represents the current depth in the tree)</li>
 * <li>element: the given starting point element</li>
 * </ul>
 * </p>
 *
 * @param {HTMLElement} element The starting point element
 * @param {Function} callback Description the function to be called for each traversed element
 * @param {Function} predicate Optional function that tells whether the current element is not yet the limit (root); defaults to a function checking that the element exists and is not the document's body element
 *
 * @return {Array} The collection of results for the traversal at each depth
 */
function traverseSiblingsUntilRootOfBranch(element, callback, predicate) {
    // ---------------------------------------------- input arguments processing

    if (predicate == null) {
        predicate = function(element) {
            return element != null && element != document.body;
        };
    }

    // -------------------------------------------------------------- processing

    var currentElement = element;
    var results = [];

    /* eslint-disable no-loop-func */
    while (predicate(currentElement)) {
        var siblings = getSiblings(currentElement).siblings;
        results.push(ariaUtilsArray.map(siblings, function(sibling) {
            return callback(sibling, currentElement, element);
        }));

        currentElement = currentElement.parentElement;
    }
    /* eslint-enable no-loop-func */

    // ------------------------------------------------------------------ return

    return results;
}
exports.traverseSiblingsUntilRootOfBranch = traverseSiblingsUntilRootOfBranch;

/**
 * Creates a DOM element that is not visible.
 *
 * <p>
 *   It uses a technique that doesn't prevent the element from being focused.
 * </p>
 * <p>
 *   It also respects accessibility by setting aria-hidden to true.
 * </p>
 *
 * @return {HTMLElement} The created element.
 */
function createHiddenElement() {
    // -------------------------------------------------------------- properties

    var element = document.createElement('div');

    var style = element.style;
    style.width = 0;
    style.height = 0;

    element.setAttribute('aria-hidden', 'true');

    // ------------------------------------------------------------------ return

    return element;
}
exports.createHiddenElement = createHiddenElement;

/**
 * Inserts a DOM element before another one: the reference.
 *
 * <p>
 *   This requires the reference element to have a parent node.
 * </p>
 *
 * @param {HTMLElement} element The element to insert
 * @param {HTMLElement} reference The reference element
 *
 * @return {HTMLElement} the given element
 */
function insertBefore(element, reference) {
    ariaUtilsDom.insertAdjacentElement(reference, 'beforeBegin', element);
}
exports.insertBefore = insertBefore;

/**
 * Inserts a DOM element after another one: the reference.
 *
 * <p>
 *   This requires the reference element to have a parent node.
 * </p>
 *
 * @param {HTMLElement} element The element to insert
 * @param {HTMLElement} reference The reference element
 *
 * @return {HTMLElement} the given element
 */
function insertAfter(element, reference) {
    ariaUtilsDom.insertAdjacentElement(reference, 'afterEnd', element);
}
exports.insertAfter = insertAfter;

/**
 * Inserts a DOM element as the first child of the given parent.
 *
 * @param {HTMLElement} element The element to insert
 * @param {HTMLElement} parent The parent element
 *
 * @return {HTMLElement} the given element
 */
function insertFirst(element, parent) {
    ariaUtilsDom.insertAdjacentElement(parent, 'afterBegin', element);
}
exports.insertFirst = insertFirst;

/**
 * Inserts a DOM element as the last child of the given parent.
 *
 * @param {HTMLElement} element The element to insert
 * @param {HTMLElement} parent The parent element
 *
 * @return {HTMLElement} the given element
 */
function insertLast(element, parent) {
    ariaUtilsDom.insertAdjacentElement(parent, 'beforeEnd', element);
}
exports.insertLast = insertLast;



////////////////////////////////////////////////////////////////////////////////
// Local library
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a hidden DOM element that can be focused through tab navigation.
 *
 * <p>
 *   The goal of this element, when inserted at a proper place, is to intercept the navigation, in order to infer various information: direction, origin, etc. One important thing is that it won't alter the position of the scroll when being focused.
 * </p>
 *
 * @return {HTMLElement} The created element.
 */
function createInterceptorElement() {
    // -------------------------------------------------------------- processing

    var element = createHiddenElement();

    element.style.position = 'fixed';

    element.tabIndex = 0;

    // ------------------------------------------------------------------ return

    return element;
}
exports.createInterceptorElement = createInterceptorElement;



////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

/**
 * A navigation interception manager.
 *
 * <p>
 *   This manages a set of elements to be inserted relatively to a reference element. It can ensure those elements are created and properly inserted, and when so, it can check if an element corresponds to one of its focus traps. The manager has an origin, and the direction is inferred from the interceptor.
 * </p>
 *
 * <p>
 *   Focus traps are defined with these properties:
 *   <ul>
 *     <li>direction: the name of the direction of the tab navigation when intercepted by this manager. Usually "backward" or "forward", but you can choose any convention.</li>
 *     <li>insert: a callback to insert the element. It will be passed the following arguments: the element to insert, the reference element.</li>
 *   </ul>
 *   During execution, this object will have a new property when elements are actually created: element. This holds the created HTMLElement.
 * </p>
 *
 * @param {Object} spec An object:
 * <ul>
 *   <li>origin: the name of the origin of the tab navigation when intercepted by this manager (can be the reference element, but any other depending on the use cases)</li>
 *   <li>getReferenceElement: a callback to get the reference element</li>
 *   <li>focusTraps: a list of focus traps (see detailed description)</li>
 *   <li>onfocus: callback called when focusing focus traps</li>
 *   <li>oncatch: callback called when a focus trap's element has been focused and navigation information retrieved</li>
 * </ul>
 */
var NavigationInterceptor = createConstructor(function(spec) {
    // -------------------------------------------------------------- properties

    this.origin = spec.origin;
    this.getReferenceElement = spec.getReferenceElement;

    this.focusTraps = spec.focusTraps;
    /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1735) */
    var focusTraps = spec.focusTraps;
    if (focusTraps == null) {
        focusTraps = spec.interceptors;
    }
    this.focusTraps = focusTraps;
    this.interceptors = focusTraps;
    /* BACKWARD-COMPATIBILITY-END (GitHub #1735) */

    this.onfocus = spec.onfocus;
    this.oncatch = spec.oncatch;

    // ----------------------------------------------------- internal attributes

    this._oncatch = null;
});
exports.NavigationInterceptor = NavigationInterceptor;
var prototype = NavigationInterceptor.prototype;

prototype.$callback = ariaCoreJsObject.prototype.$callback;
prototype.$logError = ariaCoreJsObject.prototype.$logError;
prototype.CALLBACK_ERROR = ariaCoreJsObject.prototype.CALLBACK_ERROR;
prototype.$classpath = DOM_NAVIGATION_MANAGER_CLASSPATH;

prototype._getOnCatch = function() {
    if (this._oncatch == null && this.oncatch != null) {
        this._oncatch = {
            scope: this,
            fn: function (event) {
                var target = event.target;
                if (target == null) {
                    target = event.srcElement;
                }

                var navigationInformation = this.getNavigationInformation(target);
                if (navigationInformation != null) {
                    this.$callback(this.oncatch, {
                        navigationInformation: navigationInformation,
                        interceptor: this,
                        target: target,
                        event: event
                    });
                }
            }
        };
    }

    return this._oncatch;
};

/**
 * Ensures focus traps' elements are actually created, and inserted at the right position in the rendered DOM.
 *
 * <p>
 *   Created elements are put under property "element" inside the focus trap's spec object. This is how their existence is checked.
 * </p>
 */
prototype.ensureElements = function () {
    // ----------------------------------------------------------- destructuring

    var getReferenceElement = this.getReferenceElement;
    var focusTraps = this.focusTraps;
    var onfocus = this.onfocus;
    var oncatch = this._getOnCatch();

    // -------------------------------------------------------------- processing

    var referenceElement = getReferenceElement();

    ariaUtilsArray.forEach(focusTraps, function (focusTrap) {
        var insert = focusTrap.insert;
        var element = focusTrap.element;

        if (element == null) {
            element = createInterceptorElement();
            focusTrap.element = element;

            if (onfocus != null) {
                ariaUtilsEvent.addListener(element, 'focus', onfocus);
            }

            if (oncatch != null) {
                ariaUtilsEvent.addListener(element, 'focus', oncatch);
            }
        }

        insert(element, referenceElement);
    }, this);
};

/**
 * Removes and forgets about the focus traps' elements, if ever they had been created.
 *
 * <p>
 *   This sets to "null" the "element" property inside the focus trap's spec object.
 * </p>
 */
prototype.destroyElements = function () {
    // ----------------------------------------------------------- destructuring

    var onfocus = this.onfocus;
    var oncatch = this._getOnCatch();

    // -------------------------------------------------------------- processing

    ariaUtilsArray.forEach(this.focusTraps, function (focusTrap) {
        var element = focusTrap.element;

        if (element != null) {
            if (onfocus != null) {
                ariaUtilsEvent.removeListener(element, 'focus', onfocus);
            }
            if (oncatch != null) {
                ariaUtilsEvent.removeListener(element, 'focus', oncatch);
            }
            ariaUtilsDom.removeElement(element);
            focusTrap.element = null;
        }
    }, this);
};

/**
 * Returns information about the navigation that can be inferred from the knowledge of the focused element.
 *
 * <p>
 *   It will compare the given element with the focus traps' elements to infer a "direction" of navigation (the one specified in the focus trap's spec).
 * </p>
 * <p>
 *   It will add the "origin" piece of information, as specified when instantiating the class.
 * </p>
 * <p>
 *   If the element doesn't match any focus trap, no information will be returned.
 * </p>
 *
 * @param {HTMLElement} focusedElement The element that has focus (or any other if you want), with which focus traps will be compared
 *
 * @return {Object} Information navigation in the form of {origin, direction} or "null".
 */
prototype.getNavigationInformation = function(focusedElement) {
    // ----------------------------------------------------------- destructuring

    var focusTraps = this.focusTraps;
    var origin = this.origin;

    // -------------------------------------------------------------- processing

    // direction ---------------------------------------------------------------

    var direction = null;

    for (var index = 0, length = focusTraps.length; index < length; index++) {
        var focusTrap = focusTraps[index];

        if (focusedElement === focusTrap.element) {
            direction = focusTrap.direction;
            break;
        }
    }

    // result ------------------------------------------------------------------

    var result;

    if (direction == null) {
        result = null;
    } else {
        result = {
            direction: direction,
            origin: origin
        };
    }

    // ------------------------------------------------------------------ return

    return result;
};



/**
 * A composite interceptor, implementing the NavigationInterceptor interface and delegating to multiple interceptors underneath.
 *
 * <p><em>commonSpec</em> is an object which accepts the following properties: </p>
 * </ul>
 *   <li><em>onfocus</em>: when the value is not void, will set <em>onfocus</em> on each interceptor with the given value</li>
 * </ul>
 *
 * @param {Array} interceptors The collection of actual navigation interceptor instances
 * @param {Object} commonSpec Optional object with properties that can be applied to each given interceptor. See description for more information.
 */
var CompositeInterceptor = createConstructor(function(interceptors, commonSpec) {
    // -------------------------------------------------------------- properties

    this.interceptors = interceptors;

    // -------------------------------------------------------------- processing

    if (commonSpec == null) {
        commonSpec = {};
    }

    ariaUtilsArray.forEach([
        'onfocus',
        'oncatch'
    ], function (property) {
        var value = commonSpec[property];
        if (value != null) {
            ariaUtilsArray.forEach(interceptors, function(interceptor) {
                interceptor[property] = value;
            });
        }
    });
});
var prototype = CompositeInterceptor.prototype;

/**
 * Gets the navigation information for the currently focused element, returning the first information given (first interceptor that gives a result).
 *
 * @param {HTMLElement} focusedElement The reference element to take into consideration for the query (usually the currently focused element)
 *
 * @return {Object} See NavigationInterceptor.getNavigationInformation
 */
prototype.getNavigationInformation = function(focusedElement) {
    var interceptors = this.interceptors;

    var result = null;
    for (var index = 0, length = interceptors.length; index < length; index++) {
        var interceptor = interceptors[index];

        result = interceptor.getNavigationInformation.apply(interceptor, arguments);
        if (result != null) {
            break;
        }
    }

    return result;
};

/**
 * Pure composite method: calls "destroyElements" for each underneath interceptor
 */
prototype.destroyElements = function () {
    var args = arguments;
    ariaUtilsArray.forEach(this.interceptors, function(interceptor) {
        interceptor.destroyElements.apply(interceptor, args);
    });
};

/**
 * Pure composite method: calls "ensureElements" for each underneath interceptor
 */
prototype.ensureElements = function () {
    var args = arguments;
    ariaUtilsArray.forEach(this.interceptors, function(interceptor) {
        interceptor.ensureElements.apply(interceptor, args);
    });
};



////////////////////////////////////////////////////////////////////////////////
// Specific navigation interceptors
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a NavigationInterceptor for a Popup.
 *
 * <p>
 *   Focus traps' elements will be inserted right before and right after the Popup element, corresponding respectively to a navigation direction "backward" or "forward".
 * </p>
 *
 * @param {Object|Function} spec Part of the input spec for NavigationInterceptor, excluding "origin" and "focusTraps" which are set specifically by this current constructor. If no object is passed, the function "getReferenceElement" can be passed directly.
 *
 * @return {NavigationInterceptor} an instance of NavigationInterceptor
 */
function ModalNavigationInterceptor(spec) {
    // ---------------------------------------------- input arguments processing

    if (!ariaUtilsType.isObject(spec)) {
        spec = {getReferenceElement: spec};
    }

    // -------------------------------------------------------------- processing

    var finalSpec = ariaUtilsObject.assign({}, spec, {
        origin: 'popup',

        focusTraps: [
            // before
            {
                direction: 'backward',
                insert: insertBefore
            },
            // after
            {
                direction: 'forward',
                insert: insertAfter
            }
        ]
    });

    // ------------------------------------------------------------------ return

    return NavigationInterceptor(finalSpec);
}
exports.ModalNavigationInterceptor = ModalNavigationInterceptor;
/* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1735) */
exports.DialogNavigationInterceptor = ModalNavigationInterceptor;
/* BACKWARD-COMPATIBILITY-END (GitHub #1735) */

/**
 * Creates a NavigationInterceptor for an element to be skipped.
 *
 * <p>
 *   Focus traps' elements will be inserted right before and right after the element, corresponding respectively to a navigation direction "forward" or "backward".
 * </p>
 *
 * @param {Object|Function} spec Part of the input spec for NavigationInterceptor, excluding "origin" and "focusTraps" which are set specifically by this current constructor. If no object is passed, the function "getReferenceElement" can be passed directly.
 *
 * @return {NavigationInterceptor} an instance of NavigationInterceptor
 */
function SkippedElementNavigationInterceptor(spec) {
    // ---------------------------------------------- input arguments processing

    if (!ariaUtilsType.isObject(spec)) {
        spec = {getReferenceElement: spec};
    }

    // -------------------------------------------------------------- processing

    var finalSpec = ariaUtilsObject.assign({}, spec, {
        origin: 'outside',

        focusTraps: [
            // before
            {
                direction: 'forward',
                insert: insertBefore
            },
            // after
            {
                direction: 'backward',
                insert: insertAfter
            }
        ]
    });

    // ------------------------------------------------------------------ return

    return NavigationInterceptor(finalSpec);
}
exports.SkippedElementNavigationInterceptor = SkippedElementNavigationInterceptor;

/**
 * Creates a NavigationInterceptor for the browser/viewport.
 *
 * <p>
 *   Focus traps' elements will be inserted at the very beginning and at the very end of the viewport ("document.body"), corresponding respectively to a navigation direction "forward" or "backward".
 * </p>
 *
 * @param {Object} spec Part of the input spec for NavigationInterceptor, excluding "origin", "focusTraps" and "getReferenceElement".
 *
 * @return {NavigationInterceptor} an instance of NavigationInterceptor
 */
function ViewportNavigationInterceptor(spec) {
    // ---------------------------------------------- input arguments processing

    if (spec == null) {
        spec = {};
    }

    // -------------------------------------------------------------- processing

    var finalSpec = ariaUtilsObject.assign({}, spec, {
        origin: 'browser',

        getReferenceElement: function () {
            return document.body;
        },

        focusTraps: [
            // first
            {
                direction: 'forward',
                insert: insertFirst
            },
            // last
            {
                direction: 'backward',
                insert: insertLast
            }
        ]
    });

    // ------------------------------------------------------------------ return

    return NavigationInterceptor(finalSpec);
}
exports.ViewportNavigationInterceptor = ViewportNavigationInterceptor;



////////////////////////////////////////////////////////////////////////////////
// Navigation handlers
////////////////////////////////////////////////////////////////////////////////

/**
 * Handles navigation for a modal element.
 *
 * <p>
 *   Behavior is to fully contain the navigation inside the modal element, both:
 * </p>
 * <ul>
 *   <li>preventing from going out of the page</li>
 *   <li>going directly into the modal element when coming from outside of the page</li>
 * </ul>
 *
 * @param {HtmlElement} element The reference DOM element
 * @param {Boolean} loop When true, it will make the focus cycle inside the given element. Otherwise, it will block at the edges. Defaults to false.
 *
 * @return {NavigationInterceptor} an instance of NavigationInterceptor
 */
function ModalNavigationHandler(element, loop) {
    // ---------------------------------------------- input arguments processing

    if (loop == null) {
        loop = false;
    }
    loop = !!loop;

    // -------------------------------------------------------------- processing

    // -------------------------------------------------------------------------

    var oncatch = function(arg) {
        var navigationInformation = arg.navigationInformation;
        var direction = navigationInformation.direction;
        var origin = navigationInformation.origin;

        var reverse = (direction === 'forward' && origin === 'popup') || (direction === 'backward' && origin === 'browser');
        if (loop) {
            reverse = !reverse;
        }
        ariaTemplatesNavigationManager.focusFirst(element, reverse);
    };

    // -------------------------------------------------------------------------

    var elementInterceptor = ModalNavigationInterceptor({
        getReferenceElement: function() {return element;}
    });

    var viewportInterceptor = ViewportNavigationInterceptor();

    // ------------------------------------------------------------------ return

    return CompositeInterceptor([
        elementInterceptor,
        viewportInterceptor
    ], {
        oncatch: oncatch
    });
}
exports.ModalNavigationHandler = ModalNavigationHandler;
/* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1735) */
exports.ElementNavigationInterceptor = ModalNavigationHandler;
/* BACKWARD-COMPATIBILITY-END (GitHub #1735) */

/**
 * Handles navigation for a skipped element.
 *
 * <p>
 *   Behavior is to skip navigation through the element.
 * </p>
 *
 * @param {HtmlElement} element The reference DOM element
 *
 * @return {NavigationInterceptor} an instance of NavigationInterceptor
 */
function SkippedElementNavigationHandler(element) {
    return SkippedElementNavigationInterceptor({
        getReferenceElement: function() {return element;},
        oncatch: function (arg) {
            var interceptor = arg.interceptor;
            var navigationInformation = arg.navigationInformation;
            var direction = navigationInformation.direction;

            var reverse = direction === 'backward';
            var element = interceptor.focusTraps[reverse ? 0 : 1].element;

            ariaTemplatesNavigationManager.focusNext(element, reverse);
        }
    });
}
exports.SkippedElementNavigationHandler = SkippedElementNavigationHandler;



////////////////////////////////////////////////////////////////////////////////
// Hiding manager
////////////////////////////////////////////////////////////////////////////////

/**
 * Manages the hiding/showing of elements through the WAI-ARIA attribute "aria-hidden".
 *
 * <p>
 * It manages hidden elements by tracking the number of request made to hide them or show them back. An element will be hidden the first time one asks, and will be showed back only when no one wants it hidden anymore.
 * </p>
 */
var HidingManager = createConstructor(function() {
    this.attributeName = 'data-hide-requests-count';
});
exports.HidingManager = HidingManager;
var prototype = HidingManager.prototype;

/**
 * Hides all elements around the given element, by hiding the nodes as close as possible to the root, avoiding any ancestor of the current node.
 *
 * @param {HTMLElement} element The element to keep visible
 * @param {Function} predicate Same as for traverseSiblingsUntilRootOfBranch: tells if should continue to the next parent node
 *
 * @return {Function} A function that can revert the operation done by this method.
 */
prototype.hideOthers = function(element, predicate) {
    // -------------------------------------------------------------- processing

    var self = this;
    var reverters = traverseSiblingsUntilRootOfBranch(element, function(element) {
        return self.hide(element);
    }, predicate);

    reverters = ariaUtilsArray.flatten(reverters);
    var reverter = ariaUtilsFunction.bind(
        ariaUtilsArray.forEach,
        ariaUtilsArray,
        reverters,
        ariaUtilsFunction.call
    );

    // ------------------------------------------------------------------ return

    return reverter;
};

/**
 * Registers the request of hiding the given element, and actually hides it if this is the first one.
 *
 * <p>
 * The current implementation uses an attribute "data-hide-requests-count" to store the number of requests.
 * </p>
 * <p>
 * If the element has already a "aria-hidden" attribute but no request registered, it is left as is, unmanaged. Thus the revert function won't do anything either.
 * </p>
 *
 * @param {HTMLElement} element The element to hide
 *
 * @return {Function} A function that can revert the operation done by this method.
 */
prototype.hide = function(element) {
    // ----------------------------------------------------------- destructuring

    var attributeName = this.attributeName;

    // -------------------------------------------------------------- processing

    var revert;

    // -------------------------------------------------------------------------

    var hideRequestsCount = element.getAttribute(attributeName);

    if (hideRequestsCount == null) {
        if (element.getAttribute('aria-hidden') != null) {
            revert = function () {};
        } else {
            element.setAttribute('aria-hidden', 'true');
            hideRequestsCount = 0;
        }
    }

    if (hideRequestsCount != null) {
        hideRequestsCount++;
        element.setAttribute(attributeName, hideRequestsCount);

        revert = function () {
            // ----------------------------------------------- early termination

            if (element == null) {
                return;
            }

            // ------------------------------------------------------ processing

            var hideRequestsCount = element.getAttribute(attributeName);

            if (hideRequestsCount != null) {
                hideRequestsCount--;

                if (hideRequestsCount !== 0) {
                    element.setAttribute(attributeName, hideRequestsCount);
                } else {
                    element.removeAttribute('aria-hidden', 'true');
                    element.removeAttribute(attributeName);
                }
            }

            // ----------------------------------------------------- termination

            element = null;
        };
    }

    // ------------------------------------------------------------------ return

    return revert;
};

/**
 * Singleton of HidingManager.
 */
var hidingManager = new HidingManager();
exports.hidingManager = hidingManager;
