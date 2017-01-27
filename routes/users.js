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

 /*
  * DELETE to deleteuser  
 */
 router.delete('/deleteuser/:id', function(req,res){
 	var db = req.db;
 	var collection = db.get('userlist');
 	var userToDelete = req.params.id;
 	collection.remove({'_id' : userToDelete}, function(err){
 		res.send((err === null) ? {msg:''} : {msg:'error : ' + err});
 	});
 });

/*
 * PUT to edit user
 */
router.put('/edituser', function(req,res) {
	var db = req.db;

	console.log("edit user");
	console.log(req.body);
	
	var collection = db.get('userlist');
	var userToEdit = req.body._id;
	collection.update({'_id' : userToEdit},req.body, function(err,result){
		if (err === null) {
			res.send({msg: ''});
		} else {
			console.log('error while editing : ' + err);
			res.send({msg : 'error : ' + err});
		}

	});
});

module.exports = router;


