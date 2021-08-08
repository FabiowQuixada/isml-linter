# "indent" Rule

Verifies if template indentation is consistent.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Auto-fixable;
- Elements in the same line as their parent is considered valid indentation. Please see examples below;

## Configuration

Following are the available configurations for this rule, with default values:

```js
"indent": {
    value: 4
}
```

Check the [Generic Configurations for Rules][generic-config].

## Attribute Indentation

If attributes of a tag are in a separate line, they will be indented one level relative the tag:

```
<div 
    class="class-1 class-2 class-3">
</div>
```

If an attribute has values in separate lines, they will be indented two levels relative to the tag:

```
<div 
    class="
        class-1
        class-2
        class-3
    ">
</div>
```

Please note that the below scenario is correct based on the above explanation. Multi-line values will **always** be two levels deeper than the tag, even if the attribute name itself isn't in a separate line:

```
<div class="class-1
        class-2
        class-3
    ">
</div>
```


## Examples

```js
"indent": {}
```

For the above configuration, the following scenarios may happen:

```
<div>                            // Indentation: 4;
    <isif condition="${isTrue}"> // Indentation: 8;
       ${price}                  // Invalid indentation: 11;
        <div></div>              // Indentation: 12;
    </isif>
</div>
```

```
<div>                            // Indentation: 4;
    <div>${value}</div>          // Indentations: 8 and 0, valid!
</div>
```

Please note that the above example considers the indentation of the `${value}` element as valid. If it was not like that, it would enforce each element to start in its own line, which is exactly the purpose of the "one-element-per-line" rule.

[generic-config]: <../generic-rule-config.md>
