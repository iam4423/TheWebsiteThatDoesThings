/**
 * Created by 4423 on 12/09/2016.
 */
define(["jquery", "helper/cwarn", "app/appWindow", "app/console/Shell"], function($) {
    $(function() {
        require("helper/cwarn");
        var Shell     = require("app/console/Shell");
        var AppWindow = require("app/appWindow");

        var s  = new Shell();
        var w  = new AppWindow({
            noClose: true,
            title: "Console",
            html: s.html,
            onOpen: s.closure,
            width: 800,
            height: 500
        });
    });
});