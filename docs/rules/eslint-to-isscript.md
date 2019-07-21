# "eslint-to-isscript" Rule

Applies ESLint rules to &lt;isscript> tag content

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);<br/>
- Auto-fixable;

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
