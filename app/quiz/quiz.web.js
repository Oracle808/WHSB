module.exports = exports = function anonymous(locals, filters, escape, rethrow) {
escape = escape || function (html){
  return String(html)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};
var __stack = { lineno: 1, input: "<!DOCTYPE html>\n<html lang=\"en-GB\">\n  <head>\n    <title>Styles53</title>\n    <style type=\"text/css\"></style>\n  <script type=\"text/javascript\">;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require==\"function\"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error(\"Cannot find module '\"+n+\"'\")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require==\"function\"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){\n\n\n},{}]},{},[1])\n;</script></head>\n  <body>\n    <main-quiz class=\"row\" id=\"Container\">\n      <h1><%= doc.title %></h1>\n      <% for(var question in doc.body) { %>\n      <label><%= question %></label><input data-answer=\"<%= doc.body[question] %>\"/>\n      <% } %>\n    </main-quiz>\n</body>\n</html>\n", filename: "app/quiz/quiz.ejs" };
function rethrow(err, str, filename, lineno){
  var lines = str.split('\n')
    , start = Math.max(lineno - 3, 0)
    , end = Math.min(lines.length, lineno + 3);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;
  
  throw err;
}
try {
var buf = [];
with (locals || {}) { (function(){ 
 buf.push('<!DOCTYPE html>\n<html lang="en-GB">\n  <head>\n    <title>Styles53</title>\n    <style type="text/css"></style>\n  <script type="text/javascript">;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module \'"+n+"\'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){\n\n\n},{}]},{},[1])\n;</script></head>\n  <body>\n    <main-quiz class="row" id="Container">\n      <h1>', escape((__stack.lineno=13,  doc.title )), '</h1>\n      ');__stack.lineno=14; for(var question in doc.body) { ; buf.push('\n      <label>', escape((__stack.lineno=15,  question )), '</label><input data-answer="', escape((__stack.lineno=15,  doc.body[question] )), '"/>\n      ');__stack.lineno=16; } ; buf.push('\n    </main-quiz>\n</body>\n</html>\n'); })();
} 
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
}