/* globals jqUnit, lunr */
(function (fluid, jqUnit) {
    "use strict";
    fluid.registerNamespace("fluid.tests.search.manipulation");

    /**
     *
     * Count the "by section" results so that we can fairly compare search results.
     *
     * @param {SearchResults} searchResults - The results of a search.
     * @return {Integer} - The count of "by section" results in a search.
     *
     */
    fluid.tests.search.manipulation.sectionResultsCount = function (searchResults) {
        return Object.keys(searchResults.bySection).length;
    };

    jqUnit.module("Search unit tests.");

    jqUnit.test("Unit tests for `fluid.docs.search.orderByScore`.", function () {
        var expected = [{ score: 2 }, { score: 1}, {score: 1}, {score: 0}];
        var input = [{ score: 1 }, {score: 0}, { score: 1}, {score: 2}];
        var output = fluid.copy(input).sort(fluid.docs.search.orderByScore);
        jqUnit.assertDeepEq("We should be able to sort by score.", expected, output);
    });

    jqUnit.test("Unit tests for `fluid.docs.search.highestScoring`.", function () {
        var low    = { score: 0 };
        var middle = { score: 1 };
        var high   = { score: 2 };

        jqUnit.assertDeepEq("We should be able to get the highest scoring record if it's the first entry.", middle, fluid.docs.search.highestScoring(middle, low));

        jqUnit.assertDeepEq("We should be able to get the highest scoring record if it's the second entry.", high, fluid.docs.search.highestScoring(middle, high));
    });

    jqUnit.test("Unit tests for `fluid.docs.search.addResults`.", function () {
        var index = lunr.Index.load(fluid.docs.search.index);

        var unitResults = index.search("unit");
        var sectionedUnitResults = fluid.docs.search.sectionRawResults(unitResults);
        fluid.docs.search.groupByPage(sectionedUnitResults);

        var testResults = index.search("test");
        var sectionedTestResults = fluid.docs.search.sectionRawResults(testResults);
        fluid.docs.search.groupByPage(sectionedTestResults);

        var combinedResults = fluid.docs.search.addResults(sectionedUnitResults, sectionedTestResults);
        fluid.docs.search.groupByPage(combinedResults);

        jqUnit.assertTrue("There should be more results for both searches combined than for the first search alone.", combinedResults.ordered.length > sectionedUnitResults.ordered.length);
        jqUnit.assertTrue("There should be more results for both searches combined than for the second search alone.", combinedResults.ordered.length > sectionedTestResults.ordered.length);

        var hasAllFirstSearchResults = true;
        fluid.each(unitResults.bySection, function (singleHit, sectionKey) {
            if (!fluid.get(combinedResults, ["bySection", sectionKey])) {
                hasAllFirstSearchResults = false;
            }
        });
        jqUnit.assertTrue("The combined results should contain all entries from the first search.", hasAllFirstSearchResults);

        var hasAllSecondSearchResults = true;
        fluid.each(testResults.bySection, function (singleHit, sectionKey) {
            if (!fluid.get(combinedResults, ["bySection", sectionKey])) {
                hasAllFirstSearchResults = false;
            }
        });
        jqUnit.assertTrue("The combined results should contain all entries from the second search.", hasAllSecondSearchResults);

        var combinedDuplicateResults = fluid.docs.search.addResults(sectionedUnitResults, sectionedUnitResults);
        fluid.docs.search.groupByPage(combinedDuplicateResults);

        jqUnit.assertEquals("If results are combined with themselves, the number of results should not change.", sectionedUnitResults.ordered.length, combinedDuplicateResults.ordered.length);
    });

    jqUnit.test("Search phrase filtering tests.", function () {
        var index = lunr.Index.load(fluid.docs.search.index);

        var testResults = index.search("testing");
        var sectionedTestResults = fluid.docs.search.sectionRawResults(testResults);
        fluid.docs.search.groupByPage(sectionedTestResults);
        var allResultsLength = fluid.tests.search.manipulation.sectionResultsCount(sectionedTestResults);

        var anyPhraseResults = fluid.docs.search.filterToAnyPhrase(sectionedTestResults, ["unit testing", "testing in the browser"]);
        fluid.docs.search.groupByPage(anyPhraseResults);
        var anyPhraseResultsLength = fluid.tests.search.manipulation.sectionResultsCount(anyPhraseResults);

        jqUnit.assertTrue("There should be 'any phrase' results.", anyPhraseResultsLength > 0);
        jqUnit.assertTrue("There should be less filtered results for 'any phrase'.", anyPhraseResultsLength < allResultsLength);

        var excludedPhraseResults = fluid.docs.search.excludeAllPhrases(sectionedTestResults, ["unit testing", "testing in the browser"]);
        fluid.docs.search.groupByPage(excludedPhraseResults);
        var excludedResultsLength = fluid.tests.search.manipulation.sectionResultsCount(excludedPhraseResults);

        jqUnit.assertTrue("There should be 'excluded phrase' results.", excludedResultsLength > 0);

        jqUnit.assertTrue("There should be less results after we have excluded phrases.", excludedResultsLength < allResultsLength);
        jqUnit.assertEquals("We should be able to cleanly divide all records into those which have any phrase, and those which have none of them.", allResultsLength, excludedResultsLength + anyPhraseResultsLength);

        var allPhraseResults = fluid.docs.search.filterToAllPhrases(sectionedTestResults, ["integration testing", "testing within a component tree"]);
        fluid.docs.search.groupByPage(allPhraseResults);
        var allPhraseResultsLength = fluid.tests.search.manipulation.sectionResultsCount(allPhraseResults);

        jqUnit.assertTrue("There should be 'all phrase' results.", allPhraseResultsLength > 0);

        var negatedResults = fluid.docs.search.excludeAllPhrases(allPhraseResults, ["integration testing", "testing within a component tree"]);
        fluid.docs.search.groupByPage(negatedResults);
        var negatedResultsLength = fluid.tests.search.manipulation.sectionResultsCount(negatedResults);

        jqUnit.assertEquals("Requiring and excluding the same phrases should result in zero results.", 0, negatedResultsLength);
    });
})(fluid, jqUnit, $);
