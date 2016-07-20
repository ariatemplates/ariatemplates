// -----------------------------------------------------------------------------

var Aria = require("../Aria");
var ariaUtilsArray = require("../utils/Array");
var ariaTemplatesNavigationManager = require("../templates/NavigationManager");
var ariaUtilsEvent = require("../utils/Event");

var document = Aria.$window.document;



////////////////////////////////////////////////////////////////////////////////
// Library
////////////////////////////////////////////////////////////////////////////////

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
    reference.parentNode.insertBefore(element, reference);
    return element;
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
    reference.parentNode.insertBefore(element, reference.nextSibling);
    return element;
}
exports.insertAfter = insertAfter;

/**
 * Inserts a DOM element from the rendered DOM.
 *
 * <p>
 *   This requires the element to have a parent node.
 * </p>
 *
 * @param {HTMLElement} element The element to remove
 *
 * @return {HTMLElement} the given element
 */
function removeElement(element) {
    element.parentNode.removeChild(element);
    return element;
}
exports.removeElement = removeElement;

/**
 * Inserts a DOM element as the first child of the given parent.
 *
 * @param {HTMLElement} element The element to insert
 * @param {HTMLElement} parent The parent element
 *
 * @return {HTMLElement} the given element
 */
function insertFirst(element, parent) {
    insertBefore(element, parent.childNodes[0]);
    return element;
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
    parent.appendChild(element);
    return element;
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
 *   This manages a set of elements to be inserted relatively to a reference element. It can ensure those elements are created and properly inserted, and when so, it can check if an element corresponds to one of its interceptors. The manager has an origin, and the direction is inferred from the interceptor.
 * </p>
 *
 * <p>
 *   Interceptors are defined with these properties:
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
 *   <li>interceptors: a list of interceptors (see detailed description)</li>
 *   <li>onfocus: callback called when focusing interceptors</li>
 * </ul>
 */
function NavigationInterceptorClass(spec) {
    this.origin = spec.origin;
    this.getReferenceElement = spec.getReferenceElement;
    this.interceptors = spec.interceptors;
    this.onfocus = spec.onfocus;
}
exports.NavigationInterceptorClass = NavigationInterceptorClass;

/**
 * A factory to instantiate the class NavigationInterceptorClass. All parameters are forwarded.
 *
 * @return {NavigationInterceptorClass} an instance of NavigationInterceptorClass.
 */
function NavigationInterceptor(spec) {
    return new NavigationInterceptorClass(spec);
}
exports.NavigationInterceptor = NavigationInterceptor;

var prototype = NavigationInterceptorClass.prototype;

/**
 * Ensures interceptor element are actually created, and inserted at the right position in the rendered DOM.
 *
 * <p>
 *   Created elements are put under property "element" inside the interceptor spec object. This is how their existence is checked.
 * </p>
 */
prototype.ensureElements = function () {
    // ----------------------------------------------------------- destructuring

    var getReferenceElement = this.getReferenceElement;

    // -------------------------------------------------------------- processing

    var referenceElement = getReferenceElement();
    var onfocus = this.onfocus;

    ariaUtilsArray.forEach(this.interceptors, function (interceptor) {
        var insert = interceptor.insert;
        var element = interceptor.element;

        if (element == null) {
            element = createInterceptorElement();
            interceptor.element = element;
            if (onfocus) {
                ariaUtilsEvent.addListener(element, "focus", onfocus);
            }
        }

        insert(element, referenceElement);
    }, this);
};

/**
 * Removes and forgets about the interceptor elements, if ever they had been created.
 *
 * <p>
 *   This sets to "null" the "element" property inside the interceptor spec object.
 * </p>
 */
prototype.destroyElements = function () {
    var onfocus = this.onfocus;
    ariaUtilsArray.forEach(this.interceptors, function (interceptor) {
        var element = interceptor.element;

        if (element != null) {
            if (onfocus) {
                ariaUtilsEvent.removeListener(element, "focus", onfocus);
            }
            removeElement(element);
            interceptor.element = null;
        }
    }, this);
};

/**
 * Returns information about the navigation that can be inferred from the knowledge of the focused element.
 *
 * <p>
 *   It will compare the given element with the interceptor objects to infer a "direction" of navigation (the one specified in the interceptor spec).
 * </p>
 * <p>
 *   It will add the "origin" piece of information, as specified when instantiating the class.
 * </p>
 * <p>
 *   If the element doesn't match any interceptor, no information will be returned.
 * </p>
 *
 * @param {HTMLElement} focusedElement The element that has focus (or any other if you want), with which interceptors will be compared
 *
 * @return {Object} Information navigation in the form of {origin, direction} or "null".
 */
prototype.getNavigationInformation = function(focusedElement) {
    // ----------------------------------------------------------- destructuring

    var interceptors = this.interceptors;
    var origin = this.origin;

    // -------------------------------------------------------------- processing

    // direction ---------------------------------------------------------------

    var direction = null;

    for (var index = 0, length = interceptors.length; index < length; index++) {
        var interceptor = interceptors[index];

        if (focusedElement === interceptor.element) {
            direction = interceptor.direction;
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



////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a NavigationInterceptor for a Popup.
 *
 * <p>
 *   Interceptor elements will be inserted right before and right after the Popup element, corresponding respectively to a navigation direction "backward" or "forward".
 * </p>
 *
 * @param {Function} getReferenceElement A callback to get the Popup element
 *
 * @return {NavigationInterceptorClass} an instance of NavigationInterceptorClass
 */
function DialogNavigationInterceptor(getReferenceElement) {
    return NavigationInterceptor({
        origin: 'popup',

        getReferenceElement: getReferenceElement,

        interceptors: [
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
}
exports.DialogNavigationInterceptor = DialogNavigationInterceptor;

/**
 * Creates a NavigationInterceptor for a Popup.
 *
 * <p>
 *   Interceptor elements will be inserted right before and right after the Popup element, corresponding respectively to a navigation direction "backward" or "forward".
 * </p>
 *
 * @param {HtmlElement} element The reference html element
 * @param {Boolean} loop true if the tab key must loop through the list, false if the navigation must stop at the edges.
 *
 * @return {NavigationInterceptorClass} an instance of NavigationInterceptorClass
 */
function ElementNavigationInterceptor(element, loop) {
    var navigationInterceptor = NavigationInterceptor({
        origin: 'popup',

        getReferenceElement: function() {return element;},

        interceptors: [
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
        ],
        onfocus : {fn:
            function(e) {
                var target = e.target;

                var navigationInformation = navigationInterceptor.getNavigationInformation(target);
                if (navigationInformation) {
                    var direction = navigationInformation.direction;
                    var reverse = direction == 'forward';
                    if (loop) {
                        reverse = !reverse;
                    }
                    ariaTemplatesNavigationManager.focusFirst(element, reverse);
                }
            }
        }
    });
    return navigationInterceptor;
}
exports.ElementNavigationInterceptor = ElementNavigationInterceptor;

/**
 * Creates a NavigationInterceptor for the browser/viewport.
 *
 * <p>
 *   Interceptor elements will be inserted at the very beginning and at the very end of the viewport ("document.body"), corresponding respectively to a navigation direction "forward" or "backward".
 * </p>
 *
 * @return {NavigationInterceptorClass} an instance of NavigationInterceptorClass
 */
function ViewportNavigationInterceptor() {
    return NavigationInterceptor({
        origin: 'browser',

        getReferenceElement: function () {
            return document.body;
        },

        interceptors: [
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
}
exports.ViewportNavigationInterceptor = ViewportNavigationInterceptor;
