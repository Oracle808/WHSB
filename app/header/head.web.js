 module.exports = exports = function anonymous(locals, filters, escape, rethrow) {
escape = escape || function (html){
  return String(html)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};
var __stack = { lineno: 1, input: "<header class=\"fixed\">\n <nav class=\"top-bar\" data-topbar>\n  <div class=\"row\"> \n  <ul class=\"title-area\">\n    <li class=\"name\">\n      <h1><a href=\"#\">WHSB</a></h1>\n    </li>\n    <li class=\"toggle-topbar menu-icon\"><a href=\"#\"><span>Menu</span></a></li>\n  </ul>\n\n  <section class=\"top-bar-section\">\n    <!-- Right Nav Section -->\n    <ul class=\"right\">\n      <li class=\"has-dropdown\">\n        <a href=\"#userOptions\">{user.username} <span class=\"label round\">{user.role|c}</span></a>\n        <ul class=\"dropdown\" id=\"userOptions\">\n\t  <li><a href=\"/logout\">Logout</a></li>\n          <li><a href=\"/users\">Manages Users</a></li>\n\t  <li><a href=\"/users/nova\">Create a New User</a></li>\n\t  <li><a href=\"/subjects/nova\">Create a New Subject</a></li>\n        </ul>\n      </li>\n    </ul>\n\n    <!-- Left Nav Section -->\n    <ul class=\"left\">\n      <li><a href=\"/\">Classes</a></li>\n      <li><a href=\"/clubs\">Clubs</a></li>\n      <li><a href=\"/apps\">Apps</a></li>\n    </ul>\n  </section>\n  </div>\n </nav>\n</header>\n\n", filename: "/Users/Hashan/Dropbox/Sites/Styles53/app/header" };
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
 buf.push('<header class="fixed">\n <nav class="top-bar" data-topbar>\n  <div class="row"> \n  <ul class="title-area">\n    <li class="name">\n      <h1><a href="#">WHSB</a></h1>\n    </li>\n    <li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>\n  </ul>\n\n  <section class="top-bar-section">\n    <!-- Right Nav Section -->\n    <ul class="right">\n      <li class="has-dropdown">\n        <a href="#userOptions">{user.username} <span class="label round">{user.role|c}</span></a>\n        <ul class="dropdown" id="userOptions">\n	  <li><a href="/logout">Logout</a></li>\n          <li><a href="/users">Manages Users</a></li>\n	  <li><a href="/users/nova">Create a New User</a></li>\n	  <li><a href="/subjects/nova">Create a New Subject</a></li>\n        </ul>\n      </li>\n    </ul>\n\n    <!-- Left Nav Section -->\n    <ul class="left">\n      <li><a href="/">Classes</a></li>\n      <li><a href="/clubs">Clubs</a></li>\n      <li><a href="/apps">Apps</a></li>\n    </ul>\n  </section>\n  </div>\n </nav>\n</header>\n\n'); })();
} 
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
}