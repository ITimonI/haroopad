define([
    // 'core/Renderer'
	], 
	function(/*Renderer*/) {
    var marked = require("marked");
    // var options = store.get('Markdown') || {};

    // var defaults = merge(marked.defaults, {
    //   renderer: Renderer
    // }, options);

    // var lexer = new marked.Lexer(defaults);

    var customRules = {
        math: /^ *(\${2,2}) *([\s\S]+?)\s*\1 *(?:\n+|$)/,
        oembed: /^@\[(inside)\]\(href\)/,
        toc: /^\[\s*(TOC|toc)(?:\s+['"]([\s\S]*?)['"])?\s*\] *(?:\n+|$)/
    }
    
    var _inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
    var _href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

    customRules.oembed = replace(customRules.oembed)
      ('inside', _inside)
      ('href', _href)
      ();

    function replace(regex, opt) {
      regex = regex.source;
      opt = opt || '';
      return function self(name, val) {
        if (!name) return new RegExp(regex, opt);
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return self;
      };
    }

  	function merge(obj) {
  	  var i = 1
  	    , target
  	    , key;

  	  for (; i < arguments.length; i++) {
  	    target = arguments[i];
  	    for (key in target) {
  	      if (Object.prototype.hasOwnProperty.call(target, key)) {
  	        obj[key] = target[key];
  	      }
  	    }
  	  }

  	  return obj;
  	}

    return function(options) {
      // var lexer = new marked.Lexer(defaults);
      var lexer = new marked.Lexer(options);
      var blocks;

      lexer.rules.paragraph = replace(lexer.rules.paragraph)
        ('math', customRules.math)
        ();

      lexer.rules = merge({}, lexer.rules, customRules);
      lexer.rules.pedantic = merge({}, lexer.rules.pedantic, customRules);
      lexer.rules.gfm = merge({}, lexer.rules.gfm, customRules);
      lexer.rules.tables = merge({}, lexer.rules.tables, customRules);

      
      // blocks = marked.Lexer.rules;
      // marked.setOptions(options);

      // if (options.tables) {
      //   lexer.rules = lexer.rules.tables;
      // } else {
      //   lexer.rules = lexer.rules.gfm;
      // }

      return lexer;
    }
    // window.ee.on('preferences.markdown.change', function(options) {
    //   var blocks = marked.Lexer.rules;

    //   marked.setOptions(options);

    //   if (options.tables) {
    //     lexer.rules = merge({}, blocks.tables, customRules);
    //   } else {
    //     lexer.rules = merge({}, blocks.gfm, customRules);
    //   }
      
    //   window.ee.emit('preferences.markdown.change.after');
    // });

    // return lexer;
});