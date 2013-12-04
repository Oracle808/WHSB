/*
  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

*/
/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ exports.subject=function anonymous(locals,filters,escape,rethrow){escape=escape||function(html){return String(html).replace(/&(?!#?[a-zA-Z0-9]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/"/g,'&quot;');};var __stack={lineno:1,input:"<html>\n\t<head>\n\t  <title><%= subject.name %></title>\n\t</head>\n\t<body>\n\t  <header>\n\t    <% include ../index/nav.ejs %>\n\t  </header>\n\t  <main>\n\t    <ul>\n\t      <li class=\"active\">Posts</li>\n\t      <% if(subject.vocab_quizzes.length != 0) { %>\n              <li>Vocab Quizzes</li>\n\t      <% } %>\n\t      <li>Student Resources</li>\n\t    </ul>\n\t  </main>\n\t</body>\n</html>\n",filename:"app/subject/subject.ejs"};function rethrow(err,str,filename,lineno){var lines=str.split('\n'),start=Math.max(lineno-3,0),end=Math.min(lines.length,lineno+3);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?' >> ':'    ')
+curr
+'| '
+line;}).join('\n');err.path=filename;err.message=(filename||'ejs')+':'
+lineno+'\n'
+context+'\n\n'
+err.message;throw err;}
try{var buf=[];with(locals||{}){(function(){buf.push('<html>\n <head>\n   <title>',escape((__stack.lineno=3,subject.name)),'</title>\n </head>\n <body>\n   <header>\n     '+(function(){var buf=[];buf.push('<nav role="navigation">\n<ul>\n<li><a href="">Apps</a></li>\n<li><a href="">Subjects</a></li>\n<li><a href="/logout">Logout</a></li>\n</ul>\n</nav>\n');return buf.join('');})()+'\n   </header>\n   <main>\n     <ul>\n       <li class="active">Posts</li>\n       ');__stack.lineno=12;if(subject.vocab_quizzes.length!=0){;buf.push('\n              <li>Vocab Quizzes</li>\n       ');__stack.lineno=14;};buf.push('\n       <li>Student Resources</li>\n     </ul>\n   </main>\n </body>\n</html>\n');})();}
return buf.join('');}catch(err){rethrow(err,__stack.input,__stack.filename,__stack.lineno);}}