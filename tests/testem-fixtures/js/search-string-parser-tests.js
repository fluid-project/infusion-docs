/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";

    jqUnit.module("Search string parser tests.");

    jqUnit.test("Search string parser tests.", function () {
        var emptyResults = {
            mayContainPhrases:     [],
            mayContainWords:       [],
            mustContainPhrases:    [],
            mustContainWords:      [],
            mustNotContainPhrases: [],
            mustNotContainWords:   []
        };

        var testDefs = {
            simplePhrase: {
                message: "We should be able to handle a search string that's just a single phrase.",
                input: "\"a phrase\"",
                expected: {
                    mayContainPhrases: ["a phrase"]
                }
            },
            multiplePhrases: {
                message: "We should be able to handle multiple phrases.",
                input: "\"one phrase\" \"another phrase\"",
                expected: {
                    mayContainPhrases: ["one phrase", "another phrase"]
                }
            },
            openEnded: {
                message: "We should be able to handle open ended closing quotes.",
                input: "\"the fun never quote stops",
                expected: {
                    mayContainPhrases: ["the fun never quote stops"]
                }
            },
            weightedPhrases: {
                message: "We should be able to handle weighted phrases.",
                input: "\"may have\" +\"must have\" -\"must not have\"",
                expected: {
                    mayContainPhrases:     ["may have"],
                    mustContainPhrases:    ["must have"],
                    mustNotContainPhrases: ["must not have"]
                }
            },
            singleWord: {
                message: "We should be able to handle a search string that's a single word.",
                input: "ellipsis",
                expected: {
                    mayContainWords: ["ellipsis"]
                }
            },
            simpleWords: {
                message: "We should be able to handle multiple non-weighted words.",
                input: "crunchy shrimp roll",
                expected: {
                    mayContainWords: ["crunchy", "shrimp", "roll"]
                }
            },
            weightedWords: {
                message: "We should be able to handle weighted words.",
                input: "+yup -nope meh",
                expected: {
                    mayContainWords:     ["meh"],
                    mustContainWords:    ["yup"],
                    mustNotContainWords: ["nope"]
                }
            },
            hyphenatedWords: {
                message: "We should be able to handle hyphenated words.",
                input: "+yes-man -no-brainer half-hearted",
                expected: {
                    mayContainWords:     ["half-hearted"],
                    mustContainWords:    ["yes-man"],
                    mustNotContainWords: ["no-brainer"]
                }
            },
            fullHouse: {
                message: "We should be able to handle complex combinations of words, phrases, and weighting.",
                input: "+cheese -\"head cheese\" blue -camembert \"full fat\" +\"lactose free\"",
                expected: {
                    mayContainWords:       ["blue"],
                    mayContainPhrases:     ["full fat"],
                    mustContainWords:      ["cheese"],
                    mustContainPhrases:    ["lactose free"],
                    mustNotContainWords:   ["camembert"],
                    mustNotContainPhrases: ["head cheese"]
                }
            }
        };

        fluid.each(testDefs, function (testDef) {
            var expected = fluid.extend({}, emptyResults, testDef.expected);
            var actual   = fluid.docs.search.parseSearchString(testDef.input);
            jqUnit.assertDeepEq(testDef.message, expected, actual);
        });
    });
})(fluid, jqUnit, $);
