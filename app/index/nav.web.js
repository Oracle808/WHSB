/*
  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

*/
/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ (function(){var module={exports:window};var exports=module.exports;exports.nav=function anonymous(locals,filters,escape,rethrow){escape=escape||function(html){return String(html).replace(/&(?!#?[a-zA-Z0-9]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/"/g,'&quot;');};var __stack={lineno:1,input:"<nav role=\"navigation\">\n<ul>\n<li><a href=\"\">Apps</a></li>\n<li><a href=\"\">Subjects</a></li>\n<li><a href=\"/logout\">Logout</a></li>\n</ul>\n</nav>\n",filename:"app/index/nav.ejs"};function rethrow(err,str,filename,lineno){var lines=str.split('\n'),start=Math.max(lineno-3,0),end=Math.min(lines.length,lineno+3);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?' >> ':'    ')
+curr
+'| '
+line;}).join('\n');err.path=filename;err.message=(filename||'ejs')+':'
+lineno+'\n'
+context+'\n\n'
+err.message;throw err;}
try{var buf=[];with(locals||{}){(function(){buf.push('<nav role="navigation">\n<ul>\n<li><a href="">Apps</a></li>\n<li><a href="">Subjects</a></li>\n<li><a href="/logout">Logout</a></li>\n</ul>\n</nav>\n');})();}
return buf.join('');}catch(err){rethrow(err,__stack.input,__stack.filename,__stack.lineno);}}})();