 module.exports = exports = function anonymous(locals, filters, escape, rethrow) {
escape = escape || function (html){
  return String(html)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};
var __stack = { lineno: 1, input: "<x-bubble for=\"#newLink\" id=\"newLinkForm\" hidden>\n  <form action=\"/subjects/{subject._id}/links\" method=\"post\">\n    <input name=\"title\" placeholder=\"Title\" type=\"text\"/>\n    <input name=\"url\" placeholder=\"Url\" type=\"url\"/>\n    <button type=\"submit\">Submit</button>\n  </form>\n</x-bubble>\n<nav id=\"intraSubjectNavigation\">\n  <h4>{subject.subject_name} <small>{subject.teacher.username}</small></h4>\n  <form>\n    <input type=\"search\" placeholder=\"Search\"></input>\n  </form>\n  <ul>\n    \n    <li {@eq key=active value=\"blog\"}class=\"active\"{/eq}>\n      <a href=\"/subjects/{subject._id}\">\n\tBlog\n\t{@ne key=user.role value=\"student\"}\n\t  <a href=\"/subjects/{subject._id}?nova=true\" cite=\"#newPostForm\" title=\"New Blog Post\"><i class=\"fi-plus\"></i></a>\n\t{/ne}\n\t<a href=\"/subjects/{subject._id}/feed\" title=\"Get RSS Feed\"><i class=\"fi-rss\"></i></a>      \n      </a>      \n    </li>\n    \n    {?subject.vocab_quizzes}\n      <li {@eq key=active value=\"vocab_quizzes\"}class=\"active\"{/eq}><a href=\"/subjects/{subject._id}/vocab_quizzes\">Vocab Quizzes</a></li>\n    {/subject.vocab_quizzes}\n    \n    <li><a>Student Resources</a></li>\n\n    {?subject.links}\n      <li class=\"header\">Links</li>\n      {#subject.links}\n\t<li>\n\t  <a href=\"{url}\">{title}</a>\n\t  <form action=\"/subjects/{subject._id}/links/{_id}\" method=\"post\">\n\t    <input type=\"hidden\" name=\"_method\" value=\"delete\"/>\n\t    <button type=\"submit\"><i class=\"fi-x\"></i></button>\n\t  </form>\n\t</li>\n      {/subject.links}\n    {/subject.links}\n    <li><a id=\"newLink\" cite=\"#newLinkForm\">New Link</a></li>\n  </ul>\t\n</nav>\n", filename: "/Users/Hashan/Dropbox/Sites/Styles53/app/subjects" };
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
 buf.push('<x-bubble for="#newLink" id="newLinkForm" hidden>\n  <form action="/subjects/{subject._id}/links" method="post">\n    <input name="title" placeholder="Title" type="text"/>\n    <input name="url" placeholder="Url" type="url"/>\n    <button type="submit">Submit</button>\n  </form>\n</x-bubble>\n<nav id="intraSubjectNavigation">\n  <h4>{subject.subject_name} <small>{subject.teacher.username}</small></h4>\n  <form>\n    <input type="search" placeholder="Search"></input>\n  </form>\n  <ul>\n    \n    <li {@eq key=active value="blog"}class="active"{/eq}>\n      <a href="/subjects/{subject._id}">\n	Blog\n	{@ne key=user.role value="student"}\n	  <a href="/subjects/{subject._id}?nova=true" cite="#newPostForm" title="New Blog Post"><i class="fi-plus"></i></a>\n	{/ne}\n	<a href="/subjects/{subject._id}/feed" title="Get RSS Feed"><i class="fi-rss"></i></a>      \n      </a>      \n    </li>\n    \n    {?subject.vocab_quizzes}\n      <li {@eq key=active value="vocab_quizzes"}class="active"{/eq}><a href="/subjects/{subject._id}/vocab_quizzes">Vocab Quizzes</a></li>\n    {/subject.vocab_quizzes}\n    \n    <li><a>Student Resources</a></li>\n\n    {?subject.links}\n      <li class="header">Links</li>\n      {#subject.links}\n	<li>\n	  <a href="{url}">{title}</a>\n	  <form action="/subjects/{subject._id}/links/{_id}" method="post">\n	    <input type="hidden" name="_method" value="delete"/>\n	    <button type="submit"><i class="fi-x"></i></button>\n	  </form>\n	</li>\n      {/subject.links}\n    {/subject.links}\n    <li><a id="newLink" cite="#newLinkForm">New Link</a></li>\n  </ul>	\n</nav>\n'); })();
} 
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
}