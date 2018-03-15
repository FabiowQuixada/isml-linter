### Before you start 
Make sure that, before running any command, you set the "rootTemplate" property in the config.json file. This is the directory where the linter will look for ISML files to run over. There is a default example there, so just follow the same pattern :)


### Using the Isml Linter
Run the app through the "npm start" command, it will generate some files under the output/ directory. Those files will give you the whole picture of how much the ISML files in your project follow the defined rules.


### Adding a Rule
To add a new rule, simply add a correponding js file to the rules/ directory, following the same conventions of other rules. The new rule will apply automatically, no extra configuration needed. Make sure the file name ends in "(...)Rule.js".


### Testing a Rule
To test a rule, place a (name of the rule)Spec.js file under spec/rules/ directory. It will know what rule to refer to based on the file name, so make sure there are no typos.


### Author
Fabio Quixadá <fabio.quixada@osf-commerce.com>
