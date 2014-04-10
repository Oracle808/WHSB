var Backbone = require("./backbone");
var CodeBox = require("./codebox");

MathJax.Hub.Config({
    tex2jax: {
	displayMath: [],
	inlineMath: []
    }
});

var getSelectionHtml = function() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
	var sel = window.getSelection();
	if (sel.rangeCount) {
	    var container = document.createElement("div");
	    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
		container.appendChild(sel.getRangeAt(i).cloneContents());
	    }
	    html = container.innerHTML;
	}
    } else if (typeof document.selection != "undefined") {
	if (document.selection.type == "Text") {
	    html = document.selection.createRange().htmlText;
	}
    }
    return html;
};

var EditorView = require("../app/blogs/editor.dust");

var EditorState = Backbone.Model.extend({
    defaults: {
	mode: "rich-text-editor"
    }
});

var EditorController = Backbone.Controller.extend({
    template: EditorView,

    className: "editor",

    requires: Modernizr.contenteditable,

    events: {
	"change .editor-mode": "updateMode",
	"click .editor-toolbar button": "updateFormat",
	"change select.font-control": "updateFont",
	"click .editor-rich": "reconfigure",
	"keydown .editor-rich": "reconfigure",
	"keyup #editor": "transpose",
	"click ul[role=\"tablist\"] li a": "openTab"
    },

    initialize: function(options) {
	this.controls = $("#" + options.controls);
	this.state = new EditorState();
	this.listenTo(this.state, "change", this.render);
	this.$el.insertBefore(this.controls);
	this.render();
    },

    updateMode: function(e) {
	this.state.set("mode", e.target.value);
	e.preventDefault();
    },

    // Controls everything from bold to insertUnorderedList
    updateFormat: function(e) {
	var target = $(e.target);
	document.execCommand(target.val());
	target.toggleClass("active");
	e.preventDefault();
    },

    updateFont: function(e) {
	document.execCommand("fontName", false, e.target.value);
    },

    reconfigure: function(e) {
	console.log("Yep!");
	["bold", "underline", "italic", "insertOrderedList", "insertUnorderedList"].forEach((function(option) {
	    if(document.queryCommandState(option)) {
		this.find("[value=\"" + option + "\"]").addClass("active");
	    } else {
		this.find("[value=\"" + option + "\"]").removeClass("active");
	    }
	}).bind(this));
    },

    transpose: function(e) {
	if(this.controls) {
	    var editor = this.findById("editor");
	    console.log(this.state.get("mode"));
	    console.log(this.editor);
	    var val = (this.state.get("mode") === "rich-text-editor" ? editor.html() : this.editor.val());
	    this.controls.val(val);
	}
    },

    openTab: function(e) {
	var el = $(e.target);
	el.parent().siblings().removeClass("active");
	el.parent().addClass("active");
	var targetId = el.attr("aria-controls");
	var target = $("#" + targetId);
	if(targetId === "preview") {
	    target.html($("<script type=\"math/tex\">").html(this.editor.val()));
	    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "preview"]);
	}
	target.siblings().hide();
	target.show();
    },

    subviews: function(e) {
	if(this.state.get("mode") === "latex") {
	    this.editor = CodeBox.create({
		el: this.findById("editor"),
		mode: CodeBox.Modes.LaTeX
	    });
	} else {
	    this.editor = undefined;
	}
    }
});

$(document).ready(function() {
    var novaBlogPost = $("#new-blog-post");

    $("#add-blog-post").on("click", function(e) {
	novaBlogPost.stop();
	novaBlogPost.slideToggle();
	e.preventDefault();
    });

    EditorController.create({
	controls: "new-blog-post-text"
    });
});
