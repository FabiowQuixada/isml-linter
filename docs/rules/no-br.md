# "no-br" Rule

Disallows `<br/>` tags. Use this rule if you want to handle vertical spacing via CSS.

## :exclamation: Deprecated
Consider using "[disallow-tags][disallow-tags]" rule instead.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-br": {}
```

For the above configuration, the following scenarios may happen:

```
<div>
    <br/> // Invalid;
</div>
```

[generic-config]: <../generic-rule-config.md>
[disallow-tags]: <./disallow-tags.md>
