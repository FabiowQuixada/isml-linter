# "enforce-security" Rule

Enforces security measures.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

Following are the available configurations for this rule, with default values:

```js
"enforce-security": {
    "prevent-reverse-tabnabbing": true
}
```

Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"enforce-security": {}
```

For the above configuration, the following scenarios may happen:

```
<a href="http://example.com" target="_blank"> // Invalid: "a" tags should have attribute
    Link                                      // *rel="noopener"* when *target="_blank"* is present;
</a>
```

## References
- Reverse tabnabbing: https://owasp.org/www-community/attacks/Reverse_Tabnabbing

[generic-config]: <../generic-rule-config.md>
