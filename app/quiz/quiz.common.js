/*
  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

*/
/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ exports.quiz=function anonymous(locals,filters,escape,rethrow){escape=escape||function(html){return String(html).replace(/&(?!#?[a-zA-Z0-9]+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/"/g,'&quot;');};var __stack={lineno:1,input:"<!DOCTYPE html>\n<html lang=\"en-GB\">\n<head>\n\t<title>Styles53</title>\n\t<link href=\"./styles/test.css\" rel=\"stylesheet\"/>\n\t<script src=\"./scripts/test.js\"></script>\n</head>\n<body>\n\t<div class=\"row VocabularyQuiz\" id=\"Container\">\n\t\t<label>amicus</label><input type=\"text\" autofocus/>\n\t\t<label>dominus</label><input type=\"text\"/>\n\t\t<label>mercator</label><input type=\"text\"/>\n\t\t<label>nomen</label><input type=\"text\"/>\n\t\t<label>ludus</label><input type=\"text\"/>\n\t\t<label>argentaria</label><input type=\"text\"/>\n\t\t<label>genus</label><input type=\"text\"/>\n\t\t<label>leo</label><input type=\"text\"/>\n\t\t<label>canis</label><input type=\"text\"/>\n\t\t<label>homo</label><input type=\"text\"/>\n\t\t<label>coquus</label><input type=\"text\"/>\n\t\t<label>pater</label><input type=\"text\"/>\n\t\t<label>mater</label><input type=\"text\"/>\n\t\t<label>infans</label><input type=\"text\"/>\n\t\t<label>femina</label><input type=\"text\"/>\n\t\t<label>nauta</label><input type=\"text\"/>\n\t\t<label>agricola</label><input type=\"text\"/>\n\t\t<label>iuvenis</label><input type=\"text\"/>\n\t\t<label>senex</label><input type=\"text\"/>\n\t\t<label>turba</label><input type=\"text\"/>\n\t\t<label>schola</label><input type=\"text\"/>\n\t\t<label>divisor</label><input type=\"text\"/>\n\t\t<label>abest</label><input type=\"text\"/>\n\n\t</div>\n</body>\n</html>\n",filename:"app/quiz/quiz.ejs"};function rethrow(err,str,filename,lineno){var lines=str.split('\n'),start=Math.max(lineno-3,0),end=Math.min(lines.length,lineno+3);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?' >> ':'    ')
+curr
+'| '
+line;}).join('\n');err.path=filename;err.message=(filename||'ejs')+':'
+lineno+'\n'
+context+'\n\n'
+err.message;throw err;}
try{var buf=[];with(locals||{}){(function(){buf.push('<!DOCTYPE html>\n<html lang="en-GB">\n<head>\n <title>Styles53</title>\n <link href="./styles/test.css" rel="stylesheet"/>\n <script src="./scripts/test.js"></script>\n</head>\n<body>\n <div class="row VocabularyQuiz" id="Container">\n  <label>amicus</label><input type="text" autofocus/>\n  <label>dominus</label><input type="text"/>\n  <label>mercator</label><input type="text"/>\n  <label>nomen</label><input type="text"/>\n  <label>ludus</label><input type="text"/>\n  <label>argentaria</label><input type="text"/>\n  <label>genus</label><input type="text"/>\n  <label>leo</label><input type="text"/>\n  <label>canis</label><input type="text"/>\n  <label>homo</label><input type="text"/>\n  <label>coquus</label><input type="text"/>\n  <label>pater</label><input type="text"/>\n  <label>mater</label><input type="text"/>\n  <label>infans</label><input type="text"/>\n  <label>femina</label><input type="text"/>\n  <label>nauta</label><input type="text"/>\n  <label>agricola</label><input type="text"/>\n  <label>iuvenis</label><input type="text"/>\n  <label>senex</label><input type="text"/>\n  <label>turba</label><input type="text"/>\n  <label>schola</label><input type="text"/>\n  <label>divisor</label><input type="text"/>\n  <label>abest</label><input type="text"/>\n\n </div>\n</body>\n</html>\n');})();}
return buf.join('');}catch(err){rethrow(err,__stack.input,__stack.filename,__stack.lineno);}}