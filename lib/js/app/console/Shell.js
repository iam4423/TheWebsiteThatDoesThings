/**
 * Created by 4423 on 13/09/2016.
 */

define(["jquery", "jquery-ui", "app/console/commands", "JsML", "helper/toolbox"], function() {
    return function Shell()
    {
        var $        = require("jquery");
        var commands = require("app/console/commands");
        var JsML     = require("JsML");
        var tools = require("helper/toolbox");
        tools.loadCss("lib/css/console");

        this.html = JsML.DIV({class: "applet app-shell"}, [
            JsML.DIV({class: "stdout"}),
            JsML.DIV({class: "stdin"}, [
                "root:~#",
                JsML.FORM({}, JsML.INPUT({class: "stdinput", type: "text"}))
            ])
        ]);
        this.closure = function($_window, $_widget)
        {
            $("form", $_window).on("submit", function(e) {
                e.stopPropagation();

                $(".stdout").append(
                    JsML.DIV({class: "console-line"}, "root:~# " + $(".stdinput", $_window).val()).asString()
                );
                $(".stdinput", $_window).val("");
                $(".app-body", $_window).animate({scrollTop: $(".app-body .content", $_window).height()}, 1);

                return false;
            });

            $_window.on("click", function() {
                $(".stdinput", $_window).select();
            });
        };
    }
});