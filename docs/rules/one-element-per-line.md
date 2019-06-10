# "one-element-per-line" Rule

Enforces nodes that compose the ISML tree to not start at the same line number as their parent.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Auto-fixable;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].


## Examples

```js
"one-element-per-line": {}
```

For the above configuration, the following scenarios may happen:

```
<div>${value}</div> // Invalid;
```

```
<div>
    ${value}        // Valid;
</div>
```

[generic-config]: <../generic-rule-config.md>
