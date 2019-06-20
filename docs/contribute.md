# Contribute

In order to add a new rule, only one file is necessary apart from the specs. No extra configuration needed, it just needs to be under a specific directory. That's it. :)

Although we will go through each step to create a new rule, you might want to see a real world example, so please check the code of the following rules:

- [one-element-per-line][one-element-per-line-rule] (for the simplest case scenario);
- [indent][indent-rule] (for a more complex rule);

Before checking any rules, Isml Linter builds an Isml DOM and then traverses it, node by node. Each time a tree node is visited, the `isBroken(node)` is called for each rule, and that's where the main logic should be.

## Creating a New Rule 

Once you fork the project, create a new file, say, "my-new-rule.js", under ./src/app/rules/tree/ with the following content:

```js
const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'the message to be displayed to the user if the rule is broken';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

// The rule logic goes here;
Rule.isBroken = function(node) {
    return ...;
};

module.exports = Rule;
```

The above code example is the simplest case scenario, and you need to change only two specific places: the value of the `description` variable and the `isBroken()` method body. The `isBroken()` method receives as parameter an isml dom node, which has many useful methods that you can find [here][isml-node].

Note that the name of the rule is inferred from its file name. Description is what will be displayed to the final user if the rule is broken.

Here is an example of a rule which doesn't allow &lt;isscript> tags in the template:

```js
Rule.isBroken = function(node) {
    return node.isOfType('isscript');
};
```

## Rule Specs

To create specs, you will need to create the following files (adapting them with your own rule name, of course):

- /spec/app/rules/my-new-rule-Spec.js
- /spec/templates/default/rules/tree/my_new_rule/template_0.isml
- /spec/templates/default/rules/tree/my_new_rule/template_1.isml

Naming is very important here for both the spec file and templates. Notice that the `my_new_rule` directory snake-case convention.

You can easily copy and adapt from other rules specs. We recommend you to take [one-element-per-line-Spec][one-element-per-line-spec] as base for your specs.

## Conclusion

Please keep in mind that new rules need to be as much generic as possible so that more people can use it.

That's it! Now you're ready to create a PR! Once you have forked the repository and applied your changes, please create a PR so that, after analyzed and approved, it can be available for the whole community! :D

[indent-rule]: <../src/app/rules/tree/indent.js>
[one-element-per-line-rule]: <../src/app/rules/tree/one-element-per-line.js>
[isml-node]: <../src/app/isml_tree/IsmlNode.js>
[one-element-per-line-spec]: <../spec/app/rules/one-element-per-line-Spec.js>
