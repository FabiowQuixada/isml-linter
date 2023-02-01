# "no-inline-style" Rule

Disallows in-line stylings.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

Following are the available configurations for this rule, with default values:

```js
"no-inline-style": {
    allowWhenDynamic: true
}
```

Check the [Generic Configurations for Rules][generic-config].

## Examples

### Example 1

```js
"no-inline-style": {}
```

For the above configuration, the following scenarios may happen:

```
<div style="background-color:powderblue;"> // Invalid 
    $10.00
</div>

<div style="background-image: url(${swatch.images.swatch[0].url}"> // Valid, since there is a dynamic ISML expression

</div>
```

### Example 2

```js
"no-inline-style": {
    allowWhenDynamic: false
}
```

For the above configuration, the following scenarios may happen:

```
<div style="background-color:powderblue;"> // Invalid 
    $10.00
</div>

<div style="background-image: url(${swatch.images.swatch[0].url}"> // Invalid 

</div>
```

[generic-config]: <../generic-rule-config.md>
