# "max-depth" Rule

Defines a max depth a Isml tree node can have. This is a good rule to keep your templates' complexity low.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

Following are the available configurations for this rule, with default values:

```js
"max-depth": {
    value: 10
}
```

## Examples

```js
"max-depth": {
    value: 2
}
```

For the above configuration, the following scenarios may happen:

```
<div> // Depth: 1;
    <isif condition="${isTrue}"> // Depth: 2;
        ${price} // Invalid depth: 3 ( >2 );
    <iselse>
        Free!    // Invalid depth: 3 ( >2 );
    </isif>
</div>
```

```
<div> // Depth: 1;
    ${isTrue ? price : 'Free!'} // Depth: 2;
</div>
```
