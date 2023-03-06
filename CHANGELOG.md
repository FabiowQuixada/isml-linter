# Changelog

## [5.43.9] - 2023-03-05

### Fixed
 - "leading-iscache" and "leading-iscontent" rules - update tree data after move nodes on autofix mode;

## [5.43.8] - 2023-03-04

### Fixed
 - Identification of HTML tag attributes even when there is no blank space separating them;

## [5.43.7] - 2023-03-03

### Fixed
 - "indent" rule - keep tag type if previous element has trailing spaces;

## [5.43.6] - 2023-02-25

### Fixed
 - "indent" rule - don't add indentation to embbeded "isprint" tag if it's in the same line as previous attribute;

## [5.43.5] - 2023-02-21

### Fixed
 - "indent" rule - keep indentation of closing tag that is in same line as corresponding opening tag;
 - Tree build for an empty template;

## [5.43.4] - 2023-02-20

### Fixed
 - [Issue #39][issue#39] - Allow closing tag to be in the same line as corresponding opening tag last character;

## [5.43.3] - 2023-02-20

### Fixed
 - Issue that blocked process due to a missing return value in some rules;

## [5.43.2] - 2023-02-12

### Security
 - Upgraded dependencies;

## [5.43.1] - 2023-02-11

### Fixed
 - All line-by-line rules are applied, one after the other, without ovewriting the previous rule fixed content;

## [5.43.0] - 2023-01-31

### Added
 - "allowWhenDynamic" (default `true`) option to "[no-inline-style][no-inline-style-readme]" rule;

### Fixed
 - Rule-level ignore string with "/" character for directories;

## [5.42.4] - 2023-01-30

### Fixed
 - "indent" rule fix - multiline self-closing HTML conditional comment;
 - "indent" rule fix - closing tag after closing "isif" tag;
 
## [5.42.3] - 2023-01-29

### Fixed
 - Tree build fix when self-closing HTML conditional comments are present;
 
## [5.42.2] - 2023-01-29

### Fixed
 - HTML conditional comment children indentation;
 
## [5.42.1] - 2023-01-28

### Fixed
 - Keep template original linebreak if one is not explictly set in the ISML Linter configuration file. It was forcing a Unix linebreak;
 
## [5.42.0] - 2023-01-25

### Added
 - Introducing ["strict-void-elements" rule][strict-void-elements-readme];

### Changed
 - Allow Closing Tags for Void Elements in AST. "strict-void-elements" rule will optionally handle that invalid scenario;

### Fixed
 - "indent" Rule - Add "line" Attribute to Quote Issue Report;
 
## [5.41.0] - 2023-01-21

### Added
 - Exposed "fix" method in [ISML Linter API][api-docs];

### Fixed
 - Line-by-line and tree rules issues now are fixed in a single ISML Linter execution, not in two steps anymore;
 
## [5.40.5] - 2023-01-15

### Fixed
 - Disallow void elements closing tags;
 - Minor output messages improvement;

## [5.40.4] - 2023-01-15

### Fixed
 - Invalid ">" character detection;
 - Invalid element issue length;
 - "no-inline-style" rule;
 
## [5.40.3] - 2022-09-12

### Fixed
 - [Issue #35][issue#35] - Manually set bin file linebreak to LF, as previous version didn't fix the issue;

## [5.40.2] - 2022-09-05

### Fixed
 - [Issue #35][issue#35] - Set bin file linebreak to LF;

## [5.40.1] - 2022-09-01

### Fixed
 - HTML-element embedded `<isif>` condition scenario;
 - Added mechanism to prevent infinite loops in case of unexpected errors;
 
## [5.40.0] - 2022-02-05

### Added
 - "one-element-per-line" rule autofix;

### Fixed
 - Small "indent" rule issue;
 - Tree build edge case;
 
## [5.39.4] - 2022-01-30

### Fixed
 - "empty-eof" rule - line number for a last "isif" element;
 - Handle "isscript" tag content as text;
 - Allow custom node type to contain "-" character;
 
## [5.39.3] - 2021-10-02

### Fixed
 - [Issue #31][issue#31] - Attribute parse for 2-level embedded `<isif>` tags indentation;
 - Tree build - When a node has a hardcode element as first child;

### Security
 - Upgraded dependencies;

## [5.39.2] - 2021-09-26

### Fixed
 - [Issue #31][issue#31] - Attribute parse for 2-level embedded `<isif>` tags;
 - Tree build - When a node has a hardcode element as first child;
 
## [5.39.1] - 2021-09-19

### Added
 - Details to "verbose" global configuration option;

### Security
 - Upgraded dependencies;
 
## [5.39.0] - 2021-09-17

### Added
 - [Issue #31][issue#31] - "verbose" global configuration option;

## [5.38.5] - 2021-09-12

### Fixed
 - "[eslint-to-isscript][eslint-to-isscript-readme]" rule;

## [5.38.4] - 2021-09-11

### Fixed
 - Tree build edge case;
 - DOM element attributes parse;
 - "no-require-in-loop" rule - occurrence line number;
 - Displayed message when rule-specific unexpected error occurs;

## [5.38.3] - 2021-09-01

### Fixed
 - [Issue #30][issue#30]: allow custom tags to be non-self-closing;

## [5.38.2] - 2021-08-31

### Changed
 - Default value of "[indent][indent-readme]" rule's "quote" option to "never";
 - Improved "[indent][indent-readme]" rule's "standAloneClosingChars" configuration occurrence messages;

### Fixed
 - "[indent][indent-readme]" rule - tags closing character global position;

## [5.38.1] - 2021-08-29

### Fixed
 - "[indent][indent-readme]" rule autofix - removed buggy optimization;

## [5.38.0] - 2021-08-29

### Added
 - "standAloneClosingChars" configuration attribute to the "[indent][indent-readme]" rule;

### Fixed
 - "indent" rule - duplicated attribute parse;

## [5.37.0] - 2021-08-22

### Added
 - "except" and "allowHtmlEntities" configuration attributes to the "[no-hardcode][no-hardcode-readme]" rule;

## [5.36.5] - 2021-08-18

### Changed
 - Removed redundant information from "invalid character found" error message;

### Fixed
 - Unbalanced element position detection;
 - Tree build parse on edge cases;
 - "[no-inline-style][no-inline-style-readme]" rule - allow `<isprint>` tag to have "style" attribute;

## [5.36.4] - 2021-08-15

### Fixed
 - "indent" rule - "isif"-nested value indentation;
 - "indent" rule - attribute multi-line value indentation;

## [5.36.3] - 2021-08-13

### Fixed
 - "indent" rule - autofix to keep space between tag attributes;
 - "indent" rule - expression attribute indentation fix;
 - "indent" rule - indentation of attribute value with embedded "isif" in it;

## [5.36.2] - 2021-08-11

### Fixed
 - "indent" rule - autofix to keep duplicate spaces between tag attributes;
 - "indent" rule - attribute value indentation;
 - Tree build - unbalanced element detection;
 - Tree build - "script" tag with attribute parse;

## [5.36.1] - 2021-08-09

### Fixed
 - "indent" rule - indentation of tag attribute values that are in same line as attribute name;

### Deprecated
 - "[no-br][no-br-readme]" and "[no-isscript][no-isscript-readme]" rules in favor of "[disallow-tags][disallow-tags-readme]" rule;
 
## [5.36.0] - 2021-08-07

### Added
 - "no-redundant-context" rule;

## [5.35.10] - 2021-07-31

### Fixed
 - "indent" rule - indentation of tag attributes' values in separate lines;
 - "indent" rule - keep single quotes on attribute values on autofix;

## [5.35.9] - 2021-07-27

### Fixed
 - "indent" rule - indentation of tag attributes in separate lines;

### Security
 - Upgraded dependencies;

## [5.35.8] - 2021-07-24

### Fixed
 - "indent" rule application for attributes in separate lines;
 - Sort template occurrences by line number;

### Security
 - Upgraded dependencies;

## [5.35.7] - 2021-06-27

### Fixed
 - "indent" rule;
 
## [5.35.6] - 2021-06-27

### Fixed
 - "indent" rule;

## [5.35.5] - 2021-06-26

### Changed
 - Refactoring to keep compatibility with older Node versions;

## [5.35.4] - 2021-06-26

### Fixed
 - "indent" rule autofix feature;

## [5.35.3] - 2021-06-12

### Changed
- [Issue #29][issue#29]: Behaviour unification with other linters:
  - Removed progress bar;
  - Removed success message;

### Fixed
 - Circular dependency warning;

## [5.35.2] - 2021-06-10

### Fixed
 - [Issue #26][issue#26]: issue with "script" tag content;

### Removed
 - Unused dev dependencies;
 
## [5.35.1] - 2021-03-20

### Fixed
 - [Issue #23][issue#23]: "columnNumber" attribute to "eslint-to-isscript" rule result;

### Security
 - Upgraded dependencies;

## [5.35.0] - 2021-03-14

### Added
 - [Issue #23][issue#23]: "columnNumber" attribute to lint result;

## [5.30.4] - 2021-03-07

### Added
 - "config" optional parameter to [public API][api-docs]'s "parse" method;

### Fixed
 - [Issue #23][issue#23]: "indent" rule "value" attribute;

### Changed
 - Package name from "Isml Linter" to "ISML Linter";

### Security
 - Upgraded dependencies;

### Deprecated
 - Global "indent" attribute in favor of "indent" rule's "value" attribute;

## [5.30.3] - 2021-02-13

### Fixed
 - Tree unbalance position detection;

### Changed
 - Re-added VSCode extension README section;

## [5.30.2] - 2021-01-17

### Fixed
 - "max-depth" rule;
 - "empty-eof" rule;

## [5.30.1] - 2021-01-14

### Fixed
 - "indent" rule;

## [5.30.0] - 2021-01-12

### Changed
 - Complete tree build redesign, ISML Linter now runs 40 times faster;
 - Treat &lt;iscomment> tag children as plain text;
 - ESLint indentation reporting;

### Fixed
 - "indent" rule;
 - "max-depth" rule;
 - Some occurrences length;
 - autofix issue due to "enableCache" option;

### Deprecated
 - "enableCache" option;

## [5.29.2] - 2020-12-27

### Fixed
 - Tree build;
 - "indent" rule;

## [5.29.1] - 2020-12-10

### Security
 - Upgraded dependencies;

## [5.29.0] - 2020-12-06

### Added
 - [Issue #8][issue#8]: "non-tag" and "iscomment" exception options to "one-element-per-line" rule;

### Fixed
 - Tree build edge case;
 - "indent" rule edge case;

## [5.28.1] - 2020-11-29

### Fixed
 - "ignoreUnparseable" config option;
 
## [5.28.0] - 2020-11-28

### Changed
 - Big refactoring;

### Fixed
 - Tree build edge case;
 - ISML nodes global position;
 - Rules occurrence global position;
 - "eslint-to-isscript" rule behavior upon file change;
 - "indent" rule various issues;

## [5.27.0] - 2020-11-15

### Added
 - [Issue #20][issue#20]: "[enforce-security][enforce-security-readme]" rule;

## [5.26.9] - 2020-08-28

### Fixed
 - Removed linter blocker in case "eslint-to-isscript" rule is enabled but there is no eslint file configured;

## [5.26.8] - 2020-08-06

### Changed
 - Indent rule occurrence message;

### Fixed
 - Indent rule;

### Removed
 - VSCode extension README section (temporarily);
 
## [5.26.7] - 2020-08-02

### Changed
 - Scaffold configuration file: removed known buggy rules and enabled cache;

### Fixed
 - Custom tags don't need to be self-closing;

## [5.26.6] - 2020-07-26

### Fixed
 - Command line interface parameters;
 
## [5.26.5] - 2020-07-18

### Fixed
 - "indent" rule;
 - Cross-OS issues;
 
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
 - [Issue #4][issue#4] ".eslintrc" filename as an acceptable config filename;

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
 - ISML node types;
 
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
 - ISML node closing tag data: position and length;

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
 - Single file as param to ISML Linter;
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
   - No Embedded ISML Tag;

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

[5.43.9]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.8...v5.43.9
[5.43.8]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.7...v5.43.8
[5.43.7]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.6...v5.43.7
[5.43.6]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.5...v5.43.6
[5.43.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.4...v5.43.5
[5.43.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.3...v5.43.4
[5.43.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.2...v5.43.3
[5.43.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.1...v5.43.2
[5.43.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.43.0...v5.43.1
[5.43.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.42.4...v5.43.0
[5.42.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.42.3...v5.42.4
[5.42.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.42.2...v5.42.3
[5.42.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.42.1...v5.42.2
[5.42.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.42.0...v5.42.1
[5.42.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.41.0...v5.42.0
[5.41.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.40.5...v5.41.0
[5.40.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.40.4...v5.40.5
[5.40.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.40.3...v5.40.4
[5.40.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.40.2...v5.40.3
[5.40.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.40.1...v5.40.2
[5.40.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.40.0...v5.40.1
[5.40.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.39.4...v5.40.0
[5.39.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.39.3...v5.39.4
[5.39.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.39.2...v5.39.3
[5.39.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.39.1...v5.39.2
[5.39.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.39.0...v5.39.1
[5.39.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.38.5...v5.39.0
[5.38.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.38.4...v5.38.5
[5.38.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.38.3...v5.38.4
[5.38.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.38.2...v5.38.3
[5.38.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.38.1...v5.38.2
[5.38.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.38.0...v5.38.1
[5.38.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.38.0...v5.38.1
[5.38.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.37.0...v5.38.0
[5.37.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.36.5...v5.37.0
[5.36.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.36.4...v5.36.5
[5.36.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.36.3...v5.36.4
[5.36.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.36.2...v5.36.3
[5.36.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.36.1...v5.36.2
[5.36.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.36.0...v5.36.1
[5.36.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.10...v5.36.0
[5.35.10]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.9...v5.35.10
[5.35.9]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.8...v5.35.9
[5.35.8]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.7...v5.35.8
[5.35.7]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.6...v5.35.7
[5.35.6]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.5...v5.35.6
[5.35.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.4...v5.35.5
[5.35.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.3...v5.35.4
[5.35.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.2...v5.35.3
[5.35.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.1...v5.35.2
[5.35.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.35.0...v5.35.1
[5.35.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.30.4...v5.35.0
[5.30.4]: https://github.com/FabiowQuixada/isml-linter/compare/v5.30.3...v5.30.4
[5.30.3]: https://github.com/FabiowQuixada/isml-linter/compare/v5.30.2...v5.30.3
[5.30.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.30.1...v5.30.2
[5.30.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.30.0...v5.30.1
[5.30.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.29.2...v5.30.0
[5.29.2]: https://github.com/FabiowQuixada/isml-linter/compare/v5.29.1...v5.29.2
[5.29.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.29.0...v5.29.1
[5.29.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.28.1...v5.29.0
[5.28.1]: https://github.com/FabiowQuixada/isml-linter/compare/v5.28.0...v5.28.1
[5.28.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.27.0...v5.28.0
[5.27.0]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.9...v5.27.0
[5.26.9]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.8...v5.26.9
[5.26.8]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.7...v5.26.8
[5.26.7]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.6...v5.26.7
[5.26.6]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.5...v5.26.6
[5.26.5]: https://github.com/FabiowQuixada/isml-linter/compare/v5.26.4...v5.26.5
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
[issue#8]:  https://github.com/FabiowQuixada/isml-linter/issues/8
[issue#9]:  https://github.com/FabiowQuixada/isml-linter/issues/9
[issue#11]: https://github.com/FabiowQuixada/isml-linter/issues/11
[issue#17]: https://github.com/FabiowQuixada/isml-linter/issues/17
[issue#20]: https://github.com/FabiowQuixada/isml-linter/issues/20
[issue#23]: https://github.com/FabiowQuixada/isml-linter/issues/23
[issue#26]: https://github.com/FabiowQuixada/isml-linter/issues/26
[issue#29]: https://github.com/FabiowQuixada/isml-linter/issues/29
[issue#30]: https://github.com/FabiowQuixada/isml-linter/issues/30
[issue#31]: https://github.com/FabiowQuixada/isml-linter/issues/31
[issue#35]: https://github.com/FabiowQuixada/isml-linter/issues/35
[issue#39]: https://github.com/FabiowQuixada/isml-linter/issues/39

[cli-docs]: <docs/cli.md>
[api-docs]: <docs/api.md>
[license]:  <LICENSE>

[strict-void-elements-readme]: <docs/rules/strict-void-elements.md>
[disallow-tags-readme]:        <docs/rules/disallow-tags.md>
[no-br-readme]:                <docs/rules/no-br.md>
[no-inline-style-readme]:      <docs/rules/no-inline-style.md>
[no-isscript-readme]:          <docs/rules/no-isscript.md>
[enforce-security-readme]:     <docs/rules/enforce-security.md>
[no-hardcode-readme]:          <docs/rules/no-hardcode.md>
[indent-readme]:               <docs/rules/indent.md>
[eslint-to-isscript-readme]:   <docs/rules/eslint-to-isscript.md>
