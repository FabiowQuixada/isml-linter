# "no-trailing-spaces" Rule

Disallow trailing spaces.

## Notes

- This rule does **not** dependent on abstract tree build;
- Auto-fixable;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-trailing-spaces": {}
```

For the above configuration, the following scenarios may happen. A dot "." notation is used to illustrate blank (heading and trailing) spaces.

```
....<div>      // Valid;
........<br/>. // Invalid;
....</div>...  // Invalid;
```

[generic-config]: <../generic-rule-config.md>
