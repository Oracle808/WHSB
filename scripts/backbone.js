var dust = require("dustjs-linkedin/lib/dust");
dust.helper = require("dustjs-helpers");
var Backbone = require("backbone");
Backbone.$ = $;
var uu = require("underscore");

Backbone.Controller = Backbone.View.extend({
    render: function(options) {
	if(!options) {
	    options = {};
	}
	if(this.state) {
	    options = uu.extend(options, this.state.toJSON());
	}
	if(this.model) {
	    options = uu.extend(options, this.model.toJSON());
	}
	dust.render(this.template, options, (function(err, html) {
	    this.$el.html(html);
	    this.delegateEvents();
	    if(this.subviews) {
		this.subviews();
	    }
	}).bind(this));
	return this;
    },

    find: function(selector) {
	return this.$el.find(selector);
    },

    findById: function(id) {
	return this.find("#" + id);
    }

},
{
    create: function(options) {
	if(this.prototype.requires === undefined || this.prototype.requires !== false) {
	    console.log("foux");
	    var c = new this(options);
	    c.$el.addClass(this.prototype.className);
	    return c;
	}
    }
});

module.exports = Backbone;
