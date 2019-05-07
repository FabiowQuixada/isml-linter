const IsmlLinter  = require('./IsmlLinter');
const Builder     = require('./Builder');
const ConfigUtils = require('./util/ConfigUtils');
const FileParser  = require('./FileParser');

module.exports = {
    /**
     * Sets the configuration json data, in case you don't
     * want to use the default .isml-linter.json file in the
     * project root directory;
     *
     * @param  {Object}
     * @return {Object}
    */
    setConfig: json => { return ConfigUtils.load(json); },

    /**
     * Parses all files under a specific path;
     *
     * @param  {String} path      Single file, array of files or directory
     * @param  {String} [content] Content of the file, for cases when it needs
     *                            to be validated even if the changes were not
     *                            saved
     * @return {Object} structured parse result
     **/
    parse: (path, content) => { return IsmlLinter.run(path, content); },

    /**
     * Calls parse() with configured path as
     * param and prints the result to console;
     *
     * @return {Number} 0 if no errors we found
     *                  1 if errors were found
     **/
    build: () => { return Builder.run(); },

    // The following are available for retro-compability
    // and are deprecated. They do the same as the above
    // methods;
    IsmlLinter,
    Builder,
    FileParser
};
