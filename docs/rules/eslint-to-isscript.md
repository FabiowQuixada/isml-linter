# "eslint-to-isscript" Rule

Applies ESLint rules to `<isscript>` tag content.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);<br/>
- Auto-fixable;

:eight_spoked_asterisk: **Attention:** Please note that simply applying your current set of ESLint rules to ISML templates might produce undesired side-effects. It is recommended that you carefully select which rules will apply to the templates.

For example, each `<isscript>` tag is treated as an independent scope, even if they are in the same template, so `let` and `const` rules might behave in an unexpected way.

If you need to have a different ESlint configuration for templates, you can set the "eslintConfig" property in the _.ismllinter.config.js_ file.

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

.ismllinter.config.js:
```js
"eslint-to-isscript": {}
```

.eslintrc.json:
```js
{
    "rules": {
        "indent": ["error"]
    }
}

```

For the above configuration, the following scenarios may happen:

```
<isscript>
    var cid = Category.ID;  // Valid;
     var pid = Product.ID;  // Invalid;
</isscript>
```

[generic-config]: <../generic-rule-config.md>
