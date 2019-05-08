# Changelog

## [5.4.2] - 2019-05-08

## Fixed
 - Error occurrence global starting position;
 - Rule default and custom configs handling;
 - Single file as param to Isml Linter;
 - Output template path for unknown error;
 - Error occurrence length;

## [5.4.1] - 2019-05-05

## Fixed
 - Parse output filepath for unparseable templates;

## [5.4.0] - 2019-05-05

### Added
 - Public API's `parse()` method now also accepts array of filepaths;
 - Preferred config filename: ismllinter.config.js;
 - Public API backwards-compability objects;
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
   - Allowed multile elements;
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

[issue#2]: https://github.com/FabiowQuixada/isml-linter/issues/2
