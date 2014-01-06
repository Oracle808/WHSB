 module.exports = exports = function anonymous(locals, filters, escape, rethrow) {
escape = escape || function (html){
  return String(html)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};
var __stack = { lineno: 1, input: "<nav id=\"intraSubjectNavigation\">\n  <h4>{subject.subject_name} <small>{subject.teacher}</small></h4>\n  <form>\n    <input type=\"search\" placeholder=\"Search\"></input>\n  </form>\n  <ul>\n    \n    <li eq=\"null\" key=\"active\" value=\"blog\" class=\"active\" eq=\"null\">\n      <a href=\"/subjects/{subject._id}\">\n\tBlog\n\t{@ne key=user.role value=\"student\"}\n\t  <a href=\"/subjects/{subject._id}?nova=true\" cite=\"#newPostForm\" title=\"New Blog Post\"><i class=\"fi-plus\"></i></a>\n\t{/ne}\n\t<a href=\"/subjects/{subject._id}/feed\" title=\"Get RSS Feed\"><i class=\"fi-rss\"></i></a>      \n      </a>      \n    </li>\n    \n    {?subject.vocab_quizzes}\n      <li eq=\"null\" key=\"active\" value=\"vocab_quizzes\" class=\"active\" eq=\"null\"><a href=\"/subjects/{subject._id}/vocab_quizzes\">Vocab Quizzes</a></li>\n    {/subject.vocab_quizzes}\n    \n    <li><a>Student Resources</a></li>\n  </ul>\t\n</nav>\n", filename: "app/subjects/nav.dust" };
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
 buf.push('<nav id="intraSubjectNavigation">\n  <h4>{subject.subject_name} <small>{subject.teacher}</small></h4>\n  <form>\n    <input type="search" placeholder="Search"></input>\n  </form>\n  <ul>\n    \n    <li eq="null" key="active" value="blog" class="active" eq="null">\n      <a href="/subjects/{subject._id}">\n	Blog\n	{@ne key=user.role value="student"}\n	  <a href="/subjects/{subject._id}?nova=true" cite="#newPostForm" title="New Blog Post"><i class="fi-plus"></i></a>\n	{/ne}\n	<a href="/subjects/{subject._id}/feed" title="Get RSS Feed"><i class="fi-rss"></i></a>      \n      </a>      \n    </li>\n    \n    {?subject.vocab_quizzes}\n      <li eq="null" key="active" value="vocab_quizzes" class="active" eq="null"><a href="/subjects/{subject._id}/vocab_quizzes">Vocab Quizzes</a></li>\n    {/subject.vocab_quizzes}\n    \n    <li><a>Student Resources</a></li>\n  </ul>	\n</nav>\n'); })();
} 
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
}