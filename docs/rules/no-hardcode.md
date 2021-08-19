# "no-hardcode" Rule

Disallows hardcoded strings in the ISML DOM. Hardcoded strings within ISML expressions are not considered invalid (configuration to be implemented).

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Check what [HTML entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity) are;

## Configuration

Following are the available configurations for this rule, with default values:

```js
"no-hardcode": {
    except            : [],
    allowHtmlEntities : true
}
```

A value that you might want set for the `except` attribute is `['(', ')', '[', ']', '"', '\'', '/', '+', '-', '*', ':', ',', '.']`.

Check the [Generic Configurations for Rules][generic-config].

## Examples

### Example 1

```js
"no-hardcode": {}
```

```
<div class="price"> 
    $10.00               // Hardcoded string, invalid;
    <div class="offer_label">
        ${'Only today!'} // Valid, strings within expressions are not validated;
    </div>
</div>
```

---

### Example 2

```js
"no-hardcode": {
    except            : [',', ':'],
    allowHtmlEntities : false
}
```

```
<div class="price"> 
    <label />: <input />   // Hardcoded ":" string, but valid due to the "except" configuration attribute;
    &#8212;                // Hardcoded HTML entity, but valid due to the "allowHtmlEntities" configuration attribute;
</div>
```

[generic-config]: <../generic-rule-config.md>
