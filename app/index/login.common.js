/*
  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

*/
/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ exports.login=function anonymous(locals,filters,escape,rethrow){escape=escape||function(html){return String(html).replace(/&(?!#?[a-zA-Z0-9]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/"/g,'&quot;');};var __stack={lineno:1,input:"<html>\n  <head>\n    <title>Login</title>\n    <link href=\"/login.min.css\" rel=\"stylesheet\"/>\n  </head>\n  <body>\n    <form action=\"/login\" method=\"post\">\n      <img src=\"/images/emblem.png\"/>\n      <h2>Login</h2>\n      <% if(locals.message) { %>\n      <span class=\"error\"><%= locals.message %></span>\n      <% } %>\n      <input type=\"text\" name=\"username\" placeholder=\"Username\"/><br/>\n      <input type=\"password\" name=\"password\" placeholder=\"Password\"/><br/>\n      <button>Login</button>\n    </form>\n  </body>\n</html>\n",filename:"app/index/login.ejs"};function rethrow(err,str,filename,lineno){var lines=str.split('\n'),start=Math.max(lineno-3,0),end=Math.min(lines.length,lineno+3);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?' >> ':'    ')
+curr
+'| '
+line;}).join('\n');err.path=filename;err.message=(filename||'ejs')+':'
+lineno+'\n'
+context+'\n\n'
+err.message;throw err;}
try{var buf=[];with(locals||{}){(function(){buf.push('<html>\n  <head>\n    <title>Login</title>\n    <link href="/login.min.css" rel="stylesheet"/>\n  </head>\n  <body>\n    <form action="/login" method="post">\n      <img src="/images/emblem.png"/>\n      <h2>Login</h2>\n      ');__stack.lineno=10;if(locals.message){;buf.push('\n      <span class="error">',escape((__stack.lineno=11,locals.message)),'</span>\n      ');__stack.lineno=12;};buf.push('\n      <input type="text" name="username" placeholder="Username"/><br/>\n      <input type="password" name="password" placeholder="Password"/><br/>\n      <button>Login</button>\n    </form>\n  </body>\n</html>\n');})();}
return buf.join('');}catch(err){rethrow(err,__stack.input,__stack.filename,__stack.lineno);}}