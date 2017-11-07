/* eslint-env node */
/*

    A stub to allow others to `fluid.require` this package and reuse its content, as in:

    ```
    fluid.require("%infusion-docs");
    fluid.require("%infusion-docs/tests/js/lib/link-checker.js");
    var htmlContentPath = fluid.module.resolvePath("%infusion-docs/tests/html");
    ```

 */
"use strict";
var fluid = require("infusion");
fluid.module.register("infusion-docs", __dirname, require);
