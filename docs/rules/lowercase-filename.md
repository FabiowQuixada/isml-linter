# "lowercase-filename" Rule

Disallows template names to have uppercase characters.

## Notes

- This rule does **not** dependent on abstract tree build;
- Reference: [SalesForce's server code style guide][code-style];


## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"lowercase-filename": {}
```

For the above configuration, the following scenarios may happen:

- components/product/productPrice.isml // Invalid file name;
- components/product/productprice.isml // Valid file name;

[generic-config]: <../generic-rule-config.md>
[code-style]:     <https://github.com/SalesforceCommerceCloud/styleguide/blob/master/codestyle-server.md#23-file-names>
