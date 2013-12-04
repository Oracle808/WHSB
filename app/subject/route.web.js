/*
  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

*/
/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ (function(){var module={exports:window};var exports=module.exports;var TS=require("../../scripts/Streams.common.js").TS;var subject=require("./subject.common.js").subject;var mongoose=require("mongoose");var Subject=mongoose.model("Subject");var SubjectController=TS.Resource.extend({name:"subject",get:function(req){var self=this;Subject.findById(req.id,function(err,doc){if(err)throw err;self.out.render(subject,{subject:doc});});}});exports.SubjectController=SubjectController;})();