# "no-redundant-context" Rule

Prevents use of unnecessary contexts, such as `dw.web.Resource`.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Auto-fixable;
- Official documentation: [SFCC Utility Functions](https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/content/b2c_commerce/topics/isml/b2c_function_reference.html);

## Configuration

Following are the available configurations for this rule, with default values:

```js
"no-redundant-context": {}
```

Check the [Generic Configurations for Rules][generic-config].

## Occurrence List

The following occurrences will raise an error (including single and double quotes for `require`s):
 - `dw.web.Resource`
 - `require("dw/web/Resource")`
 - `dw.web.URLUtils`
 - `require("dw/web/URLUtils")`
 - `dw.util.StringUtils`
 - `require("dw/util/StringUtils")`

## Examples

```
<div>
    ${dw.web.Resource.msg('key','properties',null)} // Wrong;
</div>
```

```
<div>
    ${Resource.msg('key','properties',null)} // Correct;
</div>
```

[generic-config]: <../generic-rule-config.md>
