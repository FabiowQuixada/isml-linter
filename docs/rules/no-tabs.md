# "no-tabs" Rule

Disallows tab character.

## Notes

- This rule does **not** dependent on abstract tree build;
- Auto-fixable;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-tabs": {}
```

For the above configuration, the following scenarios may happen. A dot "." notation is used to illustrate blank (heading and trailing) spaces, and "____" is used to represent a tab character.

```
....<div>      // Valid;
....____<br/>  // Invalid;
....</div>____ // Invalid;
```

[generic-config]: <../generic-rule-config.md>
