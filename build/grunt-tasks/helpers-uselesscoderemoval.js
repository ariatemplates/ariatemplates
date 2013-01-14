/**
 * Helpers for useless code removal, to be used in min task (operating on JavaScript AST). The code that undergoes this
 * operation is basically some description nodes in bean definitions, which can be useful at development time, but can
 * be removed for production builds.
 */
module.exports = function (grunt) {

    /**
     * Helper to be used by the 'min' task to perform useless code removal on the AST obtained from UglifyJS.
     */
    grunt.registerHelper('removeUnnecessaryCode', function (ast) {
        var savedBytes = replaceInPlaceRecursive(getAllReplacementVisitors(), ast, null);
        if (savedBytes) {
            grunt.helper('uselessCodeSavedBytes', savedBytes);
            grunt.verbose.writeln("[min] Useless code removal: saved " + savedBytes + " bytes.");
            grunt.verbose.writeln();
        }
        return ast;
    });

    /**
     * Save in a global config the fact that we saved 'savedBytes' bytes (to be later read and displayed at the end of
     * the build).
     */
    grunt.registerHelper('uselessCodeSavedBytes', function (savedBytes) {
        var current = grunt.config.get('stats.uselessCodeSavedBytes') || 0;
        grunt.config.set('stats.uselessCodeSavedBytes', current + savedBytes);
    });

    /**
     * @param {Array<Function>} visitors list of functions to be executed on each array element of AST. Each of them is
     * a <code>function (input, parents) : returns Number</code>.
     * @param {Array|String} input element of the AST to be analyzed.
     * @param {Array} parents parent arrays of the 'input' - used to backtrack in order to analyze the context (e.g.
     * only to reset 'description' node if it is a child of '$events' in the JSON structure).
     * @param {Number} depth used mainly for debugging
     * @return {Number} number of bytes of code saved due to the operation
     */
    function replaceInPlaceRecursive (visitors, input, parents/*, depth*/) {
        var savedBytes = 0;
        // depth = depth || 0;
        parents = parents || [];
        var isArray = Array.isArray(input);
        if (isArray) {
            // console.log(depth + "/" + parents.length); // depth just for controlling
            visitors.forEach(function (v) {
                savedBytes += v(input, parents);
            });

            // create a new parents array by appending 'input' as the first element
            var newParents = parents.slice(0); // copy
            newParents.unshift(input); // unshift changes in-place (returns length, not the array -- can't chain!)

            input.forEach(function (elem) {
                savedBytes += replaceInPlaceRecursive(visitors, elem, newParents/*, depth+1*/);
            });
        }
        return savedBytes;
    };

    // ============================== CONCRETE VISITORS ==========================
    /**
     * This replacer can be used to clear (set to an empty string) a string property of an object, given certain
     * replacement condition. (if we have a string property in JSON, then input[1][0]=="string", input[1][1] == contents
     * of the string, and input[0] == name of the JSON property in which that string is stored).
     * @param {Function} fReplacementCondition function(input, parents): returns Boolean (true to perform the
     * replacement)
     * @param {String} comment comment to log if a replacement takes place.
     * @param {Array} input a fragment of UglifyJS AST (current node)
     * @param {Array<Array>} parents an array of fragments of UgliftJS AST's (parents of the current node).
     * @return {Number} number of bytes saved due to string removal
     */
    var simpleStringCleaner = function (fReplacementCondition, comment, input, parents) {
        var savedBytes = 0;
        if (fReplacementCondition(input, parents) && input[1] && input[1][0] === "string") {
            savedBytes = input[1][1].length;
            if (savedBytes) { // do nothing if it was already empty
                grunt.verbose.writeln(comment + input[1][1]);
                input[1][1] = "";
            }
        }
        return savedBytes;
    };

    /**
     * A visitor which cleans all strings that are stored in a property named '$description'.
     */
    var removeDollarDescriptionInBean = function (input, parents) {
        var condition = function (input, parents) {
            return (input[0] === "$description");
        };
        return simpleStringCleaner(condition, '[min] Removed the $description: ', input, parents);
    };

    /**
     * A visitor which cleans all strings that are stored in a property named 'description' which is a child of
     * '$events' JSON object.
     */
    var removeDescriptionInEvent = function (input, parents) {
        var condition = function (input, parents) {
            return (input[0] === "description" && parents[5] && parents[5][0] === "$events");
        };
        return simpleStringCleaner(condition, '[min] Removed the description: ', input, parents);
    };

    function getAllReplacementVisitors () {
        var replacementVisitors = [];
        replacementVisitors.push(removeDollarDescriptionInBean);
        replacementVisitors.push(removeDescriptionInEvent);
        return replacementVisitors;
    };

};
