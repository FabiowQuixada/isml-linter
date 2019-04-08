# "no-git-conflict" Rule

Detects unresolved Git conflicts.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-git-conflict": {}
```

For the above configuration, the following scenarios may happen:

```
 // Invalid;
 <<<<<<< HEAD
 <div class="class-a">
 =======
 <div class="class-b">
 >>>>>>> branch-a
 </div>
```

[generic-config]: <../generic-rule-config.md>
