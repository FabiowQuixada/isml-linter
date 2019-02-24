# "no-embedded-isml" Rule

Disallows ISML tags within HTML tags.

## Notes
- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- &lt;isprint /> is the only ISML tag that is considered as valid within an HTML element;

## Configuration

No configuration is available for this rule.

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
