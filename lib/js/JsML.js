/**
 * Created by 4423 on 18/03/2016.
 */
define(function() {
  function HTML(tag, props, contents)
  {
    function HTMLBuilder(tag, props, contents)
    {
      var _tag = "";
      var _props = {};
      var _contents = [];

      this.append = function (html)
      {
        if ("Function" === _objectType(html)) {
          html = html();
        }

        _validateInput(html);
        if ("Array" === _objectType(html)) {
          _contents = _contents.concat(html);
          return this;
        }

        _contents.push(html);

        return this;
      };

      this.prepend = function (html)
      {
        if ("Function" === _objectType(html)) {
          html = html();
        }

        _validateInput(html);
        if ("Array" === _objectType(html)) {
          _contents = html.concat(_contents)
          return this;
        }

        _contents.unshift(html);

        return this;
      };

      this.html = function (html)
      {
        if ("Function" === _objectType(html)) {
          html = html();
        }

        _validateInput(html);
        if ("Array" !== _objectType(html)) {
          html = [html];
        }

        _contents = html;
      };

      this.prop = function (key, value)
      {
        if ("string" !== typeof key) {
          throw new Error("Invalid key type");
        }
        if (~["string", "number", "boolean"].indexof(typeof value) && null !== value) {
          throw new Error("Invalid value type");
        }

        _props[key] = value;
      };


      this.asString = function ()
      {
        var html = '<' + _tag;

        for (var key in _props) {
          if (null === _props[key] || undefined === _props[key]) {
            continue;
          }

          html += ' ' + key + '="' + _props[key] + '"'
        }

        if (_contents.length) {
          return html + '>' + _parseContents(_contents) + '</' + _tag + '>';
        }

        return html + ' />';
      };


      this.asJsObject = function ()
      {
        var tmp = document.createElement("div");
        tmp.innerHTML = this.asString();

        return tmp.children[0];
      };


      this.asJQueryObject = function ()
      {
        if (!window.jQuery) {
          throw new Error("jQuery not found");
        }
        return window.jQuery(this.asString());
      };


      var _validateInput = function (inp)
      {
        if ("Array" === _objectType(inp)) {
          for (var i = 0; i < inp.length; i++) {
            _validateInput(inp[i]);
          }
        } else if (!~["String", "Number", "Boolean", "Function", "HTMLBuilder"].indexOf(_objectType(inp))) {
          throw new Error("invalid contents type");
        }
      }.bind(this);


      var _parseContents = function (inp)
      {
        if ("Array" === _objectType(inp)) {
          var string = "";
          for (var i = 0; i < inp.length; i++) {
            string += _parseContents(inp[i]);
          }

          return string;
        }

        if ("HTMLBuilder" === _objectType(inp)) {
          return inp.asString();
        }

        if ("boolean" === typeof inp) {
          return inp ? "true" : "false";
        }

        return inp;
      }.bind(this);


      var _objectType = function (ob)
      {
        var type = Object.prototype.toString.call(ob);
        if ("[object Object]" === type) {
          return ob.constructor.name;
        } else if (/^\[object\s\w+\]$/i.test(type)) {
          return /^\[object\s(\w+)\]/i.exec(type)[1];
        }

        return typeof ob;
      };


      (function __construct() {
        if ("string" !== typeof tag) {
          throw new Error("`tag` should be of type string");
        }

        if (null !== contents && undefined !== contents) {
          this.append(contents);
        }
        _tag = tag;
        _props = "object" === typeof props ? props : {};
      }.bind(this))();
    };

    return new HTMLBuilder(tag, props, contents);
  }

  var _createElemAlias = function(tag, ignoreContents)
  {
    if (ignoreContents) {
      return function(props) {
        if (!props) {
          props = {};
        }
        return HTML(tag, props);
      }
    } else {
      return function(props, content) {
        if (null === content || undefined === content) {
          content = "";
        }
        return HTML(tag, props, content);
      }
    }
  };

  var A = _createElemAlias("a");
  var ABBR = _createElemAlias("abbr");
  var ADDRESS = _createElemAlias("address");
  var AREA = _createElemAlias("area");
  var ARTICLE = _createElemAlias("article");
  var ASIDE = _createElemAlias("aside");
  var AUDIO = _createElemAlias("audio");
  var B = _createElemAlias("b");
  var BASE = _createElemAlias("base");
  var BDO = _createElemAlias("bdo");
  var BLOCKQUOTE = _createElemAlias("blockquote");
  var BODY = _createElemAlias("body");
  var BR = _createElemAlias("br", true);
  var BUTTON = _createElemAlias("button");
  var CANVAS = _createElemAlias("canvas");
  var CAPTION = _createElemAlias("caption");
  var CITE = _createElemAlias("cite");
  var CODE = _createElemAlias("code");
  var COL = _createElemAlias("col");
  var COLGROUP = _createElemAlias("colgroup");
  var DATALIST = _createElemAlias("datalist");
  var DD = _createElemAlias("dd");
  var DEL = _createElemAlias("del");
  var DETAILS = _createElemAlias("details");
  var DFN = _createElemAlias("dfn");
  var DIALOG = _createElemAlias("dialog");
  var DIV = _createElemAlias("div");
  var DL = _createElemAlias("dl");
  var DT = _createElemAlias("dt");
  var EM = _createElemAlias("em");
  var EMBED = _createElemAlias("embed");
  var FIELDSET = _createElemAlias("fieldset");
  var FIGCAPTION = _createElemAlias("figcaption");
  var FIGURE = _createElemAlias("figure");
  var FOOTER = _createElemAlias("footer");
  var FORM = _createElemAlias("form");
  var HEAD = _createElemAlias("head");
  var HEADER = _createElemAlias("header");
  var H1 = _createElemAlias("h1");
  var HR = _createElemAlias("hr", true);
  var I = _createElemAlias("i");
  var IFRAME = _createElemAlias("iframe");
  var IMG = _createElemAlias("img", true);
  var INS = _createElemAlias("ins");
  var INPUT = _createElemAlias("input", true);
  var KBD = _createElemAlias("kbd");
  var KEYGEN = _createElemAlias("keygen", true);
  var LABEL = _createElemAlias("label");
  var LEGEND = _createElemAlias("legend");
  var LI = _createElemAlias("li");
  var LINK = _createElemAlias("link", true);
  var MAP = _createElemAlias("map");
  var MARK = _createElemAlias("mark");
  var MENU = _createElemAlias("menu");
  var MENUITEM = _createElemAlias("menuitem");
  var META = _createElemAlias("meta", true);
  var METER = _createElemAlias("meter");
  var NAV = _createElemAlias("nav");
  var OBJECT = _createElemAlias("object");
  var OL = _createElemAlias("ol");
  var OPTGROUP = _createElemAlias("optgroup");
  var OPTION = _createElemAlias("option");
  var OUTPUT = _createElemAlias("output");
  var P = _createElemAlias("p");
  var PARAM = _createElemAlias("param");
  var PRE = _createElemAlias("pre");
  var PROGRESS = _createElemAlias("progress");
  var Q = _createElemAlias("q");
  var S = _createElemAlias("s");
  var SAMP = _createElemAlias("samp");
  var SCRIPT = _createElemAlias("script");
  var SECTION = _createElemAlias("section");
  var SELECT = _createElemAlias("select");
  var SMALL = _createElemAlias("small");
  var SOURCE = _createElemAlias("source", true);
  var SPAN = _createElemAlias("span");
  var STRONG = _createElemAlias("strong");
  var STYLE = _createElemAlias("style");
  var SUB = _createElemAlias("sub");
  var SUMMARY = _createElemAlias("summary");
  var SUP = _createElemAlias("sup");
  var TABLE = _createElemAlias("table");
  var TD = _createElemAlias("td");
  var TH = _createElemAlias("th");
  var TR = _createElemAlias("tr");
  var TEXTAREA = _createElemAlias("textarea");
  var TIME = _createElemAlias("time");
  var TITLE = _createElemAlias("title");
  var TRACK = _createElemAlias("track");
  var U = _createElemAlias("u");
  var UL = _createElemAlias("ul");
  var VAR = _createElemAlias("var");
  var VIDEO = _createElemAlias("video");



  return {
    HTML: HTML,
    A: A,
    ABBR: ABBR,
    ADDRESS: ADDRESS,
    AREA: AREA,
    ARTICLE: ARTICLE,
    ASIDE: ASIDE,
    AUDIO: AUDIO,
    B: B,
    BASE: BASE,
    BDO: BDO,
    BLOCKQUOTE: BLOCKQUOTE,
    BODY: BODY,
    BR: BR,
    BUTTON: BUTTON,
    CANVAS: CANVAS,
    CAPTION: CAPTION,
    CITE: CITE,
    CODE: CODE,
    COL: COL,
    COLGROUP: COLGROUP,
    DATALIST: DATALIST,
    DD: DD,
    DEL: DEL,
    DETAILS: DETAILS,
    DFN: DFN,
    DIALOG: DIALOG,
    DIV: DIV,
    DL: DL,
    DT: DT,
    EM: EM,
    EMBED: EMBED,
    FIELDSET: FIELDSET,
    FIGCAPTION: FIGCAPTION,
    FIGURE: FIGURE,
    FOOTER: FOOTER,
    FORM: FORM,
    HEAD: HEAD,
    HEADER: HEADER,
    H1: H1,
    HR: HR,
    I: I,
    IFRAME: IFRAME,
    IMG: IMG,
    INS: INS,
    INPUT: INPUT,
    KBD: KBD,
    KEYGEN: KEYGEN,
    LABEL: LABEL,
    LEGEND: LEGEND,
    LI: LI,
    LINK: LINK,
    MAP: MAP,
    MARK: MARK,
    MENU: MENU,
    MENUITEM: MENUITEM,
    META: META,
    METER: METER,
    NAV: NAV,
    OBJECT: OBJECT,
    OL: OL,
    OPTGROUP: OPTGROUP,
    OPTION: OPTION,
    OUTPUT: OUTPUT,
    P: P,
    PARAM: PARAM,
    PRE: PRE,
    PROGRESS: PROGRESS,
    Q: Q,
    S: S,
    SAMP: SAMP,
    SCRIPT: SCRIPT,
    SECTION: SECTION,
    SELECT: SELECT,
    SMALL: SMALL,
    SOURCE: SOURCE,
    SPAN: SPAN,
    STRONG: STRONG,
    STYLE: STYLE,
    SUB: SUB,
    SUMMARY: SUMMARY,
    SUP: SUP,
    TABLE: TABLE,
    TD: TD,
    TH: TH,
    TR: TR,
    TEXTAREA: TEXTAREA,
    TIME: TIME,
    TITLE: TITLE,
    TRACK: TRACK,
    U: U,
    UL: UL,
    VAR: VAR,
    VIDEO: VIDEO,
    populateGlobal: function (allTags)
    {
      window.HTML = HTML;

      if (allTags) {
        for (var key in JsML) {
          if (~["HTML", "populateGlobal"].indexOf(key)) {
            continue;
          }

          window[key] = JsML[key];
        }
      }
    }
  };
});