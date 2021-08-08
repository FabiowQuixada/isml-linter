# "no-embedded-isml" Rule

Disallows ISML tags within HTML tags.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- `<isprint />` is the only ISML tag that is considered as valid within an HTML element;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-embedded-isml": {}
```

For the above configuration, the following scenarios may happen:

```
    <div <isif ... ></isif> > // Invalid;
    </div>
```

```
    <div ${isTrue ? price : 'Free!'} // Valid;
    </div>
```

```
    <div <isprint ... /> > // Valid! "isprint" is an exception;
    </div>
```

[generic-config]: <../generic-rule-config.md>
