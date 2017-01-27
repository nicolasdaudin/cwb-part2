var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */

router.get('/userlist',function(req,res){
	var db = req.db;
	var collection = db.get('userlist');
	collection.find({},{},function(e,docs){
		/*console.log(docs);*/
		res.json(docs);
	});
});

/*
 * POST to addUser
 */
 router.post('/adduser', function(req,res){
 	var db = req.db;
 	var collection = db.get('userlist');
 	collection.insert(req.body, function(err,result){
 		res.send(
 			(err === null) ? { msg:''} : {msg:err}
 		);
 	});
 });

module.exports = router;
