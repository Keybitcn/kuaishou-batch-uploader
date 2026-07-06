(function () {
  var EMOJIS = [
    "😀", "😃", "😄", "😁", "😊", "🥰", "😍", "🤔", "😎", "🥳",
    "👍", "👏", "🙏", "💪", "❤️", "🔥", "✨", "⭐", "🎉", "💡",
    "📝", "📷", "🎵", "☕", "🌟", "🌈", "🍀", "🐱", "🐶", "🦊",
  ];

  var React = window.React;

  function insertAtCursor(textarea, text) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var value = textarea.value;
    textarea.value = value.slice(0, start) + text + value.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
    return textarea.value;
  }

  function wrapSelection(textarea, before, after) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var value = textarea.value;
    var selected = value.slice(start, end) || "文字";
    textarea.value = value.slice(0, start) + before + selected + after + value.slice(end);
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
    textarea.focus();
    return textarea.value;
  }

  var BlogEditorControl = (function (Super) {
    function BlogEditorControl(props) {
      Super.call(this, props);
      this.textareaRef = React.createRef();
      this.state = { value: props.value || "" };
    }

    BlogEditorControl.prototype = Object.create(Super.prototype);
    BlogEditorControl.prototype.constructor = BlogEditorControl;

    BlogEditorControl.prototype.componentDidUpdate = function (prevProps) {
      if (prevProps.value !== this.props.value) {
        this.setState({ value: this.props.value || "" });
      }
    };

    BlogEditorControl.prototype.updateValue = function (next) {
      this.setState({ value: next });
      this.props.onChange(next);
    };

    BlogEditorControl.prototype.toolbarAction = function (fn) {
      var self = this;
      return function (event) {
        event.preventDefault();
        var textarea = self.textareaRef.current;
        if (!textarea) return;
        self.updateValue(fn(textarea));
      };
    };

    BlogEditorControl.prototype.render = function () {
      var self = this;
      return React.createElement(
        "div",
        { className: "blog-editor" },
        React.createElement(
          "div",
          { className: "blog-editor-toolbar" },
          React.createElement("button", { type: "button", onClick: this.toolbarAction(function (ta) { return wrapSelection(ta, "**", "**"); }) }, "加粗"),
          React.createElement("button", { type: "button", onClick: this.toolbarAction(function (ta) { return wrapSelection(ta, "*", "*"); }) }, "斜体"),
          React.createElement("button", { type: "button", onClick: this.toolbarAction(function (ta) { return wrapSelection(ta, "## ", ""); }) }, "小标题"),
          React.createElement("button", { type: "button", onClick: this.toolbarAction(function (ta) { return wrapSelection(ta, "> ", ""); }) }, "引用"),
          React.createElement("button", { type: "button", onClick: this.toolbarAction(function (ta) { return wrapSelection(ta, "- ", ""); }) }, "列表"),
          React.createElement("button", {
            type: "button",
            onClick: this.toolbarAction(function (ta) {
              var url = window.prompt("输入链接地址", "https://");
              if (!url) return ta.value;
              var text = ta.value.slice(ta.selectionStart, ta.selectionEnd) || "链接文字";
              return insertAtCursor(ta, "[" + text + "](" + url + ")");
            }),
          }, "链接"),
          React.createElement("button", {
            type: "button",
            onClick: this.toolbarAction(function (ta) {
              var url = window.prompt("输入图片地址（可先点左侧「媒体」上传后复制链接）", "/uploads/");
              if (!url) return ta.value;
              return insertAtCursor(ta, "\n\n![](" + url + ")\n\n");
            }),
          }, "插图")
        ),
        React.createElement(
          "div",
          { className: "blog-editor-emoji" },
          EMOJIS.map(function (emoji) {
            return React.createElement("button", {
              key: emoji,
              type: "button",
              title: "插入表情",
              onClick: self.toolbarAction(function (ta) { return insertAtCursor(ta, emoji); }),
            }, emoji);
          })
        ),
        React.createElement("textarea", {
          ref: this.textareaRef,
          className: "blog-editor-area",
          value: this.state.value,
          placeholder: "在这里写正文，像发朋友圈一样直接写就好。",
          onChange: function (event) {
            self.updateValue(event.target.value);
          },
        }),
        React.createElement(
          "div",
          { className: "blog-editor-hint" },
          "支持 JPG / PNG / GIF / WebP。上传图片请点左侧「媒体」，再点「插图」粘贴地址。"
        )
      );
    };

    return BlogEditorControl;
  })(React.Component);

  function registerEditor() {
    if (!window.CMS || !window.React) return false;
    window.CMS.registerWidget("blog-editor", BlogEditorControl);
    return true;
  }

  if (!registerEditor()) {
    var timer = window.setInterval(function () {
      if (registerEditor()) window.clearInterval(timer);
    }, 200);
  }
})();