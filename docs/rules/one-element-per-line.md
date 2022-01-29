# "one-element-per-line" Rule

Enforces nodes that compose the ISML tree to not start at the same line number as their parent.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Auto-fixable;
- Autofix feature will apply [indent rule][indent-readme] even if it's not declared in the configuration file;

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

For the above configuration, the following scenarios may happen:

```
<iscomment>My comment</iscomment> // Valid;
```

[generic-config]: <../generic-rule-config.md>
[indent-readme]:  <docs/rules/indent.md>