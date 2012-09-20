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
 * Parser for CSS Template. A CSS template should be interpreted by the template engine to build a CSS Template class.
 * The difference with the HTML Template parser is that in this case it's necessary to escape any curly brackets that
 * does not belong to a dictionary of allowed Template statements.
 */
Aria.classDefinition({
    $classpath : "aria.templates.CSSParser",
    $extends : "aria.templates.Parser",
    $dependencies : ["aria.utils.String"],
    $singleton : true,
    $statics : {
        // ERROR MESSAGES:
        MISSING_OPENINGBRACES : "line %1: Template parsing error: could not find corresponding '{'."
    },
    $prototype : {
        /**
         * Parse the given CSS template and return a tree representing the template. Overrides aria.templates.Parser to
         * preprocess the text and escape curly brackets
         * @param {String} template to parse
         * @param {Object} context template context data, passes additional information the to error log
         * @param {Object} statements list of statements allowed by the class generator
         * @return {aria.templates.TreeBeans.Root} The tree built from the template, or null if an error occured. After
         * the execution of this method, this.template contains the template with comments and some spaces and removed,
         * and this.positionToLineNumber can be used to transform positions in this.template into line numbers.
         */
        parseTemplate : function (template, context, statements) {
            this.context = context;
            // Remove comments
            this._prepare(template);
            // Preprocess
            if (!this.__preprocess(statements)) {
                return null;
            }
            // Compute line numbers
            this._computeLineNumbers();
            // Build the tree
            return this._buildTree();
        },

        /**
         * Preprocess the CSS template to escape any curly brackets that will break the tree build
         * @param {Object} dictionary list of statementes allowed by the class generator
         * @return {Boolean} true if preprocessing was done successfully or false if there was a mismatch between '{'
         * and '}'
         * @private
         */
        __preprocess : function (dictionary) {
            // Everyting starts on the first {
            var text = this.template, utilString = aria.utils.String, currentPosition = 0, nextOpening = -1, nextClosing = -1, wholeText = [], nameExtractor = /^\{[\s\/]*?([\w]+)\b/, lastCopiedPosition = 0, textLength = text.length, statementLevel = -1, currentLevel = 0, lastOpenedLevel0 = -1;

            while (lastCopiedPosition < textLength) {
                // Update the pointers
                if (nextOpening < currentPosition) {
                    nextOpening = utilString.indexOfNotEscaped(text, "{", currentPosition);
                }
                if (nextClosing < currentPosition) {
                    nextClosing = utilString.indexOfNotEscaped(text, "}", currentPosition);
                }

                if (nextOpening > -1 && (nextClosing > nextOpening || nextClosing == -1)) {
                    // found a '{'
                    if (currentLevel === 0) {
                        lastOpenedLevel0 = nextOpening;
                    }
                    currentLevel++;
                    if (statementLevel == -1) {
                        // we are not inside a statement
                        if (text.charAt(nextOpening - 1) == "$") {
                            // we do not prefix in case we have ${...}
                            statementLevel = currentLevel;
                        } else {
                            var tag = text.substring(nextOpening, nextClosing);
                            var currentTagName = nameExtractor.exec(tag);
                            if (currentTagName && dictionary[currentTagName[1]]) {
                                // It's a statement, it shouldn't be escaped
                                // and we should skip everything inside this statement
                                statementLevel = currentLevel;
                            } else {
                                // add a prefix
                                wholeText.push(text.substring(lastCopiedPosition, nextOpening));
                                wholeText.push('\\{');
                                lastCopiedPosition = nextOpening + 1;
                            }
                        }
                    }
                    currentPosition = nextOpening + 1;
                } else if (nextClosing > -1) {
                    // found '}'
                    if (currentLevel === 0) {
                        // missing opening '{' corresponding to '}'
                        this._computeLineNumbers();
                        this.$logError(this.MISSING_OPENINGBRACES, [this.positionToLineNumber(nextClosing)], this.context);
                        return false;
                    }
                    if (statementLevel == currentLevel) {
                        statementLevel = -1; // no longer inside a statement
                    } else if (statementLevel == -1) {
                        // add the prefix for the closing }
                        wholeText.push(text.substring(lastCopiedPosition, nextClosing));
                        wholeText.push('\\}');
                        lastCopiedPosition = nextClosing + 1;
                    }
                    currentLevel--;
                    currentPosition = nextClosing + 1;
                } else {
                    this.$assert(94, nextOpening == -1 && nextClosing == -1);
                    // no more '{' or '}'
                    currentPosition = textLength;
                    wholeText.push(text.substring(lastCopiedPosition, textLength));
                    lastCopiedPosition = textLength;
                }
            }
            if (currentLevel > 0) {
                // missing opening '{' corresponding to '}'
                this._computeLineNumbers();
                this.$logError(this.MISSING_CLOSINGBRACES, [this.positionToLineNumber(lastOpenedLevel0)], this.context);
                return false;
            }
            this.template = wholeText.join("");
            return true;
        }
    }
});