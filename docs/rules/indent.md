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
    value : 4,
    standAloneClosingChars : {
        nonSelfClosingTag : "always",
        selfClosingTag    : "never",
        quote             : "never"
    }
}
```

Check the [Generic Configurations for Rules][generic-config].

<hr>


The `standAloneClosingChars` configuration attribute enforces that closing chars...

 - `/>` for self-closing tags;
 - `>` for non-self-closing tags;
 - `'`or `"` for tag attributes (closing quotes only);

... should be either in a separate line (`always`), in the same line as the tag last attribute (`never`), or keep each closing char in its current state (`any`).

It applies only for multi-line tags:

```
<input value="my-value" /> // "standAloneClosingChars" will ignore tags like this;

<input value="my-value"    // "standAloneClosingChars" will apply to tags like this;
    class="my-class"
    id="my-id" />

<input class="class-1    // "standAloneClosingChars" will NOT apply to opening quotes;
    class-2
    class-3"             // "standAloneClosingChars" will apply to closing quotes;
    />
```

Options
 - `nonSelfClosingTag` option applies only to non-self-closing tags.
 - `selfClosingTag` option applies only to self-closing tags.
 - `quote` option applies to closing quotes of tag attributes.

See the **Examples** section for more details.

## Attribute Indentation

If attributes of a tag are in a separate line, they will be indented one level relative the tag:

```
<div 
    class="class-1 class-2 class-3"
>
</div>
```

If an attribute has values in separate lines, they will be indented two levels relative to the tag:

```
<div 
    class="
        class-1
        class-2
        class-3
    "
>
</div>
```

Please note that the below scenario is correct based on the above explanation. Multi-line values will **always** be two levels deeper than the tag, even if the attribute name itself isn't in a separate line:

```
<div class="class-1
        class-2
        class-3
    "
>
</div>
```


## Examples

### Example 1

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
<div>
    <div>                            // Indentation: 4;
        <div>${value}</div>          // Indentations: 8 and 0, valid!
    </div>
</div>
```

Please note that the above example considers the indentation of the `${value}` element as valid. If it was not like that, it would enforce each element to start in its own line, which is exactly the purpose of the "one-element-per-line" rule.

<hr>

### Example 2

```js
"indent": {
    standAloneClosingChars : {
        nonSelfClosingTag : "always", // Default;
    }
}
```

```
<div id="div-id"
    class="div-class"
>                               // Valid, closing char should always be in a separate line;
    <span id="span-id"
        class="span-class">     // Invalid, closing char should always be in a separate line;
    </span>

    <span id="span-2-id"
        class="span-2-class"
    >                           // Valid, closing char should always be in a separate line;
        ${text}
    </span>
</div>
```

<hr>

### Example 3

```js
"indent": {
    standAloneClosingChars : {
        nonSelfClosingTag : "never",
    }
}
```

```
<div id="div-id"
    class="div-class"
>                               // Invalid, closing char should never be in a separate line;
    <span id="span-id"
        class="span-class">     // Valid, closing char should never be in a separate line;
    </span>

    <span id="span-2-id"
        class="span-2-class"
    >                           // Invalid, closing char should never be in a separate line;
        ${text}
    </span>
</div>
```

<hr>

### Example 4

```js
"indent": {
    standAloneClosingChars : {
        quote : "never", // Default;
    }
}
```

```
<div id="div-id"
    class="div-class
        div-class-2"       // Valid, closing quote should always be in the same line as tag's last attribute;
>                               
</div>

<div id="div-id"
    class="div-class
        div-class-2
    "                      // Invalid, closing quote should always be in the same line as tag's last attribute;
>
</div>
    
```

<hr>

### Example 5

```js
"indent": {
    standAloneClosingChars : {
        quote : "any",
    }
}
```

```
<div id="div-id"
    class="div-class
        div-class-2"       // Valid, closing quote can be in a separate line or not;
>                               
</div>

<div id="div-id"
    class="div-class
        div-class-2
    "                      // Valid, closing quote can be in a separate line or not;
>
</div>
    
```

[generic-config]: <../generic-rule-config.md>
