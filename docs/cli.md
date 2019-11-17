# Command Line Interface Docs

You can lint a specific template or directory through the following command line format:

```sh
$ ./node_modules/.bin/isml-linter [options] [file|dir]*
```

For example:

```sh
$ ./node_modules/.bin/isml-linter --autofix template1.isml directory1/ directory2/
```

Options

| Option       | Description                                                              |
| ------------ |:-------------------------------------------------------------------------|
| --init       | Creates a standard configuration file                                    |
| --autofix    | Auto-fixes templates                                                     |
| --build      | If there is any linting error on templates, process exists with status 1 |
