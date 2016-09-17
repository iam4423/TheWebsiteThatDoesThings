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
        tools.loadCss("lib/css/console");

        // public methods
        this.html = JsML.DIV({class: "applet app-shell"}, [
            JsML.DIV({class: "stdout"}),
            JsML.DIV({class: "stdin"}, [
                "root:~#",
                JsML.FORM({}, JsML.INPUT({class: "stdinput", type: "text"}))
            ])
        ]);
        this.closure = function($_window, $_widget)
        {
            $(".stdin", $_window).on("keyup", function(e) {
                if (38 === e.keyCode) { // up
                    _arg++;
                    $(".stdinput", $_window).val(_getHistory($_window).html().substr(8));
                } else if (40 === e.keyCode) { // down
                    _arg--;
                    $(".stdinput", $_window).val(_getHistory($_window).html().substr(8));
                }
            });
            $("form", $_window).on("submit", function(e) {
                e.stopPropagation();
                _arg = 0;

                $(".stdout").append(
                    JsML.DIV({class: "console-line command"}, "root:~# " + $(".stdinput", $_window).val()).asString()
                );
                $(".stdinput", $_window).val("");
                $(".app-body", $_window).animate({scrollTop: $(".app-body .content", $_window).height()}, 1);

                return false;
            });

            $_window.on("click", function() {
                $(".stdinput", $_window).select();
            });
        };


        // private methods
        var _getHistory = function($_window)
        {
            var $commands = $(".console-line.command", $_window);

            if (_arg <= 0) {
                _arg = 1;
            } else if (_arg > $commands.length) {
                _arg = $commands.length;
            }

            var cmd = $commands[$commands.length - _arg];
            console.log(_arg, cmd);
            return "undefined" === typeof cmd ? $("<div>") : $(cmd);
        };
    }
});