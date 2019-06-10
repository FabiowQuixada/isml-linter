# "no-hardcode" Rule

Disallows hardcoded strings in the ISML DOM. Hardcoded strings within ISML expressions are not considered invalid (configuration to be implemented).

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-hardcode": {}
```

For the above configuration, the following scenarios may happen:

```
<div class="price"> 
    $10.00               // Hardcoded string, invalid;
    <div class="offer_label">
        ${'Only today!'} // Valid;
    </div>
</div>
```

[generic-config]: <../generic-rule-config.md>
