/**
 * Created by 4423 on 12/09/2016.
 */

define(["helper/toolbox", "JsML", "jquery", "jquery-ui"], function(toolbox, JsML, $, ju) {
    toolbox.loadCss("lib/css/appWindow");

    var _zIndex   = 1;
    var _getNextZ = function()
    {
      return _zIndex++;
    };

    function AppWindow(config)
    {
        if ("undefined" === typeof config) {
            config = {};
        }

        // assign config
        this.top     = config.top || 50;
        this.left    = config.left || 50;
        this.width   = config.width || 300;
        this.height  = config.height || 150;
        this.html    = config.html || "";
        this.title   = config.title || "New Window";
        this.zIndex  = _getNextZ(); // not supposed to be settable via config
        this.noClose = config.noClose || false;
        this.onOpen  = config.onOpen || null;


        // private vars
        var $_self      = null;
        var $_widget    = null;
        var _fullScreen = false;


        // public methods
        this.move = function(top, left)
        {
            this.top  = top;
            this.left = left;
            $_self.prop("style", _inlineStyle());
        };


        this.resize = function(width, height)
        {
            this.width  = width;
            this.height = height;
            $_self.prop("style", _inlineStyle());
        };


        // private methods
        var _bringToFront = function()
        {
            this.zIndex = _getNextZ();
            $_self.css("z-index", this.zIndex);

            $(".app-widget").removeClass("selected");
            $_widget.addClass("selected");
        }.bind(this);


        var _inlineStyle = function()
        {
            return "top:" + this.top + "px;"
                + "left:" + this.left + "px;"
                + "width:" + this.width + "px;"
                + "height:" + this.height + "px;"
                + "z-index:" + this.zIndex + ";";


        }.bind(this);


        var _onWidgetClick = function()
        {
            if (!$_widget || !$_self) {
                return;
            }

            if ($_widget.hasClass("selected")) {
                $_widget.removeClass("selected");
                $_self.hide();
            } else {
                $(".app-widget").removeClass("selected");
                $_widget.addClass("selected");
                $_self.show();

                _bringToFront();
            }
        }.bind(this);


        var _onFullScreen = function()
        {
            _bringToFront();
            if (_fullScreen) {
                $_self.prop("style", _inlineStyle());
                _fullScreen = false;
            } else {
                $_self.css({
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                    height: "auto",
                    width: "auto"
                });
                _fullScreen = true;
            }
        }.bind(this);


        var _onClose = function()
        {
            $_self.remove();
            $_widget.remove();
            // TODO: look into deleting all refs to this object
        }.bind(this);


        var _onMinimise = function(e)
        {
            $_self.hide();
            $_widget.removeClass("selected");
            e.stopPropagation();
        }.bind(this);


        /* constructor */ (function() {
            // create window
            $_self = JsML.DIV({class: "app-window", style: _inlineStyle()}, [
                JsML.DIV({class: "title-bar"}, [
                    JsML.DIV({class: "app-title"}, this.title),
                    JsML.DIV({class: "app-close button" + (this.noClose ? " disabled" : "")}, "x"),
                    JsML.DIV({class: "app-maximise button"}, "+"),
                    JsML.DIV({class: "app-hide button"}, "-")
                ]),
                JsML.DIV(
                    {class:"app-body"}, JsML.DIV({class: "content"}, this.html)
                )
            ]).asJQueryObject();
            $("main").append($_self);

            // jquery ui stuff
            $_self.resizable().draggable({
                distance: 5,
                cancel: ".app-body",
                containment: "parent"
            }).on("resizestop", function(e, u) {
                this.height = u.size.height;
                this.width = u.size.width
            }.bind(this)).on("dragstart", function() {
                if (_fullScreen) {
                    return false;
                }
            }.bind(this)).on("dragstop", function(e, u) {
                this.top = u.position.top;
                this.left = u.position.left;
            }.bind(this));

            // deselect other apps
            $(".app-widget").removeClass("selected");

            // create menu bar widget
            $_widget = JsML.DIV({class: "app-widget selected"}, this.title).asJQueryObject();
            $("footer").append($_widget);


            // setup binds
            $_widget.on("click", _onWidgetClick);
            if (!this.noClose) {
                $(".app-close", $_self).on("click", _onClose);
            }
            $(".app-maximise", $_self).on("click", _onFullScreen);
            $(".app-hide", $_self).on("click", _onMinimise);
            $_self.on("click", _bringToFront);

            // call on open closure
            if ("function" === typeof this.onOpen) {
                this.onOpen.bind(this);
                this.onOpen($_self, $_widget);
            }
        }.bind(this))();
    }

    return AppWindow;
});