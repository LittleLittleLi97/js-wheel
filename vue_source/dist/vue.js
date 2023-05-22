(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var strategies = {};
    var LIFECYCLE = ['beforeCreate', 'created'];
    LIFECYCLE.forEach(function (hook) {
      strategies[hook] = function (parent, child) {
        if (child) {
          if (parent) {
            return parent.concat(child);
          } else {
            return [child];
          }
        } else {
          return parent;
        }
      };
    });
    function mergeOptions(parent, child) {
      var options = {};

      for (var key in parent) {
        mergeField(key);
      }

      for (var _key in child) {
        if (!parent.hasOwnProperty(_key)) {
          mergeField(_key);
        }
      }

      function mergeField(key) {
        if (strategies[key]) {
          options[key] = strategies[key](parent[key], child[key]);
        } else {
          options[key] = parent[key] || child[key];
        }
      }

      return options;
    }

    function initMixinGlobalAPI(Vue) {
      Vue.options = {};

      Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
      };
    }

    // id="app" id='app' id=app
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 标签名 <my-header></my-header>

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // <my:header></my:header>

    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <div

    var startTagOpen = new RegExp("^<".concat(qnameCapture)); // > 或 />

    var startTagClose = /^\s*(\/?)>/; // </div>

    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
    function parseToAst(html) {
      var ELEMENT_TYPE = 1;
      var TEXT_TYPE = 3;
      var stack = [];
      var currentParent;
      var root;

      function start(tagMatch) {
        var node = generateNode(tagMatch.tagName, tagMatch.attrs);

        if (!root) {
          root = node;
        }

        if (currentParent) {
          currentParent.children.push(node);
          node.parent = currentParent;
        }

        currentParent = node;
        stack.push(node);
      }

      function end() {
        stack.pop();
        currentParent = stack[stack.length - 1];
      }

      function chars(text) {
        text = text.trim();

        if (text) {
          currentParent.children.push({
            type: TEXT_TYPE,
            text: text,
            parent: currentParent
          });
        }
      }

      function generateNode(tag, attrs) {
        return {
          tag: tag,
          type: ELEMENT_TYPE,
          attrs: attrs,
          children: [],
          parent: null
        };
      }

      function advance(n) {
        html = html.substring(n);
      }

      function parseStartTag() {
        var tag = html.match(startTagOpen);

        if (tag) {
          var match = {
            tagName: tag[1],
            attrs: []
          };
          advance(tag[0].length);
          var attr;

          var _end;

          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
          }

          if (_end) advance(_end[0].length);
          return match;
        }

        return false;
      }

      while (html) {
        var textEnd = html.indexOf('<');

        if (textEnd === 0) {
          var startTagMatch = parseStartTag();

          if (startTagMatch) {
            start(startTagMatch);
            continue;
          }

          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            end();
            advance(endTagMatch[0].length);
          }
        }

        if (textEnd > 0) {
          var text = html.substring(0, textEnd);
          chars(text);
          advance(textEnd);
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

    function getAttrs(attrs) {
      var result = attrs.map(function (item) {
        var key = item.name;
        var value = item.value;

        if (key === 'style') {
          value = value.split(';');
          var obj = {};
          value.forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                styleKey = _item$split2[0],
                styleValue = _item$split2[1];

            if (styleKey) {
              // arr.push({
              //     styleKey: styleValue
              // });
              obj[styleKey.trim()] = styleValue.trim();
            }
          });
          return "".concat(key, ":").concat(JSON.stringify(obj));
        } else {
          return "".concat(key, ":").concat(JSON.stringify(value));
        }
      });
      return "{".concat(result.join(','), "}");
    }

    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    function parseChildren(children) {
      var res = children.map(function (item) {
        if (item.type === 1) {
          return parseToRender(item);
        } else if (item.type === 3) {
          var text = item.text;
          var arr = [];

          if (defaultTagRE.test(text)) {
            defaultTagRE.lastIndex = 0;
            var lastIndex = 0;
            var match;

            while (match = defaultTagRE.exec(text)) {
              var beforeText = text.substring(lastIndex, match.index);
              if (beforeText) arr.push("\"".concat(beforeText, "\""));
              arr.push("_s(".concat(match[1].trim(), ")"));
              lastIndex = defaultTagRE.lastIndex;
            }

            var last = text.substring(lastIndex);
            if (last) arr.push("\"".concat(last, "\""));
          }

          return "_v(".concat(arr.join('+'), ")");
        }
      });
      return res.join(',');
    }

    function parseToRender(ast) {
      var children = ast.children;
      return "_c('".concat(ast.tag, "',").concat(ast.attrs ? getAttrs(ast.attrs) : null).concat(children.length > 0 ? ",".concat(parseChildren(children)) : null, ")");
    }

    function compileToRender(template) {
      var ast = parseToAst(template);
      var render = parseToRender(ast);
      return new Function("with(this){return ".concat(render, "}"));
    }

    var id$1 = 0;
    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);

        this.id = id$1++;
        this.subs = [];
      }

      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          Dep.target && Dep.target.addDep(this);
        }
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          this.subs.push(watcher);
        }
      }, {
        key: "notify",
        value: function notify() {
          this.subs.forEach(function (watcher) {
            return watcher.update();
          });
        }
      }]);

      return Dep;
    }();
    Dep.target = null;
    var stack = [];
    function pushTarget(watcher) {
      stack.push(watcher);
      Dep.target = watcher;
    }
    function popTarget() {
      stack.pop();
      Dep.target = stack[stack.length - 1];
    }

    var id = 0;
    var Watcher = /*#__PURE__*/function () {
      function Watcher(vm, exprOrFn, options, callback) {
        _classCallCheck(this, Watcher);

        this.vm = vm;
        this.id = id++;
        this.renderWacher = options;

        if (typeof exprOrFn === 'string') {
          this.getter = function () {
            return vm[exprOrFn];
          };
        } else {
          this.getter = exprOrFn;
        }

        this.deps = [];
        this.depIdSet = new Set();
        this.lazy = options.lazy;
        this.cb = callback;
        this.dirty = this.lazy;
        this.user = options.user; // this.value watch的初始值，或computed的计算值
        // watch第一次执行get()，也就是获取了一下data属性，让其dep记录此watcher

        this.value = this.lazy ? undefined : this.get();
      }

      _createClass(Watcher, [{
        key: "get",
        value: function get() {
          pushTarget(this);
          var value = this.getter.call(this.vm); // 在计算属性fn的执行时，this指向vm

          popTarget();
          return value;
        }
      }, {
        key: "evaluate",
        value: function evaluate() {
          this.value = this.get();
          this.dirty = false;
        }
      }, {
        key: "addDep",
        value: function addDep(dep) {
          var id = dep.id;

          if (!this.depIdSet.has(id)) {
            this.deps.push(dep);
            this.depIdSet.add(id);
            dep.addSub(this);
          }
        }
      }, {
        key: "update",
        value: function update() {
          if (this.lazy) {
            // 计算属性watcher修改dirty
            this.dirty = true;
          } else {
            // 渲染watcher加入更新队列
            queueWatcher(this);
          }
        }
      }, {
        key: "run",
        value: function run() {
          var oldValue = this.value;
          var newValue = this.get();

          if (this.user) {
            this.cb.call(this.vm, newValue, oldValue);
          }
        }
      }, {
        key: "depend",
        value: function depend() {
          this.deps.forEach(function (dep) {
            dep.depend();
          });
        }
      }]);

      return Watcher;
    }();
    var queue = [];
    var has = {};

    function queueWatcher(watcher) {
      var id = watcher.id;

      if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        nextTick(flushQueueWatcher);
      }
    }
    /* 
    这里的实现是简化之后的
    Vue 源码中的注释：
    在刷新之前对队列进行排序。
    这可确保：
    1. 组件从父级更新到子级。 （因为父母总是在孩子之前创建）
    2. 组件的用户观察者在其渲染观察者之前运行（因为用户观察者是在渲染观察者之前创建的）
    3. 如果一个组件在父组件的 watcher 运行过程中被销毁，它的 watchers 可以跳过。
    */


    function flushQueueWatcher() {
      var watchers = queue.slice(0);
      queue.length = 0;
      has = {};
      watchers.forEach(function (watcher) {
        watcher.run();
      });
    }

    var nextTickCallbacks = [];
    var waiting = false;
    function nextTick(callback) {
      nextTickCallbacks.push(callback);

      if (!waiting) {
        waiting = true;
        Promise.resolve().then(flushNextTickCallbacks);
      }
    }

    function flushNextTickCallbacks() {
      var callbacks = nextTickCallbacks.slice(0);
      nextTickCallbacks.length = 0;
      waiting = false;
      callbacks.forEach(function (callback) {
        callback();
      });
    }

    function createElementVNode(vm, tag, data) {
      var key = data.key;

      if (key) {
        delete data.key;
      }

      for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        children[_key - 3] = arguments[_key];
      }

      return createVNode(vm, tag, key, data, children);
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
    function isSameVNode(vnode1, vnode2) {
      return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
    }

    function createElement(vnode) {
      var tag = vnode.tag,
          data = vnode.data,
          children = vnode.children,
          text = vnode.text;
      var element;

      if (typeof tag === 'string') {
        element = document.createElement(tag);
        vnode.el = element;
        patchAttrs(element, data);
        children.forEach(function (child) {
          element.appendChild(createElement(child));
        });
      } else {
        element = document.createTextNode(text);
        vnode.el = element;
      }

      return vnode.el;
    }
    function patchAttrs(element, attrs) {
      for (var key in attrs) {
        if (key === 'style') {
          for (var styleName in attrs[key]) {
            element.style[styleName] = attrs[key][styleName];
          }
        } else {
          element.setAttribute(key, attrs[key]);
        }
      }
    }
    function patch(oldVNode, vnode) {
      if (oldVNode.nodeType) {
        // 第一次patch
        var oldElement = oldVNode;
        var newElement = createElement(vnode);
        var parentDom = oldElement.parentNode;
        parentDom.insertBefore(newElement, oldElement.nextSibling);
        parentDom.removeChild(oldElement);
        return newElement;
      } else {
        // diff
        return patchVNode(oldVNode, vnode);
      }
    }

    function patchVNode(oldVNode, vnode) {
      if (!isSameVNode(oldVNode, vnode)) {
        var _el = createElement(vnode);

        oldVNode.el.parentNode.replaceChild(_el, oldVNode);
        return _el;
      } // 文本


      var el = vnode.el = oldVNode.el;

      if (!oldVNode.tag) {
        if (oldVNode.text !== vnode.text) {
          el.textContent = vnode.text;
        }
      }
    }

    function initLifeCycle(Vue) {
      Vue.prototype._c = function () {
        return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
      };

      Vue.prototype._v = function () {
        return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
      };

      Vue.prototype._s = function (value) {
        if (_typeof(value) === 'object') return JSON.stringify(value);else return value;
      };

      Vue.prototype._update = function (vnode) {
        var vm = this;
        var el = vm.$el;
        vm.$el = patch(el, vnode);
      };

      Vue.prototype._render = function () {
        return this.$options.render.call(this);
      };
    }
    function mountComponent(vm, el) {
      vm.$el = el;

      var updateFunc = function updateFunc() {
        vm._update(vm._render());
      };

      new Watcher(vm, updateFunc, {});
    }
    function callHook(vm, hook) {
      var handlers = vm.$options[hook];

      if (handlers) {
        handlers.forEach(function (handler) {
          handler.call(vm);
        });
      }
    }

    var oldArrayProto = Array.prototype;
    var newArrayProto = Object.create(oldArrayProto);
    var arrMethods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'splice', 'sort'];
    arrMethods.forEach(function (method) {
      newArrayProto[method] = function () {
        var _oldArrayProto$method;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

        var ob = this.__ob__; // this指向数组本身，数组挂上了Observer对象

        var inserted;

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;

          case 'splice':
            inserted = args.slice(2);
            break;
        } // inserted && observe(inserted);


        ob.observeArray(inserted);
        ob.dep.notify();
        return result;
      };
    });

    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);

        this.dep = new Dep(); // data.__ob__ = this; // this指向此对象，可以用于调用observeArray，但是这么写会被遍历到，重复调用而报错

        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false // 设置不可被遍历

        });

        if (Array.isArray(data)) {
          data.__proto__ = newArrayProto;
          this.observeArray(data);
        } else {
          this.walk(data);
        }
      }

      _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          Object.keys(data).forEach(function (key) {
            return defineReactive(data, key, data[key]);
          });
        }
      }, {
        key: "observeArray",
        value: function observeArray(data) {
          data.forEach(function (item) {
            return observe(item);
          });
        }
      }]);

      return Observer;
    }();

    function dependArray(value) {
      for (var i = 0; i < value.length; i++) {
        var current = value[i];
        current.__ob__ && current.__ob__.dep.depend();

        if (Array.isArray(current)) {
          dependArray(current);
        }
      }
    }

    function defineReactive(target, key, value) {
      var childOb = observe(value);
      var dep = new Dep();
      Object.defineProperty(target, key, {
        get: function get() {
          if (Dep.target !== null) {
            dep.depend();

            if (childOb) {
              childOb.dep.depend();

              if (Array.isArray(value)) {
                dependArray(value);
              }
            }
          }

          return value;
        },
        set: function set(newValue) {
          if (value === newValue) return;
          observe(value);
          value = newValue;
          dep.notify();
        }
      });
    }
    function observe(data) {
      if (_typeof(data) !== 'object' || data === null) return;
      return new Observer(data);
    }

    function initState(vm) {
      var opts = vm.$options;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) {
        initComputed(vm);
      }

      if (opts.watch) {
        initWatch(vm);
      }
    }

    function proxy(vm, target, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[target][key];
        },
        set: function set(newValue) {
          observe(newValue);
          vm[target][key] = newValue;
        }
      });
    }

    function initData(vm) {
      var data = vm.$options.data;
      data = typeof data === 'function' ? data.call(vm) : data;
      vm._data = data;
      observe(data);

      for (var key in data) {
        proxy(vm, '_data', key);
      }
    }

    function initComputed(vm) {
      var computed = vm.$options.computed;
      var watchers = vm._computedWatchers = {};

      for (var key in computed) {
        var userDef = computed[key];
        var fn = typeof userDef === 'function' ? userDef : userDef.get;
        watchers[key] = new Watcher(vm, fn, {
          lazy: true
        });
        defineComputed(vm, key, userDef);
      }
    }

    function defineComputed(target, key, userDef) {
      var setter = userDef.set || function () {};

      Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
      });
    }

    function createComputedGetter(key) {
      return function () {
        var watcher = this._computedWatchers[key];

        if (watcher.dirty) {
          watcher.evaluate();
        }

        if (Dep.target) {
          watcher.depend();
        }

        return watcher.value;
      };
    }

    function initWatch(vm) {
      var watch = vm.$options.watch;

      var _loop = function _loop(key) {
        var handler = watch[key];

        if (Array.isArray(handler)) {
          handler.forEach(function (item) {
            return createWatch(vm, key, item);
          });
        } else {
          createWatch(vm, key, handler);
        }
      };

      for (var key in watch) {
        _loop(key);
      }
    }

    function createWatch(vm, key, handler) {
      if (typeof handler === 'string') {
        handler = vm[handler];
      }

      return vm.$watch(key, handler);
    }

    function initStateMixin(Vue) {
      Vue.prototype.$nextTick = nextTick;

      Vue.prototype.$watch = function (exprOrFn, callback) {
        new Watcher(this, exprOrFn, {
          user: true
        }, callback);
      };
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this; // LifeCycle 定义的全局指令和过滤器，都会挂载到实例上

        vm.$options = mergeOptions(this.constructor.options, options); // 将用户的选项挂载到实例上

        callHook(vm, 'beforeCreate'); // LifeCycle 初始化状态，如data、计算属性、watch

        initState(vm);
        callHook(vm, 'created');

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
          if (!template && el) template = el.outerHTML;
          var render = compileToRender(template);
          options.render = render;
        }

        mountComponent(vm, el);
      };
    }

    function Vue(options) {
      this._init(options);
    }

    initMixin(Vue); // 引入包的时候就掉用了，所以在Vue实例化的时候已经有了_init方法

    initLifeCycle(Vue);
    initMixinGlobalAPI(Vue);
    initStateMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
