# Changelog

## [5.26.4] - 2020-06-11

### Fixed
 - Npm-ignore database directory;
 
## [5.26.3] - 2020-06-09

### Fixed
 - Database dependency issue;
 
## [5.26.2] - 2020-06-07

### Fixed
 - "no-deprecated-attrs" rule;
 
## [5.26.1] - 2020-05-28

### Fixed
 - Tree build process;
 - License in package.json, from "ISC" to "MIT", to be in accordance with the [LICENSE][license] file;
 
## [5.26.0] - 2020-05-26

### Added
 - "printPartialResults" configuration option;
 
## [5.25.7] - 2020-05-25

### Fixed
 - "indent" rule line number 0 issue;
 - "no-hardcode" rule for &lt;script> tag with ISML tags within its content;
 
## [5.25.6] - 2020-05-24

### Added
 - Known "enforce-isprint" rule bug report to documentation;

### Fixed
 - "no-hardcode" rule to ignore &lt;style> tag content;
 
## [5.25.5] - 2020-05-20

### Fixed
 - Parse handling of missing closing char ">";
 - Parse handling of unclosed ISML deprecated comment;
 
## [5.25.4] - 2020-05-17

### Fixed
 - [Issue #17][issue#17]: "contextual-attrs" rule;

## [5.25.3] - 2020-05-07

### Added 
 - License file;

### Changed
 - Set some dependencies as "dev" dependencies;  

### Security
 - Upgraded dependencies;

## [5.25.2] - 2020-04-30

### Added
 - Possibility for the configuration file to be ".ismllintrc.js";

### Fixed
 - Moved database file to the proper directory;

## [5.25.1] - 2020-04-29

### Added
 - Extra description to cache docs;

### Fixed
 - "eslint-to-isscript" rule validation;

## [5.25.0] - 2020-04-22

### Added
 - "[disallow-tags][disallow-tags-readme]" rule;

## [5.24.1] - 2020-03-27

### Fixed
 - Cache feature on database creation;

### Security
 - Updated dependencies;
 
## [5.24.0] - 2020-03-24

### Added
 - Cache feature;

## [5.23.1] - 2020-03-02

### Fixed
 - Public API print result method;
 - Occurrence level issues;
 
## [5.23.0] - 2020-02-26

### Added
 - "warning" and "info" broken rule occurrence levels;

## [5.22.4] - 2019-12-29

### Security
 - Updated vulnerable dependencies;

## [5.22.3] - 2019-12-25

### Changed
 - Lint result error messages;

### Fixed
 - "custom-tags" rule;

## [5.22.2] - 2019-12-07

### Added
 - Accepted isml configuration file names to README file;

### Fixed
 - Command line "init" option;
 
## [5.22.1] - 2019-11-30

### Fixed
 - [Issue #7][issue#7], [issue #11][issue#11]: "one-element-per-line" rule;
 - [Issue #9][issue#9]: "empty-eof" rule;
 - "No hardcode" and "Indent" rules: ignore &lt;script> tag content;
 
## [5.22.0] - 2019-11-24

### Added
 -  [Issue #4][issue#4] ".eslintrc" filename as an acceptable config filename;

### Fixed
 - Command Line - If no directory or template parameter is passed, configured root directory or default directory is used;
 
## [5.21.0] - 2019-11-17

### Added
 - [Issue #6][issue#6] Feature to lint specific file or directory through [command line][cli-docs];
 
## [5.20.0] - 2019-11-09

### Added
 - "Indent" rule autofix feature;

## [5.19.2] - 2019-11-06

### Fixed
 - [Issue #5][issue#5] "rootDir" config option;

## [5.19.1] - 2019-09-16

### Changed
 - Moved source code up in the directory tree;

### Fixed
 - Tree build: Allow slashy &lt;isif/> tag;

## [5.19.0] - 2019-09-08

### Added
 - Line ending configuration;
 - ESLint configuration file: ".js" is now allowed;

### Changed
 - Optimized npm package size;

## [5.18.8] - 2019-09-05

### Fixed
 - Configuration dynamic definition;
 
## [5.18.7] - 2019-09-04

### Removed
 - "Indent" rule autofix feature due to major bugs;
 - "One Element per Line" rule autofix feature due to major bugs;

## [5.18.6] - 2019-09-03

### Fixed
 - "Indent" rule autofix feature;

## [5.18.5] - 2019-09-02

### Fixed
 - "Eslint to Isscript" rule;
 
## [5.18.4] - 2019-09-01

### Added
 - Minimum required Node version (>=10.0.0) to docs;

### Changed
 - Display up to 100 errors in the output;

### Fixed
 - Suggested initialization command;

## [5.18.3] - 2019-09-01

### Added
 - Progress bar;
 - "path" parameter to the API's build method;

## [5.18.2] - 2019-08-31

### Fixed
 - HTML comments containing ISML expressions;
 - Implicitly closed self-closing ISML tags;
 - Minor output display fixes;
 
## [5.18.1] - 2019-08-27

### Fixed
 - "Lowercase Filename" rule;
 - Configuration load;
 - "Missing ESLint config" error display message;
 
## [5.18.0] - 2019-08-25

### Added
 - "Indent" autofix feature;

### Changed
 - Removed empty nodes from ISML tree;

## [5.17.4] - 2019-08-24

### Fixed
 - API should not raise an error if no config is set at require time;
 
## [5.17.3] - 2019-08-22

### Fixed
 - HTML comment as first child element upon tree-based template reconstruction;

### Security
 - Updated vulnerable dependencies;

## [5.17.2] - 2019-08-20

### Fixed
 - Closing dynamic tag upon tree-based template reconstruction;
 
## [5.17.1] - 2019-08-19

### Added
 - Indent size global configuration;

### Changed
 - Code refactoring;

### Fixed
 - "One Element per Line" rule custom indentation size fix;

### Deprecated
 - "Indent" rule indentation size configuration;

## [5.17.0] - 2019-08-18

### Added
 - "No Iselse Slash" autofix feature;
 
## [5.16.0] - 2019-08-16

### Added
 - "Align Isset" rule;

### Changed
 - Code refactoring and optimization;
 
## [5.15.0] - 2019-08-10

### Added
 - "Max Lines" rule;

### Changed
 - Rule ID as lint result object key, instead of description;
 - Code refactoring;

## [5.14.3] - 2019-08-06

### Fixed
 - Bug related to a node-version-problematic dependency;

### Changed
 - Code refactoring;

## [5.14.2] - 2019-08-03

### Changed
 - Code refactoring;
 - Performance improvement;
 
## [5.14.1] - 2019-07-27

### Fixed
 - HTML comment opening strings within HTML comments, such as: &lt;!-- &lt;!-- -->
 
## [5.14.0] - 2019-07-23

### Added
 - Autofix feature for "Eslint to Isscript" rule;
 - Allowance only of custom modules lowercase attributes if "Custom Tags" rule is enabled;

### Changed
 - Code refactoring;
 
## [5.13.0] - 2019-07-20

### Added
 - "Empty End-of-File" rule;

### Security
- Updated vulnerable dependencies;
 
## [5.12.4] - 2019-07-15

### Fixed
 - ">" character occurrence within ISML expression;
 
## [5.12.3] - 2019-07-14

### Fixed
 - Issues with deprecated ISML comment: <!--- --->
 
## [5.12.2] - 2019-07-11

### Fixed
 - Generated-tree template reconstruction;
 
## [5.12.1] - 2019-07-10

### Fixed
 - Generated-tree template reconstruction;

### Security
- Updated vulnerable dependencies;
 
## [5.12.0] - 2019-07-09

### Added
 - "No Else Slash" rule;

### Fixed
 - Call to an inexistent function;
 - "iselse" tag global position and line number;
 
### Changed
 - Code refactoring;
 
## [5.11.0] - 2019-07-07

### Added
 - "ESLint to Isscript" rule;

### Fixed
 - Public API dynamic content parameter;
 
## [5.10.1] - 2019-06-29

### Changed
 - Code refactoring;

### Fixed
 - Included missing rules in config file for initialization script;
 
## [5.10.0] - 2019-06-20

### Added
 - "Leading Iscache" rule;
 - "Lowercase filename" rule;
 
## [5.9.0] - 2019-06-16

### Added
 - "Custom Tags" rule;

### Fixed
 - Issue with deprecated ISML comment: <!--- --->
 
## [5.8.0] - 2019-06-09

### Added
 - Autofix feature for rules:
   - One Element per Line;
   - Leading Iscontent;
 - VSCode extension reference to README;

## [5.7.1] - 2019-06-06

### Fixed
 - [Issue #3][issue#3] partially, build process now ignores files defined in the configuration file;

## [5.7.0] - 2019-06-04

### Added
 - "Contextual Attribute" rule;
 - "No Deprecated Attributes" rule;

## [5.6.1] - 2019-06-02

### Added
 - Performance-Meter;

### Fixed
 - Absolute path template as param;
 
### Changed
 - Considerable code refactoring;
 - Improved performance;

## [5.6.0] - 2019-05-28

### Added
 - New rule - "Leading &lt;iscontent> Tag";
 - Output information for "unknown error" scenario;

### Changed
 - Config file initialization: not automatic anymore. Description added to README;

## [5.5.3] - 2019-05-25

### Added
 - Data to unparseable template result;

### Fixed
 - Docs misspellings;
 - Contentless tag handling;
 - Isml node types;
 
## [5.5.2] - 2019-05-23

### Added
 - "Contribute" docs;
 
## [5.5.1] - 2019-05-21

### Added
 - Print lint output from API;

## [5.5.0] - 2019-05-20

### Added
 - Optional "content" param to API;
 - Unbalanced element information to parse output;
 - Parsed isml node attributes for future rules;
 - Isml node closing tag data: position and length;

### Fixed
 - Indentation Rule output data fix;

## [5.4.3] - 2019-05-12

### Fixed
 - Hardcode rule for edge cases:
   - If it's the first element in the DOM;
   - If it's the last element in the DOM;
   - If it's the only element in the DOM;

## [5.4.2] - 2019-05-08

### Fixed
 - Error occurrence global starting position;
 - Rule default and custom configs handling;
 - Single file as param to Isml Linter;
 - Output template path for unknown error;
 - Error occurrence length;

## [5.4.1] - 2019-05-05

### Fixed
 - Parse output filepath for unparseable templates;

## [5.4.0] - 2019-05-05

### Added
 - Public API's `parse()` method now also accepts array of filepaths;
 - Preferred config filename: ismllinter.config.js;
 - Public API backwards-compatibility objects;
 - Rule name and description to each API output;

## [5.3.0] - 2019-04-28

### Added
 - API docs;
 - Project-level path to linter result;
 - Donation button;

### Changed
 - Heavy code refactoring;

### Fixed
 - Hardcode-related parse bug;

## [5.2.0] - 2019-04-14

### Added
 - "disableHtml5" config;

### Changed
 - Improved error listing messages;

### Fixed
 - "No-hardcode" rule;
 - Various bugs on tree build:
   - Allowed void elements;
   - Allowed DOCTYPE tag;
   - Ignored script tag content for isml parsing; 
   - Custom tags with "_" character;
   - Allowed multiple elements;
   - Dynamic elements: &lt;${elem} />;
   - Allowed empty isml expression: ${};
   - &lt;iscomment> element;

## [5.1.0] - 2019-04-07

### Added
 - [Issue #2, item 1][issue#2] Rule-level ignore config;

### Fixed
 - [Issue #2, item 2][issue#2] "Enforce Isprint" rule;
 - "No hardcode" rule;
 - List unparseable templates;
 - Allowed slashy "isif" opening tag: &lt;isif />

## [5.0.3] - 2019-04-02

### Fixed
 - Issue on AST build;
 - Stopped creating an empty "output" directory;

## [5.0.2] - 2019-03-30

### Added
 - Git hooks suggestion on README;

## [5.0.1] - 2019-03-25

### Fixed
- Autofix was not applied to all files;

### Security
- Updated vulnerable dependencies;

## [5.0.0] - 2019-03-19

### Added
 - Autofix feature;
 - Autofix for rules:
   - no-space-only;
   - no-tabs;
   - no-trailing-spaces;

### Changed
 - Docs for scripts;

### Removed
 - Output JSON files;
 - Auto-update config from versions prior to v3.0.0;


## [4.0.3] - 2019-03-17

### Fixed
 - 'disableTreeParse' config flag;

### Removed
 - 'max-line' and 'complexity' rules from docs, as they are is not implemented yet;

## [4.0.2] - 2019-03-13

### Fixed
 - npm / github code sync;

## [4.0.1] - 2019-03-10

### Fixed
 - Unbalanced tag message fix;
 - Issue related to &lt;style> tag;

### Removed
  - 'empty-eof-line' rule from docs, as it is not implemented yet;

## [4.0.0] - 2019-03-03

### Added
 - AST build;
 - New rules:
   - Indentation;
   - Max depth;
   - No Require in Loop;
   - No hardcode;
   - One Element per Line;
   - No Embedded Isml Tag;
    
### Removed
- Global installation support;
    
### Deprecated
 - Output directory and json file;

## [3.0.0] - 2018-10-17

### Added
- Auto-conversion from old to new rule configuration keywords;

### Changed
- Configuration file rule definition;

### Removed
- BalancedIsifTagRule;

## [2.3.0] - 2018-10-07

### Added
- Print error list in log on build script run;

### Changed
- Error log in terminal instead of in a separate file;
- Improved README.md design;
- Simplified automated build script;

## [2.2.0] - 2018-10-01

### Added
- Configuration features: root linting directory and ignorable directories;
- Increased test coverage;

### Fixed
- Space at end of line rule for Windows;
- Output file line number;

## [2.0.1] - 2018-09-23

### Added
- Changelog file;
- Create error log file upon exception;

### Fixed
- A bug in the main script file;

## [2.0.0] - 2018-08-20

### Added
- Compatibility to be used by VS Code extension;

### Changed
- Design Refactoring;

### Security
- Updated vulnerable dependencies;

### Deprecated
- BalancedIsifTagRule;

## [1.0.1] - 2018-05-31

### Fixed
- Minor rules bugs;

## 1.0.0 - 2018-05-02

### Added
- Linter is published;

[5.26.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.3...v5.26.4
[5.26.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.2...v5.26.3
[5.26.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.1...v5.26.2
[5.26.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.0...v5.26.1
[5.26.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.7...v5.26.0
[5.25.7]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.6...v5.25.7
[5.25.6]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.5...v5.25.6
[5.25.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.4...v5.25.5
[5.25.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.3...v5.25.4
[5.25.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.2...v5.25.3
[5.25.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.1...v5.25.2
[5.25.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.25.0...v5.25.1
[5.25.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.24.1...v5.25.0
[5.24.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.24.0...v5.24.1
[5.24.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.23.1...v5.24.0
[5.23.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.23.0...v5.23.1
[5.23.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.22.4...v5.23.0
[5.22.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.22.3...v5.22.4
[5.22.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.22.2...v5.22.3
[5.22.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.22.1...v5.22.2
[5.22.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.22.0...v5.22.1
[5.22.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.21.0...v5.22.0
[5.21.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.20.0...v5.21.0
[5.20.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.19.2...v5.20.0
[5.19.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.19.1...v5.19.2
[5.19.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.19.0...v5.19.1
[5.19.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.8...v5.19.0
[5.18.8]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.7...v5.18.8
[5.18.7]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.6...v5.18.7
[5.18.6]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.5...v5.18.6
[5.18.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.4...v5.18.5
[5.18.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.3...v5.18.4
[5.18.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.2...v5.18.3
[5.18.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.1...v5.18.2
[5.18.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.18.0...v5.18.1
[5.18.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.17.4...v5.18.0
[5.17.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.17.3...v5.17.4
[5.17.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.17.2...v5.17.3
[5.17.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.17.1...v5.17.2
[5.17.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.17.0...v5.17.1
[5.17.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.16.0...v5.17.0
[5.16.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.15.0...v5.16.0
[5.15.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.14.3...v5.15.0
[5.14.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.14.2...v5.14.3
[5.14.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.14.1...v5.14.2
[5.14.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.14.0...v5.14.1
[5.14.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.13.0...v5.14.0
[5.13.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.12.4...v5.13.0
[5.12.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.12.3...v5.12.4
[5.12.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.12.2...v5.12.3
[5.12.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.12.1...v5.12.2
[5.12.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.12.0...v5.12.1
[5.12.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.11.0...v5.12.0
[5.11.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.10.1...v5.11.0
[5.10.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.10.0...v5.10.1
[5.10.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.9.0...v5.10.0
[5.9.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.8.0...v5.9.0
[5.8.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.7.1...v5.8.0
[5.7.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.7.0...v5.7.1
[5.7.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.6.1...v5.7.0
[5.6.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.6.0...v5.6.1
[5.6.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.5.3...v5.6.0
[5.5.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.5.2...v5.5.3
[5.5.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.5.1...v5.5.2
[5.5.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.5.0...v5.5.1
[5.5.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.4.3...v5.5.0
[5.4.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.4.2...v5.4.3
[5.4.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.4.1...v5.4.2
[5.4.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.4.0...v5.4.1
[5.4.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.3.0...v5.4.0
[5.3.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.2.0...v5.3.0
[5.2.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.1.0...v5.2.0
[5.1.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.0.3...v5.1.0
[5.0.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.0.2...v5.0.3
[5.0.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.0.1...v5.0.2
[5.0.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/FabiowQuixada/isml-linter/compare/v4.0.3...v5.0.0
[4.0.3]: https://github.com/FabiowQuixada/isml-linter/compare/v4.0.2...v4.0.3
[4.0.2]: https://github.com/FabiowQuixada/isml-linter/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/FabiowQuixada/isml-linter/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/FabiowQuixada/isml-linter/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/FabiowQuixada/isml-linter/compare/v2.3.0...v3.0.0
[2.3.0]: https://github.com/FabiowQuixada/isml-linter/compare/2.2.0...v2.3.0
[2.2.0]: https://github.com/FabiowQuixada/isml-linter/compare/2.0.1...2.2.0
[2.0.1]: https://github.com/FabiowQuixada/isml-linter/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/FabiowQuixada/isml-linter/compare/1.0.1...2.0.0
[1.0.1]: https://github.com/FabiowQuixada/isml-linter/compare/1.0.0...1.0.1

[issue#2]:  https://github.com/FabiowQuixada/isml-linter/issues/2
[issue#3]:  https://github.com/FabiowQuixada/isml-linter/issues/3
[issue#4]:  https://github.com/FabiowQuixada/isml-linter/issues/4
[issue#5]:  https://github.com/FabiowQuixada/isml-linter/issues/5
[issue#6]:  https://github.com/FabiowQuixada/isml-linter/issues/6
[issue#7]:  https://github.com/FabiowQuixada/isml-linter/issues/7
[issue#9]:  https://github.com/FabiowQuixada/isml-linter/issues/9
[issue#11]: https://github.com/FabiowQuixada/isml-linter/issues/11
[issue#17]: https://github.com/FabiowQuixada/isml-linter/issues/17

[cli-docs]: <docs/cli.md>
[license]:  <LICENSE>

[disallow-tags-readme]: <docs/rules/disallow-tags.md>
