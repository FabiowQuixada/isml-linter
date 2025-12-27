# "one-element-per-line" Rule

Enforces nodes that compose the ISML tree to not start at the same line number as their parent.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Auto-fixable;
- Autofix feature will apply [indent rule][indent-readme] even if it's not declared in the configuration file;
- Content of `<textarea>` elements will be ignored since adding a new line break and spaces will actually add "empty" characters to the text area;

## Configuration

Following are the available configurations for this rule, with default values:

```js
"one-element-per-line": {
    except: [] // Possible values: "non-tag" and "iscomment";
}
```

Check the [Generic Configurations for Rules][generic-config].


## Examples

### Example #1

```js
"one-element-per-line": {}
```

For the above configuration, the following scenarios may happen:

```
<div>${value}</div> // Invalid;
```

```
<div>
    ${value}        // Valid;
</div>
```

#### Example #2

```js
"one-element-per-line": {
    except: ["non-tag"]
}
```

For the above configuration, the following scenarios may happen:

```
<div>${value}</div> // Valid;
```

#### Example #3

```js
"one-element-per-line": {
    except: ["iscomment"]
}
```

#### Example #4

ISML expressions concatenated with other ISML expressions or hardcoded strings will be kept in the same line:

```
<span>
    ${Resource.msg('label.quantity', 'common', null)}: // Valid;
</span>
```

```
<span>
    ${customer.firstName} ${customer.lastName} // Valid;
</span>
```

For the above configuration, the following scenarios may happen:

```
<iscomment>My comment</iscomment> // Valid;
```

[generic-config]: <../generic-rule-config.md>
[indent-readme]:  <docs/rules/indent.md>
