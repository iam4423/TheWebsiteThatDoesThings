/**
 * Created by 4423 on 13/09/2016.
 */

define(["jquery", "jquery-ui", "app/console/commands", "JsML", "helper/toolbox"], function() {
    return function Shell()
    {
        var $        = require("jquery");
        var commands = require("app/console/commands");
        var JsML     = require("JsML");
        var tools    = require("helper/toolbox");
        var _arg     = 0;

        this.$window = null;
        this.$widget = null;

        tools.loadCss("lib/css/console");

        // public methods
        this.addOutput = function(output)
        {
            $(".stdout", this.$window).append(JsML.DIV({class: "console-line output"}, output).asString());
        };


        this.addCommand = function(command)
        {
            $(".stdout", this.$window).append(
                JsML.DIV({class: "console-line command"}, "root:~# " + command).asString()
            );
        };


        this.addError = function(error)
        {
            $(".stdout", this.$window).append(JsML.DIV({class: "console-line error"}, error).asString());
        };


        this.html = JsML.DIV({class: "applet app-shell"}, [
            JsML.DIV({class: "stdout"}),
            JsML.DIV({class: "stdin"}, [
                "root:~#",
                JsML.FORM({}, JsML.INPUT({class: "stdinput", type: "text"}))
            ])
        ]);
        this.closure = function($_window, $_widget)
        {
            this.$widget = $_widget;
            this.$window = $_window;
            var self     = this;

            // command history
            $(".stdin", this.$window).on("keyup", function(e) {
                if (38 === e.keyCode) { // up
                    _arg++;
                    $(".stdinput", self.$window).val(_getHistory(self.$window).html().substr(8));
                } else if (40 === e.keyCode) { // down
                    _arg--;
                    $(".stdinput", self.$window).val(_getHistory(self.$window).html().substr(8));
                }
            });

            // command submit
            $("form", this.$window).on("submit", function(e) {
                e.stopPropagation();
                _arg = 0;

                // print command to screen
                self.addCommand($(".stdinput", self.$window).val());

                // try to tun command
                var cmd = $(".stdinput", self.$window).val().split(" ")[0];
                if (cmd) {
                    if (cmd in commands) {
                        new commands[cmd](
                            self,
                            $(".stdinput", $_window).val().substring(cmd.length, $(".stdinput", $_window).val().length)
                        );
                    } else {
                        self.addError("bash: " + cmd + ": command not found");
                    }
                }

                // clear form
                $(".stdinput", self.$window).val("");
                $(".app-body", self.$window).animate({scrollTop: $(".app-body .content", self.$window).height()}, 1);

                return false;
            });

            this.$window.on("click", function() {
                $(".stdinput", self.$window).select();
            });
        }.bind(this);


        // private methods
        var _getHistory = function()
        {
            var $commands = $(".console-line.command", this.$window);

            if (_arg <= 0) {
                _arg = 1;
            } else if (_arg > $commands.length) {
                _arg = $commands.length;
            }

            var cmd = $commands[$commands.length - _arg];
            return "undefined" === typeof cmd ? $("<div>") : $(cmd);
        }.bind(this);
    }
});