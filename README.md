### Before you start 
Make sure that, before running any command, you set the "rootTemplateDir" property in the config.json file. This is the directory where the linter will look for ISML files to run over. There is a default example there, so just follow the same pattern :)

And of course, don't forget to run "npm install".


### Using the Isml Linter
Run the app through the "npm start" command, it will generate some files under the output/ directory. Those files will give you the whole picture of how much the ISML files in your project follow the defined rules.

Also, you can continuously watch for ISML template changes through a gulp task. Simply run "gulp watch_isml" from IsmlLinter project root directory and any changes you do in files under the directory defined in the config.json file will generate an updated output.


### Adding a Rule
To add a new rule, simply add a correponding js file to the rules/ directory, following the same conventions of other rules. The new rule will apply automatically, no extra configuration needed. Make sure the file name ends in "(...)Rule.js".


### Testing a Rule
To test a rule, place a (name of the rule)Spec.js file under spec/rules/ directory. It will know what rule to refer to based on the file name, so make sure there are no typos.


### Author
Fabio Quixadá <fabio.quixada@osf-commerce.com>
