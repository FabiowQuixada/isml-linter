# Isml Linter
Isml Linter is a tool for examing if your project's templates follow a specified set of rules defined by your dev team. The available rules can be roughly grouped into: 

 - Styles that are defined by your team;
 - Syntactic errors related to &lt;is* > tags;
 - Coding conventions recommended by SalesForce;
 - Git conflicts that may accidentally be left unresolved;

The linter is still on an early stage, so that some of the groups above may have room for improvement. Please feel free to make suggestions and help make this linter better. :) The set of currently available rules can be found below.

:exclamation: When run, Isml Linter will generate two files under "isml-linter/output/" in your project's root directory. One of these files is the main output file, which lists all the enabled broken rules (file by file, line by line), and the other is a compiled version of it, so you have a good overview of the current status of your templates.

## Updating to Version 3+

Please note that the following update is automated if you're upgrading from versions older than 3.0.0. You won't need to do anything, not even run a single command. Of course, you'll still need to add the generated changes to your repository.

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

- :exclamation: Add the 'isml-linter/' directory to your .gitignore file;
- When you run Isml Linter for the first time, an .ismllinter.json file will be created in your project root directory. All rules will be listed there (enabled by default) so you can clearly see what this linter can do for you. To disable a rule, simply remove it from the .ismllinter.json file and run Isml Linter again;

#### Configuration Options

Currently, the following configurations can be set in the .ismllinter.json file:

| Config            | Description                              |
| ----------------- |:-----------------------------------------|
| rootDir           | The root directory under which the linter will run. Defaults to the directory where the package.json file is |
| :boom: ignoreUnparseable | Does not raise an error if an unparseable file is found. Default: false |
| ignore            | If a file path contains (as a substring) any string defined here, that file will be ignored by the linter |
| :boom: disableTreeParse | Enables only rules that do not depend on  building an ISML tree. Check below when this might be useful. Default: 'false' |
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

### Tree (disableTreeParse : false)

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

since the linter is not able to make an association between the opening and the corresponding closing &lt;div> elements. This is the only known limitation for this parse mode. One possible solution to turn such templates into parseable is to replace that snipet by:

```html
<isif condition="${aCondition}">
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

### Line by Line (disableTreeParse : true)

This is a more robust, less powerful mode. It only has a few set of rules available and is indicated for cases where there are many, many lint errors and you want fix them gradually. It is also recommended in cases you don't want to force templates to be parseable (see previous session). This mode is ideally temporary, as it cannot take advantages of even some simple rules, such as indentation checking.

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
| [no-br][no-br-readme]  | Disallows &lt;br/> tags. Enable this rule if you prefer to use CSS to handle vertical spacing |
| [no-git-conflict][no-git-conflict-readme]        | Disallows unresolved Git conflicts |
| [no-import-package][no-import-package-readme]      | Disallows `importPackage()` function. It is recommended by SalesForce to use require() instead |
| [no-isscript][no-isscript-readme]            | Disallows &lt;isscript/> tag in template. Enable this rule if you prefer logic to be kept in a separate .ds/.js file |
| [no-trailing-spaces][no-isscript-readme]     | Disallows trailing blank spaces |
| [no-space-only-lines][no-space-only-lines-readme]    | Disallows lines that contain only blank spaces, i.e., unnecessarily indented |
| [no-inline-style][no-inline-style-readme]        | Disallows use of "style" HTML attribute. Enable this rule if you prefer style to be fully handled via CSS |
| [no-tabs][no-tabs-readme]                | Disallows use of tabs |
| [enforce-isprint][enforce-isprint-readme]        | Enforces every ${string} to be wrapped by an &lt;isprint/> tag |
| [enforce-require][enforce-require-readme]        | Disallows direct calls to a DigitalScript class, such as in:<br/>`var PaymentMgr = dw.order.PaymentMgr;`<br/>For this case, it is recommended to use instead:<br/>`var PaymentMgr = require('dw/order/PaymentMgr');` |
| [max-lines][max-lines-readme]              | Sets the max number of lines a template can have |
| [complexity][complexity-readme]             | Sets max cyclomatic complexity for a template |
| :small_orange_diamond: [no-hardcode][no-hardcode-readme]            | Disallows hardcoded strings outside ISML expressions |
| :small_orange_diamond: [indent][indent-readme]                 | Sets indentation size |
| :small_orange_diamond: [no-require-in-loop][no-require-in-loop-readme]     | No `require()` calls from within a loop in the template |
| :small_orange_diamond: [no-embedded-isml][no-embedded-isml-readme]       | Disallows embedded isml tags, such as in <div &lt;isif /> />, except for &lt;isprint /> |
| :small_orange_diamond: [max-depth][max-depth-readme]               | Sets the maximum of nested elements in a template |
| :small_orange_diamond: [one-element-per-line][one-element-per-line-readme]   | One element per line |

[no-br-readme]:                  <docs/rules/no-br.md>
[no-git-conflict-readme]:        <docs/rules/no-git-conflict.md>
[no-import-package-readme]:      <docs/rules/no-import-package.md>
[no-isscript-readme]:            <docs/rules/no-isscript.md>
[no-trailing-spaces-readme]:     <docs/rules/no-trailing-spaces.md>
[no-space-only-lines-readme]:    <docs/rules/no-space-only-lines.md>
[no-inline-style-readme]:        <docs/rules/no-inline-style.md>
[no-tabs-readme]:                <docs/rules/no-tabs.md>
[enforce-isprint-readme]:        <docs/rules/enforce-isprint.md>
[enforce-require-readme]:        <docs/rules/enforce-require.md>
[max-lines-readme]:              <docs/rules/max-lines.md>
[complexity-readme]:             <docs/rules/complexity.md>
[no-hardcode-readme]:            <docs/rules/no-hardcode.md>
[indent-readme]:                 <docs/rules/indent.md>
[no-require-in-loop-readme]:     <docs/rules/no-require-in-loop.md>
[no-embedded-isml-readme]:       <docs/rules/no-embedded-isml.md>
[max-depth-readme]:              <docs/rules/max-depth.md>
[one-element-per-line-readme]:   <docs/rules/one-element-per-line.md>

## Iconography
:exclamation: Deprecated feature<br/>
:boom: New feature<br/>
:small_orange_diamond: Rules that require "disableTreeParse" configuration not to be true.
