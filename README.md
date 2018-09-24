### IsmlLinter
IsmlLinter is a tool for examing if your project's templates follow a specified set of rules defined by your dev team. The available rules can be roughly grouped into: 

 - Styles that are defined by your team;
 - Syntactic errors related to &lt;is* > tags;
 - Coding conventions recommended by SalesForce;
 - Git conflicts that may accidentally be left unresolved;

The linter is still on an early stage, so that some of the groups above may have room for improvement. Please feel free to make suggestions and help make this linter better. :) The set of currently available rules can be found below.

When run, IsmlLinter will generate two files under "isml-linter/output/" in your project's root directory. One of these files is the main output file, which lists all the enabled broken rules (file by file, line by line), and the other is a compiled version of it, so you have a good overview of the current status of your templates.

You can use these files to automate error checking in your build process.


### Installation

You can install IsmlLinter either locally or globally:

##### Local Installation
If you choose to install it locally, simply run:

```sh
$ npm install isml-linter --save-dev
```

and then, from you project root directory, run:

```sh
$ ./node_modules/.bin/isml-linter
```

As a suggestion, add this command to you package.json file as a script with a custom name, so that it may be easier to remember how to run IsmlLinter.

##### Global Installation
If you prefer to install it globally, run:

```sh
$ npm install -g isml-linter
```

and then, from you project root directory, run:

```sh
$ isml-linter
```

##### Configuration Notes

- Add the 'isml-linter/' directory to your .gitignore file;
- When you run IsmlLinter for the first time, an .ismllinter.json file will be created in your project root directory. All rules will be listed there (enabled by default) so you can clearly see what this linter can do for you. To disable a rule, simply remove it from the .ismllinter.json file and run IsmlLinter again;

##### Configuration Options

Currently, the following configurations can be set in the .ismllinter.json file:

- **rootDir** - The root directory under which the linter will run. Defaults to the directory where the package.json file is;
- **ignore** - Array of strings. If a file path contains (as a substring) any string defined here, that file will be ignored by the linter;
- **enabledRules** - Defines which rules to check. See available rules below;

Example configuration:

```json
{
    "rootDir": "./cartridges",
    "ignore": ["this_directory_is_to_be_ignored"],
    "enabledRules" : {
        "BrTagRule" : {}, 
        "DwOccurrenceRule" : {}
    }
}
```


### Build Script

If you want to add Isml Linter to your build process, you can use the following script:

```javascript
#!/usr/bin/env node

const IsmlLinter = require('isml-linter').IsmlLinter;
const lintResults = IsmlLinter.run();
const errorQty = Object.keys(lintResults.errors).length;

process.exit(errorQty);
```

### Available Rules

- :exclamation: **BalancedIsifTagRule** - Checks if the &lt;isif/> tag is balanced;
- **BrTagRule** - Checks for presence of &lt;br/> tags. Enable this rule if you prefer to use CSS to handle horizontal spacing;
- **DwOccurrenceRule** - Checks if there is a direct call to a DigitalScript class, such as in "var PaymentMgr = dw.order.PaymentMgr". For this case, it is recommended to use require('dw/order/PaymentMgr') instead;
- **GitConflictRule** - Checks if there are unresolved Git conflicts. If you have been coding for a while, you may have found commited unresolved conflicts. This rule helps preventing that from happening;
- **ImportPackageRule** - Detects use of importPackage() function. It is recommended by SalesForce to use require() instead;
- **IsprintTagRule** - Checks if there is a ${string} not wrapped by an &lt;isprint/> tag;
- **LogicInTemplateRule** - Checks if there is an &lt;isscript/> tag in template. Enable this rule if you prefer logic to be kept in a separate .ds/.js file; 
- **SpaceAtEndOfLineRule** - Checks for trailing blank spaces;
- **SpacesOnlyLineRule** - Checks for lines that contain only blank spaces, i.e., unnecessarily indented;
- **StyleAttributeRule** - Detects use of "style" HTML attribute. Enable this rule if you prefer style to be fully handled via CSS;
- **TabRule** - Detects use of tabs;

:exclamation: This rule is now deprecated, as we're working on a AST (abstract syntax tree) to validate the whole document tree validity.