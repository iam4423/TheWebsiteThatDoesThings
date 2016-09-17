/**
 * Created by 4423 on 17/09/2016.
 */

define(["JsML", "app/console/ArgParser"], function() {
    var ArgParser = require("app/console/ArgParser");
    var JsML      = require("JsML");

    var Command_Help = function(Shell, argString)
    {
        var helpString = "this is help string";

        try {
            var args = new ArgParser();
            args.expectIndexCount(0, 0);
            args.failOnUnexpectedArg(true);
            args.parse(argString);
        } catch(e) {
            console.log(e);
            Shell.addError(e.message);
        }

        Shell.addOutput(helpString);
    };

    var CoreCommands = {
        help: Command_Help
    };

    return CoreCommands;
});