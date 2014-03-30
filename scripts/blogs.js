var dust = require("dustjs-linkedin/lib/dust");
dust.helper = require("dustjs-helpers");
var Backbone = require("backbone");
Backbone.$ = $;

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
	type: "rich"
    }
});

var EditorController = Backbone.View.extend({
    initialize: function(options) {
	this.state = new EditorState();
	this.listenTo(this.state, "change:type", this.render);
	this.render();
    },
    render: function() {
	dust.render(EditorView, this.state.toJSON(), (function(err, html) {
	    this.el.innerHTML = html;
	    console.log(this.state.get("type"));
	    this.$el.find("#editor-type").on("change", (function(e) {
		this.state.set("type", e.target.value);
	    }).bind(this));
	    if(this.state.get("type") == "rich") {
		console.log("hier");
		var options = ["bold", "underline", "italic", "insertOrderedList", "insertUnorderedList"];
		options.concat(["subscript", "superscript"]).forEach((function(c) {
		    this.$el.find("." + c).on("click", function(e) {
			document.execCommand(c);
			$(this).toggleClass("active");
			e.preventDefault();
		    });
		}).bind(this));
		this.$el.find("#editor").on("click keyup", function() {
		    options.forEach(function(c) {
			if(document.queryCommandState(c)) {
			    $("." + c).addClass("active");
			} else {
			    $("." + c).removeClass("active");
			}
		    });
		});
	    } else {
		$("a[aria-controls]").on("click", function() {
		    $(this).parent().siblings().removeClass("active");
		    $(this).parent().addClass("active");
		    var paneId = $(this).attr("aria-controls");
		    var pane = $("#" + paneId);
		    if(paneId === "preview") {
			pane.html("$$" + $("#editor").val() + "$$");
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, "preview"]);
		    }
		    pane.siblings().removeClass("active");
		    pane.addClass("active");
		});
		$("#editor").on("keyup", function() {
		    console.log($("#new-blog-post-text").val("$$" + $(this).val() + "$$").val());
		});
	    }
	}).bind(this));
    }
});

$(document).ready(function() {
    var novaBlogPost = $("#new-blog-post");
    $("#add-blog-post").on("click", function(e) {
	novaBlogPost.stop();
	novaBlogPost.slideToggle();
	e.preventDefault();
    });
    
    if(Modernizr.contenteditable) {
	$("#new-blog-post-text").before((new EditorController()).el);
    }
});
