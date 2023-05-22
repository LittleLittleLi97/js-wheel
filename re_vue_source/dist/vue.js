(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    // id="app" id='app' id=app
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 标签名 <my-header></my-header>

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // <my:header></my:header>

    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <div

    var startTagOpen = new RegExp("^<".concat(qnameCapture)); // > 或 />

    var startTagClose = /^\s*(\/?)>/; // </div>

    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
    function parseToAst(html) {
      var stack = [];
      var root;
      var currentParent = null;

      function start(tagName, attrs) {
        var node = {
          tagName: tagName,
          attrs: attrs,
          type: 1,
          parent: null,
          children: []
        };

        if (!root) {
          root = node;
        }

        if (currentParent) {
          currentParent.children.push(node);
        }

        node.parent = currentParent;
        currentParent = node;
        stack.push(node);
      }

      function end() {
        stack.pop();
        currentParent = stack[stack.length - 1];
      }

      function chars(text) {
        text = text.trim();
        if (!text) return;
        var node = {
          type: 3,
          text: text,
          parent: currentParent
        };
        currentParent.children.push(node);
      }

      function startTag() {
        var startTagMatch = html.match(startTagOpen);

        if (startTagMatch) {
          var match = {
            tagName: startTagMatch[1],
            attrs: [],
            children: []
          };
          advance(startTagMatch[0].length);

          var _end;

          var attr;

          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            var key = attr[1];
            var value = attr[3] || attr[4] || attr[5];
            match.attrs.push({
              name: key,
              value: value
            });
            advance(attr[0].length);
          }

          if (_end) {
            advance(_end[0].length);
          }

          return match;
        }

        return false;
      }

      function advance(n) {
        html = html.substring(n);
      }

      while (html) {
        var endText = html.indexOf('<');

        if (endText === 0) {
          var startTagMatch = startTag();

          if (!startTagMatch) {
            var endTagMatch = html.match(endTag);

            if (endTagMatch) {
              end();
              advance(endTagMatch[0].length);
            }
          } else {
            start(startTagMatch.tagName, startTagMatch.attrs);
          }

          continue;
        }

        if (endText > 0) {
          var text = html.substring(0, endText);
          chars(text);
          advance(endText);
        }
      }

      return root;
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    function parseAttrs(attrs) {
      var result = attrs.map(function (item) {
        var name = item.name,
            value = item.value;

        if (name === 'style') {
          var styleArr = [];
          value.split(';').map(function (styleItem) {
            var _styleItem$split = styleItem.split(':'),
                _styleItem$split2 = _slicedToArray(_styleItem$split, 2),
                styleKey = _styleItem$split2[0],
                styleValue = _styleItem$split2[1];

            if (styleKey) {
              styleArr.push("\"".concat(styleKey.trim(), "\":\"").concat(styleValue.trim(), "\""));
            }
          });
          return "style:{".concat(styleArr.join(','), "}");
        } else {
          return "".concat(name, ":\"").concat(value, "\"");
        }
      });
      return "{".concat(result.join(','), "}");
    }

    function parseChildren(children) {
      var arr = children.map(function (item) {
        if (item.type === 1) {
          return parseAstToRender(item);
        } else {
          return parseChars(item.text);
        }
      });
      return arr.join(',');
    }

    function parseChars(text) {
      var result = [];
      var lastIndex = 0;
      var match;

      while (match = defaultTagRE.exec(text)) {
        var before = text.substring(lastIndex, match.index);
        if (before) result.push("\"".concat(before, "\""));
        result.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = defaultTagRE.lastIndex;
      }

      var last = text.substring(lastIndex);
      if (last) result.push("\"".concat(last, "\""));
      return "_v(".concat(result.join('+'), ")");
    }

    function parseAstToRender(ast) {
      var children = ast.children;
      return "_c('".concat(ast.tagName, "',").concat(parseAttrs(ast.attrs)).concat(children.length > 0 ? ",".concat(parseChildren(children)) : '', ")");
    }

    function parseTemplateToRender(template) {
      var ast = parseToAst(template);
      var render = parseAstToRender(ast);
      return new Function("with(this){return ".concat(render, "}"));
    }

    function createElementVNode(vm, tag, data) {
      var key = data.key;
      if (key) delete data.key;

      for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        children[_key - 3] = arguments[_key];
      }

      return createVNode(vm, tag, key, data, children, undefined);
    }
    function createTextVNode(vm, text) {
      return createVNode(vm, undefined, undefined, undefined, undefined, text);
    }
    function createVNode(vm, tag, key, data, children, text) {
      return {
        vm: vm,
        tag: tag,
        key: key,
        data: data,
        children: children,
        text: text
      };
    }

    function createElement(vnode) {
      var tag = vnode.tag,
          data = vnode.data,
          children = vnode.children,
          text = vnode.text;

      if (tag) {
        // element
        var dom = document.createElement(tag);

        for (var key in data) {
          if (key === 'style') {
            var styleObj = data[key];

            for (var styleKey in styleObj) {
              dom.style[styleKey] = styleObj[styleKey];
            }
          } else {
            dom.setAttribute(key, data[key]);
          }
        }

        if (children) {
          children.forEach(function (child) {
            dom.appendChild(createElement(child));
          });
        }

        return dom;
      } else {
        // text
        return document.createTextNode(text);
      }
    }

    function patch(oldNode, vnode) {
      if (oldNode.nodeType) {
        var dom = createElement(vnode);
        var parentDom = oldNode.parentNode;
        parentDom.insertBefore(dom, oldNode.nextSibling);
        parentDom.removeChild(oldNode);
        return dom;
      }
    }

    function initLifeCycle(Vue) {
      Vue.prototype._c = function (tagName, attrs) {
        for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          children[_key - 2] = arguments[_key];
        }

        return createElementVNode.apply(void 0, [this, tagName, attrs].concat(children));
      };

      Vue.prototype._v = function (text) {
        return createTextVNode(this, text);
      };

      Vue.prototype._s = function (value) {
        return value;
      };

      Vue.prototype._render = function () {
        return this.$options.render.call(this);
      };

      Vue.prototype._update = function (vnode) {
        var vm = this;
        var el = vm.$el;
        vm.$el = patch(el, vnode);
      };
    }
    function mountComponent(vm, el) {
      vm.$el = el;

      vm._update(vm._render(), el);
    }

    var oldArrayPrototype = Array.prototype;
    var arrMethods = ['pop', 'push', 'shift', 'unshift', 'reverse', 'splice', 'sort'];
    var newArrayPrototype = Object.create(oldArrayPrototype);
    arrMethods.forEach(function (method) {
      newArrayPrototype[method] = function () {
        var _Array$prototype$meth;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = (_Array$prototype$meth = Array.prototype[method]).call.apply(_Array$prototype$meth, [this].concat(args));

        var newValue;

        switch (method) {
          case 'push':
          case 'unshift':
            newValue = args;
            break;

          case 'splice':
            newValue = args.slice(2);
            break;
        }

        if (newValue) {
          observe(newValue);
        }

        return result;
      };
    });

    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);

        if (Array.isArray(data)) {
          data.__proto__ = newArrayPrototype;
          this.walkArray(data);
        } else {
          this.walk(data);
        }
      }

      _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          for (var key in data) {
            defineReactive(data, key, data[key]);
          }
        }
      }, {
        key: "walkArray",
        value: function walkArray(data) {
          for (var i = 0; i < data.length; i++) {
            observe(data[i]);
          }
        }
      }]);

      return Observer;
    }();

    function observe(data) {
      if (_typeof(data) !== 'object' || data === null) {
        return;
      }

      return new Observer(data);
    }

    function defineReactive(data, key, value) {
      observe(value);
      Object.defineProperty(data, key, {
        get: function get() {
          return value;
        },
        set: function set(newValue) {
          if (newValue !== value) {
            value = newValue;
            observe(newValue);
          }
        }
      });
    }

    function initState(vm) {
      vm.$options;
      initData(vm);

      for (var key in vm._data) {
        proxyData(vm, '_data', key);
      }
    }

    function initData(vm) {
      var data = vm.$options.data;

      if (data) {
        data = typeof data === 'function' ? data() : data || {};
      }

      vm._data = data;
      observe(vm._data);
    }

    function proxyData(target, inter, key) {
      var value = target[inter][key];
      Object.defineProperty(target, key, {
        get: function get() {
          return target[inter][key];
        },
        set: function set(newValue) {
          if (newValue !== value) {
            value = newValue;
            observe(newValue);
          }
        }
      });
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        vm.$options = options;
        initState(vm);

        if (options.el) {
          vm.$mount(options.el);
        }
      };

      Vue.prototype.$mount = function (el) {
        var vm = this;
        var options = vm.$options;
        el = document.querySelector(el);

        if (!options.render) {
          var template = options.template;

          if (!template) {
            template = el.outerHTML;
          }

          options.render = parseTemplateToRender(template);
        }

        mountComponent(vm, el);
      };
    }

    function Vue(options) {
      this._init(options);
    }
    initMixin(Vue);
    initLifeCycle(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
