# "disallow-tags" Rule

Disallows tags defined at rule level.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Recommended tags to be disallowed: "isscript", "br", "style";

## Configuration

Following are the available configurations for this rule:

```js
"disallow-tags": {
    values: []
}
```

Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"disallow-tags": {
    values : ["isscript", "br", "style"]
}
```

For the above configuration, the following scenarios may happen:

```
<br/>       // Invalid;
<isscript>  // Invalid;
</isscript> 
<div />     // Valid;
```

```
<isif condition="${aCondition}">           // Valid;
    Some hardcoded text                    // Valid;
<iselseif condition="${anotherCondition}"> // Valid;
    ${'Some expression'}                   // Valid;
</isif>
```

[generic-config]: <../generic-rule-config.md>
