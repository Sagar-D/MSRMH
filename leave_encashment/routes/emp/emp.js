var express = require('express');
var router = express.Router();

router.get('/emp/emp',onRequest);

function onRequest(request,response){

	console.log("Got a request for Employee...");

	if(request.session.username){
		response.render('emp/emp',null,null);
	}else{
		response.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
	}
	

	console.log(request.session);
	

}
module.exports = router;