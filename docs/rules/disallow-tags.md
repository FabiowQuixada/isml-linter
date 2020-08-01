# "disallow-tags" Rule

Disallows tags defined at rule level.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Recommended tags to be disallowed: "isscript", "br", "style", "[iframe][iframe]";

## Configuration

Following are the available configurations for this rule:

```js
"disallow-tags": {
    values: []
}
```

Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"disallow-tags": {
    values : ["isscript", "br", "style", "iframe"]
}
```

For the above configuration, the following scenarios may happen:

```
<br/>       // Invalid;
<isscript>  // Invalid;
</isscript> 
<div />     // Valid;
```

```
<isif condition="${aCondition}">           // Valid;
    Some hardcoded text                    // Valid;
<iselseif condition="${anotherCondition}"> // Valid;
    ${'Some expression'}                   // Valid;
</isif>
```

[iframe]: <https://www.ostraining.com/blog/webdesign/against-using-iframes/#:~:text=Reason%20%233.&text=IFrames%20are%20sometimes%20used%20to%20display%20content%20on%20web%20pages.&text=We%20recommend%20that%20you%20avoid,crawl%20and%20index%20this%20content.>
[generic-config]: <../generic-rule-config.md>
