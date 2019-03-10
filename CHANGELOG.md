# Changelog

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

[4.0.1]: https://github.com/FabiowQuixada/isml-linter/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/FabiowQuixada/isml-linter/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/FabiowQuixada/isml-linter/compare/v2.3.0...v3.0.0
[2.3.0]: https://github.com/FabiowQuixada/isml-linter/compare/2.2.0...v2.3.0
[2.2.0]: https://github.com/FabiowQuixada/isml-linter/compare/2.0.1...2.2.0
[2.0.1]: https://github.com/FabiowQuixada/isml-linter/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/FabiowQuixada/isml-linter/compare/1.0.1...2.0.0
[1.0.1]: https://github.com/FabiowQuixada/isml-linter/compare/1.0.0...1.0.1
