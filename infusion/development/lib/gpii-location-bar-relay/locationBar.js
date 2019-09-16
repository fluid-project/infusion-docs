/*

    A component to relay model changes to and from the browser's location bar.  See the docs for details.

*/
/* global fluid, window, document */

(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.locationBar.stateManager.");

    // Parse a query string and return a JSON object.
    gpii.locationBar.stateManager.queryToJson = function (queryString) {
        // Remove the leading question mark if found.
        if (queryString.indexOf("?") === 0) {
            queryString = queryString.substring(1);
        }

        return gpii.express.querystring.decode(queryString);
    };

    // Load model data from the query string and apply it to the model.
    gpii.locationBar.stateManager.queryToModel = function (that) {
        if (that.options.queryToModel) {
            var queryData = gpii.locationBar.stateManager.queryToJson(window.location.search);
            var newModelData = fluid.model.transformWithRules(queryData, that.options.rules.queryToModel);

            gpii.locationBar.stateManager.batchChanges(that, newModelData, false);

            that.events.queryDataLoaded.fire(that);
        }
    };

    // Listen for any model changes and update the model state and/or query string.
    gpii.locationBar.stateManager.updateState = function (that, newState) {
        // Set the state data to:
        //   1. The model if we are configured to do so
        //   2. The current state value if it exists
        //   3. An empty object if it does not.
        var stateData = that.options.modelToState ? fluid.model.transformWithRules(that.model, that.options.rules.modelToState) : window.history.state || {};
        var stateUrl = window.location.href;

        // The URL will change if `that.options.modelToQuery` is enabled.
        if (that.options.modelToQuery) {
            var queryData = fluid.model.transformWithRules(that.model, that.options.rules.modelToQuery);
            var queryString = gpii.express.querystring.encodeObject(queryData);

            // Combine the "origin" with the "path" to get the URL minus any existing query data.
            stateUrl = window.location.origin + window.location.pathname + "?" + queryString;
        }

        // Add a new history entry or replace the existing one, depending on our options.
        if (window.history) {
            var fnName = newState ? "pushState" : "replaceState";
            if (window.history[fnName]) {
                window.history[fnName](stateData, document.title, stateUrl);
            }
        }
    };

    // Apply all changes in a single transaction.  Also ensures that values flagged with `null` are deleted from the model.
    gpii.locationBar.stateManager.batchChanges = function (that, changeSet, deleteExisting) {
        var myTransaction = that.applier.initiate();

        // If we are loading the entire model from the state, we must clear out existing values to avoid revealing
        // data from the future (Spoilers!)
        if (deleteExisting) {
            myTransaction.fireChangeRequest({ path: "", type: "DELETE"});
        }

        fluid.each(changeSet, function (value, key) {
            var change = { path: key, value: value };
            myTransaction.fireChangeRequest(change);
        });

        myTransaction.commit();
    };

    // Enable our browser back/forward listener.
    gpii.locationBar.stateManager.bindStateToModel = function (that) {
        if (that.options.stateToModel) {
            window.onpopstate = that.handleStateChange;
        }
    };

    // Update the model using the recorded history when the back/forward button is pressed.
    gpii.locationBar.stateManager.handleStateChange = function (that, event) {
        var newModelData = fluid.model.transformWithRules(event.state, that.options.rules.stateToModel);
        gpii.locationBar.stateManager.batchChanges(that, newModelData, true);
    };

    // The "inner" stateManager reacts only to changes relayed from other components.
    fluid.defaults("gpii.locationBar.stateManager", {
        gradeNames: ["fluid.modelComponent"],
        invokers: {
            handleStateChange: {
                funcName: "gpii.locationBar.stateManager.handleStateChange",
                args:     ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            "onCreate.queryToModel": {
                funcName:  "gpii.locationBar.stateManager.queryToModel",
                priority:  "first",
                // namespace: "queryToModel",
                args:     ["{that}"]
            },
            "onCreate.modelToState": {
                funcName: "gpii.locationBar.stateManager.updateState",
                priority:  "after:queryToModel",
                // namespace: "modelToState",
                args:     ["{that}", false]
            },
            "onCreate.bindStateToModel": {
                funcName: "gpii.locationBar.stateManager.bindStateToModel",
                priority:  "after:modelToState",
                // namespace: "bindStateToModel",
                args:     ["{that}"]
            }
        },
        events: {
            queryDataLoaded: null
        },
        modelListeners: {
            "*": {
                funcName:      "gpii.locationBar.stateManager.updateState",
                args:          ["{that}", "{that].options.addNewHistoryEntry"],
                excludeSource: ["init", "local"]
            }
        }
    });

    // The "outer" component can be notified of changes externally, and these will result in updates to the
    // "inner" stateManager.  We need to do this to compartmentalize updates.  Otherwise:
    //
    // 1. An update to the model is saved when the state is changed.
    // 2. The same model data we just received is saved to the state again, bloating the history with duplicate entries.
    //
    fluid.defaults("gpii.locationBar", {
        gradeNames: ["fluid.modelComponent"],
        mergePolicy: {
            rules: "nomerge"
        },
        addNewHistoryEntry: true,
        modelToQuery:       true,
        modelToState:       true,
        queryToModel:       true,
        rules: {
            modelToQuery: { "": "" },
            queryToModel: { "": "" },
            modelToState: { "": "" },
            stateToModel: { "": "" }
        },
        stateToModel:       true,
        components: {
            stateManager: {
                type: "gpii.locationBar.stateManager",
                options: {
                    model:              "{gpii.locationBar}.model",
                    addNewHistoryEntry: "{gpii.locationBar}.options.addNewHistoryEntry",
                    modelToQuery:       "{gpii.locationBar}.options.modelToQuery",
                    queryToModel:       "{gpii.locationBar}.options.queryToModel",
                    modelToState:       "{gpii.locationBar}.options.modelToState",
                    stateToModel:       "{gpii.locationBar}.options.stateToModel",
                    rules:              "{gpii.locationBar}.options.rules"
                }
            }
        }
    });
})();
