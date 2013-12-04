/*
  ___ ___     _____     _________  ___ ___     _____    _______   ._.
 /   |   \   /  _  \   /   _____/ /   |   \   /  _  \   \      \  | |
/    ~    \ /  /_\  \  \_____  \ /    ~    \ /  /_\  \  /   |   \ | |
\    Y    //    |    \ /        \\    Y    //    |    \/    |    \ \|
 \___|_  / \____|__  //_______  / \___|_  / \____|__  /\____|__  / __
       \/          \/         \/        \/          \/         \/  \/

*/
/* COPYRIGHT HASHAN PUNCHIHEWA (2013) */ (function(){var module={exports:window};var exports=module.exports;var DS=require("../scripts/Streams.common.js").DS;var User=require("./User.common.js").User;var Subject=require("./User.common.js").Subject;var mongoose=require("mongoose");mongoose.connect("mongodb://whsb:vertex@ds053718.mongolab.com:53718/pandora");var Database=new Object;Database.user=mongoose.model("User",User);Database.subject=mongoose.model("Subject",Subject);exports.Database=Database;})();