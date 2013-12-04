/*
  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

*/
/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ (function(){var module={exports:window};var exports=module.exports;exports.index=function anonymous(locals,filters,escape,rethrow){escape=escape||function(html){return String(html).replace(/&(?!#?[a-zA-Z0-9]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/"/g,'&quot;');};var __stack={lineno:1,input:"<!DOCTYPE html>\n<html lang=\"en-GB\">\n<head>\n\t<title>Styles53</title>\n\t<link href=\"./index.min.css\" rel=\"stylesheet\"/>\n\t<script src=\"./Streams.js\"></script>\n</head>\n<body>\n\t<header>\n\t\t<div class=\"row\">\n\t\t\t<h3>WHSB</h3>\n\t\t\t<form><input type=\"text\" placeholder=\"Search\" /></form>\n\t\t\t<% include ./nav.ejs %>\n\t\t</div>\n\t</header>\n\t<main class=\"row\">\n\t\t<div id=\"AppLattice\">\n\t\t  <% subjects.forEach(function(subject) { %>\n\t\t  <a href=\"/subject/<%= subject._id %>\">\n\t\t    <img src=\"/icons/<%= subject.subject_name %>.png\"/>\n\t\t  </a>\n\t\t  <% }); %>\n\t\t</div>\n\t</main>\n\t<footer class=\"row\"></footer>\n</body>\n</html>\n",filename:"app/index/index.ejs"};function rethrow(err,str,filename,lineno){var lines=str.split('\n'),start=Math.max(lineno-3,0),end=Math.min(lines.length,lineno+3);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?' >> ':'    ')
+curr
+'| '
+line;}).join('\n');err.path=filename;err.message=(filename||'ejs')+':'
+lineno+'\n'
+context+'\n\n'
+err.message;throw err;}
try{var buf=[];with(locals||{}){(function(){buf.push('<!DOCTYPE html>\n<html lang="en-GB">\n<head>\n <title>Styles53</title>\n <link href="./index.min.css" rel="stylesheet"/>\n <script src="./Streams.js"></script>\n</head>\n<body>\n <header>\n  <div class="row">\n   <h3>WHSB</h3>\n   <form><input type="text" placeholder="Search" /></form>\n   '+(function(){var buf=[];buf.push('<nav role="navigation">\n<ul>\n<li><a href="">Apps</a></li>\n<li><a href="">Subjects</a></li>\n<li><a href="/logout">Logout</a></li>\n</ul>\n</nav>\n');return buf.join('');})()+'\n  </div>\n </header>\n <main class="row">\n  <div id="AppLattice">\n    ');__stack.lineno=18;subjects.forEach(function(subject){;buf.push('\n    <a href="/subject/',escape((__stack.lineno=19,subject._id)),'">\n      <img src="/icons/',escape((__stack.lineno=20,subject.subject_name)),'.png"/>\n    </a>\n    ');__stack.lineno=22;});;buf.push('\n  </div>\n </main>\n <footer class="row"></footer>\n</body>\n</html>\n');})();}
return buf.join('');}catch(err){rethrow(err,__stack.input,__stack.filename,__stack.lineno);}}})();