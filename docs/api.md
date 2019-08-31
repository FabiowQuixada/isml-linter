# API Docs

When you use the linter through `require()` :

```js
const IsmlLinter = require('isml-linter');
```

you have access to the following methods:

```js
    /**
     * Sets the configuration json data, in case you don't
     * want to use the default .isml-linter.json file in the
     * project root directory;
     *
     * @param  {Object} json
     * @return {Object} config object - same as input
    */
    setConfig(json)

    /**
     * Parses all files under a specific path;
     *
     * @param  {String|Array} path  File path, directory path or array of file paths
     * @return {Object}             Structured parse result
     **/
    parse(path)

    /**
     * Prints errors to console;
     */
    printResults()

    /**
     * Calls parse() with configured path as
     * param and prints the result to console;
     *
     * @para   {String} path defaults to project root directory;
     * @return {Number} 0 if no errors were found
     *                  1 if errors were found
     **/
    build(path)

    // The following are available for retro-compatibility
    // and are deprecated. They do the same as the above
    // methods;
    IsmlLinter,
    Builder
```
