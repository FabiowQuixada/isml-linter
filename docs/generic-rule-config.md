# Generic Configurations for Rules

The configurations described here apply to all rules, and can be used as follows:

```js
"rules": {
    "indent": {
        "level"  : "error" 
        "ignore" : [
            "pt_",
            "Email.isml"
        ]
    }
}

```

| Config            | Description                              |
| ----------------- |:-----------------------------------------|
| ignore            | If a template path contains (as a substring) any string defined here, that template will be ignored by the linter for the specific rule, i.e., other rules will still apply for these templates. |
| level             | The level of rule break occurrence. Can be "error", "warning" or "info". Only "error"-level occurrences will produce non-zero outputs during build. Default: **error** |
