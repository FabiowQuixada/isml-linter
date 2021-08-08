# Enabling Cache

**<span style="color:red">Important!</span>** Release 5.30.0 introduced a performance improvement that makes ISML Linter run 40x faster, which made the "enableCache" option useless and therefore deprecated.

To enable cache, simply add the "enableCache" attribute to your ISML Linter config file and set it to **true**:
```js
{ 
    "enableCache": true,
    "rules" : {}
}
```

This is an experimental feature that optimizes linting process by caching template rule occurrences. Cache is triggered based on template's "last modified" system information.

Every time ISML Linter runs, it caches each template rule occurrences. Therefore if a template has not been modified since last lint run, it will not be linted again, as cached information will be used instead.

Although cache will be used most of the time, please keep in mind that there are some scenarios that will force templates to be re-linted. They are:

1. When a template "last modified" information changes. Even if you don't modify the template yourself, Git (potentially) applies changes to a number of templates every time you switch branches. This of course depends on how much the source and the target branches differ in terms of number of changed templates. So if you checkout to a very old branch or commit, it is very likely that many templates will have changed, therefore reducing the impact of the optimization feature in the next ISML Linter run;

2. When you make any change to the isml-linter configuration file, all templates will necessarily be re-linted. Please note that when you enable cache by adding the "enableCache" attribute to the configuration file, you will fall in this scenario, so cache will not be used for the next ISML Linter run;

Enforced re-lint will happen only the first time after those scenarios occur, since the results will be cached for the next run.
