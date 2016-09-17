/**
 * Created by 4423 on 17/09/2016.
 */

define([], function() {
    function ExpectedArg(key, alias, isFlag, required, description)
    {
        this.key         = key;
        this.isFlag      = isFlag || false;
        this.alias       = alias  || [];
        this.required    = required || false;
        this.description = description || "";
    }


    function ArgParser()
    {
        // const
        var SPLIT_REGEX = /[^\s"']+|"([^"]*?)"|'([^']*?)'/g;


        // public vars
        this.rawData = "";
        this.argv    = [];
        this.indexed = [];
        this.flags   = [];
        this.named   = {};


        // private vars
        var _expected = {
            indexed: [-1, -1],
            named: []
        };
        var _failOnUnexpected = false;


        // public methods
        this.expectIndexCount = function(min, max)
        {
            _expected.indexed[0] = min;
            _expected.indexed[1] = max;
        };


        this.expectNamed = function(key, alias, hasVal, required)
        {
            this.named.push(new ExpectedArg(key, alias, hasVal, required));
        };


        this.failOnUnexpectedArg = function(fail)
        {
            _failOnUnexpected = fail ? fail : false;
        };


        this.parse = function(argString)
        {
            this.rawData = argString;
            this.argv    = argString.match(SPLIT_REGEX) || [];

            // remove quotes
            for (var i = 0; i < this.argv.length; i++) {
                this.argv[i] = this.argv[i].replace(/["']/g, "");
            }

            _assignArgs();
            _checkForExpectedArgs();
        };


        this.generateHelpString = function()
        {
          // TODO: implement this method
        };


        // private methods
        var _assignArgs = function()
        {
            var args = this.argv;
            // split chained flags
            for (var i = 0; i <  args.length; i++) {
                if (0 === args[i].indexOf("-") && 0 !== args[i].indexOf("--") && 2 < args[i].length) {
                    var extras = args[i].split("");

                    extras.splice(0,0, i, 1);
                    args.splice.apply(args, extras);
                }
            }

            // find named/flags
            for (var i = 0; i < args.length; i++) {
                if (0 === args[i].indexOf("--")) {
                    var key = args[i].substr(2);
                } else if (0 == args[i].indexOf("-")) {
                    var key = args[i].substr(1);
                } else {
                    this.indexed.push(args[i]);
                    continue;
                }

                for (var j in _expected.named) {
                    if ((key === _expected.named[j].key || key in _expected.named[j].alias)) {
                        if (!_expected.named[j].isFlag) {
                            if (0 === args[i + 1].indexOf("-")) {
                                throw new Error("arg " + key + " requires a value");
                            }
                            this.named[_expected.named[j].key] = args[i + 1];
                            i++;
                        } else {
                            this.flags.push(_expected.named[j].key);
                        }

                    } else {
                        this.flags.push(key);
                    }
                }
            }

            // find indexed
            this.indexed = args;
        }.bind(this);


        var _checkForExpectedArgs = function()
        {
            // check indexed
            if (_failOnUnexpected
                && ((-1 !== _expected.indexed[0] && this.indexed.length < _expected.indexed[0])
                    || (-1 !== _expected.indexed[1] && this.indexed.length > _expected.indexed[1]))
            ) {
                throw new Error("Invalid arg count");
            }

            // check for required
            for (var i in _expected.named) {
                var arg = _expected.named[i];
                if (!arg.required) {
                    continue;
                }

                var toCheck = arg.isFlag ? this.flags : this.named;
                var exists = false;

                if (arg.key in toCheck) {
                    exists = true;
                }

                if (!exists) {
                    throw new Error("Required arg '" + arg.key + " (" + JSON.stringify(arg.alias) + ")' not found");
                }
            }

            // check for unexpected flags
            if (!_failOnUnexpected) {
                return;
            }
            for (var key in this.flags) {
                var expected = false;
                for (var i in _expected.named) {
                    if (key === _expected.named[i].key || key in _expected.named[i].alias) {
                        expected = true;
                    }
                }
                if (!expected) {
                    throw new Error("found unexpected flag " + key);
                }
            }

        }.bind(this);
    }

    return ArgParser;
});