# "no-import-package" Rule

Disallows "import" calls.

## Notes 

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-import-package": {}
```

For the above configuration, the following scenarios may happen:

```
<isscript>
    importScript("..."); // Invalid;
</isscript>
```

```
<isscript>
    importPackage("..."); // Invalid;
</isscript>
```

[generic-config]: <../generic-rule-config.md>
