# "indent" Rule

Verifies if template indentation is consistent.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Elements in the same line as their parent is considered valid indentation. Please see examples below;

## Configuration

Following are the available configurations for this rule, with default values:

```js
"indent": {
    value: 4
}
```
:exclamation: **Deprecated:** Indentation size should be set as a root property in the config file, not at rule level, since other rules rely on it.

Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"indent": {}
```

For the above configuration, the following scenarios may happen:

```
<div>                            // Indentation: 4;
    <isif condition="${isTrue}"> // Indentation: 8;
        ${price}                 // Invalid indentation: 11;
        <div></div>              // Indentation: 12;
    </isif>
</div>
```

```
<div>                            // Indentation: 4;
    <div>${value}</div>          // Indentations: 8 and 0, valid!
</div>
```

Please note that the above example considers the indentation of the "${value}" element as valid. If it was not like that, it would enforce each element to start in its own line, which is exactly the purpose of the "one-element-per-line" rule.

[generic-config]: <../generic-rule-config.md>
