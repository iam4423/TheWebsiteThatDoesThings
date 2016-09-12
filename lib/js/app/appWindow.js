/**
 * Created by 4423 on 12/09/2016.
 */

define(["helper/toolbox", "JsML"], function(toolbox, JsML) {
    toolbox.loadCss("lib/css/appWindow");

    function AppWindow(config)
    {
        if ("undefined" === typeof config) {
            config = {};
        }

        // assign config
        this.top    = config.top || 50;
        this.left   = config.left || 50;
        this.width  = config.width || 300;
        this.height = config.height || 150;
        this.html   = config.html || "";
        this.title  = config.title || "New Window";


        // private vars
        var _self = null;


        // private methods
        var _inlineStyle = function()
        {
            return "top:" + this.top + "px;"
                + "left:" + this.left + "px;"
                + "width:" + this.width + "px;"
                + "height:" + this.height + "px;";


        }.bind(this);


        /* constructor */ (function() {
            _self = JsML.DIV({class: "app-window", style: _inlineStyle()}, [
                JsML.DIV({class: "title-bar"}, [
                    JsML.DIV({class: "app-title"}, this.title),
                    JsML.DIV({class: "app-close button"}, ""),
                    JsML.DIV({class: "app-hide button"}, ""),
                    JsML.DIV({class: "app-maximise button"}, "")
                ]),
                JsML.DIV({class:"app-body"}, this.html)
            ]).asJsObject();
            document.getElementsByTagName("main")[0].appendChild(_self);
        }.bind(this))();
    }

    return AppWindow;
});