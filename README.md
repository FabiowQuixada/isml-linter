# Isml Linter
Isml Linter is a tool for examing if your project's templates follow a specified set of rules defined by your dev team. The available rules can be roughly grouped into: 

 - Styles that are defined by your team;
 - Syntactic errors related to &lt;is* > tags;
 - Coding conventions recommended by SalesForce;
 - Git conflicts that may accidentally be left unresolved;

The linter is still on an early stage, so that some of the groups above may have room for improvement. Please feel free to make suggestions and help make this linter better. :) The set of currently available rules can be found below.

When run, Isml Linter will generate two files under "isml-linter/output/" in your project's root directory. One of these files is the main output file, which lists all the enabled broken rules (file by file, line by line), and the other is a compiled version of it, so you have a good overview of the current status of your templates.

## Updating to Version 3.0.0

Please note that this update is automated, i.e., you won't need to do anything, not even run a single command. Of course, you'll still need to add the generated changes to your repository.

This section exists in order for you to know that a minor, but fundamental update will take place in the configuration file:

Changing from:

```json
{
    "enabledRules" : {
        "BrTagRule" : {}, 
        "DwOccurrenceRule" : {}
    }
}
```

to:

```json
{
    "rules" : {
        "no-br" : {}, 
        "enforce-require" : {}
    }
}
```

We aim for more self-descriptive rules and to move torwards a naming convention similar to ESlint's. In case you're interested, the old-to-new mapping follows:

| Old                     | New                  |
| ----------------------- |:---------------------|
| BrTagRule               | no-br                |
| DwOccurrenceRule        | no-import-package    |
| GitConflictRule         | no-git-conflict      |
| ImportPackageRule       | enforce-require      |
| IsprintTagRule          | enforce-isprint      |
| LogicInTemplateRule     | no-isscript          |
| SpaceAtEndOfLineRule    | no-trailing-spaces   |
| SpacesOnlyLineRule      | no-space-only-lines  |
| StyleAttributeRule      | no-inline-style      |
| TabRule                 | no-tabs              |

This section will destroy itself in the future releases :P

## Installation

Simply run in your project's root directory:

```sh
$ npm install isml-linter --save-dev
```

and then, from you project root directory, run:

```sh
$ ./node_modules/.bin/isml-linter
```

As a suggestion, add this command to you package.json file as a script with a custom name, so that it may be easier to remember how to run Isml Linter.


#### Configuration Notes

- Add the 'isml-linter/' directory to your .gitignore file;
- When you run Isml Linter for the first time, an .ismllinter.json file will be created in your project root directory. All rules will be listed there (enabled by default) so you can clearly see what this linter can do for you. To disable a rule, simply remove it from the .ismllinter.json file and run Isml Linter again;

#### Configuration Options

Currently, the following configurations can be set in the .ismllinter.json file:

| Config            | Description                              |
| ----------------- |:-----------------------------------------|
| rootDir           | The root directory under which the linter will run. Defaults to the directory where the package.json file is |
| ignoreUnparseable | Does not raise an error if an unparseable file is found. Default: false |
| ignore            | If a file path contains (as a substring) any string defined here, that file will be ignored by the linter |
| parseMode         | Accepts two possible values: 'tree' and 'lineByLine'. Check below when each mode is recommended. Default: 'tree' |
| rules             | Defines which rules to check. See available rules below |

**Note:** If you explicitly set "ignoreUnparseable" config to true, unparseable files may contain errors that will not be detected by Isml Linter.

Example configuration:

```json
{
    "rootDir": "./cartridges",
    "ignore": [
        "this_directory_is_to_be_ignored"
        "Email.isml"
    ],
    "rules" : {
        "no-br" : {}, 
        "enforce-require" : {}
    }
}
```

Note that according to the above configurations, the following files would be ignored by Isml Linter:

- registerEmail.isml
- some/path/welcomeEmail.isml
- this_directory_is_to_be_ignored/producttile.isml
- some/path/this_directory_is_to_be_ignored/confirmationpage.isml

## Parse Modes

### Tree

This is the default, and most powerful mode. It analyses the template and tries to build an "ISML-DOM" tree to then apply the enabled rules. It is required that the template is parseable.

For example, if a template contains a snippet like the following, IT IS NOT considered a parseable template:

```html
<isif condition="${aCondtion}">
    <div class="info">
</isif>
        Some content
<isif condition="${aCondtion}">
    </div>
</isif>
```

since the linter is not able to make an associatio between the opening an dclosing 'div' element. This is the only known limitation for this parse mode. One possible solution to turn such templates into parseable is to replace that snipet by:

```html
<isif condition="${aCondtion}">
    <div class="info">
        <isinclude template="myTemplate" />
    </div>
<iselse/>
    <isinclude template="myTemplate" />
</isif>
```

There are other possible, potentially more "best-practice" approaches, but it goes beyond the scope of this article.

And, to avoid possible doubts, here is an extra piece of information: it is allowed to have isml tags within html tags, such as:

```html
<div <isif ...> </isif> />
```

### Line by Line

This is a more robust, less powerful mode. It only has a few set of rules available and is indicated for cases where there are many, many lint errors and you want fix them gradually. It is also recommended in cases you don't want to force templates to be parseable (see previous session). This mode is ideally temporary, as it cannot take advantages of even some simple rules, such as indentation enforcement.

## Build Script

If you want to add Isml Linter to your build process, you can use the following script:

```javascript
#!/usr/bin/env node

const Builder = require('isml-linter').Builder;
const exitCode = Builder.run();

process.exit(exitCode);
```

## Available Rules

| Rule                   | Description                              |
| ---------------------- |:-----------------------------------------|
| no-br                  | Disallows &lt;br/> tags. Enable this rule if you prefer to use CSS to handle horizontal spacing |
| no-git-conflict        | Disallows unresolved Git conflicts |
| no-import-package      | Disallows importPackage() function. It is recommended by SalesForce to use require() instead |
| no-isscript            | Disallows &lt;isscript/> tag in template. Enable this rule if you prefer logic to be kept in a separate .ds/.js file |
| no-trailing-spaces     | Disallows trailing blank spaces |
| no-space-only-lines    | Disallows lines that contain only blank spaces, i.e., unnecessarily indented |
| no-inline-style        | Disallows use of "style" HTML attribute. Enable this rule if you prefer style to be fully handled via CSS |
| no-tabs                | Disallows use of tabs |
| enforce-isprint        | Enforces every ${string} to be wrapped by an &lt;isprint/> tag |
| enforce-require        | Disallows direct calls to a DigitalScript class, such as in:<br/>`var PaymentMgr = dw.order.PaymentMgr;`<br/>For this case, it is recommended to use instead:<br/>`var PaymentMgr = require('dw/order/PaymentMgr');` |

We're working on an AST (abstract syntax tree) to validate the whole document tree structure and expand the power of available rules, so keep an eye on us!
