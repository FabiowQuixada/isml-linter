# "no-trailing-spaces" Rule

Disallow trailning spaces.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule.

## Examples

```js
"no-trailing-spaces": {}
```

For the above configuration, the following scenarios may happen. A dot "." notation is used to ilustrate blank (heading and trailing) spaces.

```
....<div>      // Valid;
........<br/>. // Invalid;
....</div>...  // Invalid;
```
