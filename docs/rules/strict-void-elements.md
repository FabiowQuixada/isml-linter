# "strict-void-elements" Rule

Disallows void elements closing tags. More info in [Mozilla docs][mozilla-void-elements-url]. Please check the "Self-closing tags" section as well.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

<hr>

## Examples

### Example 1

```js
"strict-void-elements": {}
```

For the above configuration, the following scenarios may happen (it applies to all tags listed on [Mozilla docs][mozilla-void-elements-url]):

```
<input></input> // Invalid;
<input>         // Valid [generic-config][generic-config]
<input/>        // Valid;
```

[generic-config]: <../generic-rule-config.md>
[mozilla-void-elements-url]: <https://developer.mozilla.org/en-US/docs/Glossary/Void_element>
