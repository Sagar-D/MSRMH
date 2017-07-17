var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

router.get('/emp/verifyEncashment/:type',onRequest);

var obj={
	header : "",
	msg : ""
};

function onRequest(request,response){

	obj.header="";
	obj.msg="";

	console.log("Got a request for verifyEncashment...");
	if(request.session.username){
	mongoClient.connect("mongodb://localhost:27017/msrmh",function(err,db){

		if(err) throw err;

		var nls = 0;
		db.collection("empdetails").findOne({"_id" : request.session.username},function(err,result){

			if(err) throw err;

			var valid = false; 
			

			switch(request.params.type){
				case 'EL' : valid = verifyEL(result);
							nls = 30;
							break;
				case 'CL' : valid = verifyCL(result);
							nls = 5;
							break;
				case 'SL' : valid = verifySL(result);
							nls = 5;
							break;
			}

			if(valid){
				var date = new Date();
				var val = date.getMonth()+1;
				val += " ";
				val += date.getFullYear();	
				db.collection("requests").findOne({"_id" : val},function(err,r){
					if(err) throw err;

					
					var temp = r.requestlist;

					var duplicate = false;
					for(var i=0;i<temp.length;i++){
						if(temp[i].empId == request.session.username && temp[i].type == request.params.type){
							duplicate = true;

							obj.header = "You have already applied for "+request.params.type+" encashment."
							obj.msg = "For more details check for pending Encashment Requests in Apply Encashment Page."
							
							console.log("DUPLICATE!!!!")

							response.render('emp/verifyEncashment',{"obj" : obj},null);

						}
					}

					if(!duplicate){

						var req = {
						"empId" : request.session.username,
						"applicationDate" : date.getDate()+" "+val,
						"name" : result.name,
						"department" : result.department,
						"NoLeavesSurrendered" : nls,
						"type" : request.params.type,
						"approved" : false,
					}

						temp.push(req);
						console.log(temp)

						db.collection("requests").update({"_id" : val},{"requestlist" : temp},function(err,res){
							console.log(res);
							response.render('emp/verifyEncashment',{obj : obj},null);
						})
					}
				
				})
			}else{
				response.render('emp/verifyEncashment',{"obj" : obj},null);
			}

			

		})

	})

	}else{
		response.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
	}
	

	console.log(request.session);
	

}

function verifyEL(result){

	var d = new Date();

	if(!result.permanant){
		obj.header = "Sorry, Couldn't apply for EL Encashment"
		obj.msg = "Only Permanant Employees can apply for EL Encashment.<br> Your Employment Status : Temporary "
		return false;
	}
	else if(d.getDate()<5 || d.getDate()>20){
		obj.header = "Sorry, Couldn't apply for EL Encashment"
		obj.msg = "EL Encashment can only be applied from 5th to 20th of every month. "
		return false;
	}
	else if(result.leaveDetails.el.balance < 60){
		obj.header = "Sorry, Couldn't apply for EL Encashment"
		obj.msg = "Your EL balance is less than 60. "
		return false;
	}
	else{
		
		var arr = result.leaveDetails.el.previousEncashment.split(" ");

		if( (d.getFullYear() - arr[2] < 2) || (d.getFullYear() - arr[2] == 2 && d.getMonth() + 1 - arr[1] < 0) || (d.getFullYear() - arr[2] == 2 && d.getMonth() + 1 - arr[1] == 0 && d.getDate() - arr[0] < 0) ){
			obj.header = "Sorry, Couldn't apply for EL Encashment"
			obj.msg = "EL's can be encashed only once in 2 years.\n Your Previous EL Encashment : "+result.leaveDetails.el.previousEncashment;
			return false;
		}else{
			obj.header="Successfully Applied for EL Encashment";
			return true;
		}

	
	}
	

}

function verifyCL(result){
	
	var d = new Date();

	if(!result.permanant){
		obj.header = "Sorry, Couldn't apply for CL Encashment"
		obj.msg = "Only Permanant Employees can apply for CL Encashment.<br> Your Employment Status : Temporary "
		return false;
	}
	else if(d.getMonth() != 0 || (d.getDate()<5 && d.getMonth ==0) || (d.getDate()>20 && d.getMonth() ==0)){
		obj.header = "Sorry, Couldn't apply for EL Encashment"
		obj.msg = "CL Encashment can only be applied from 5th Jan to 20th Jan of every year. "
		return false;
	}
	else if(result.leaveDetails.cl.balance < 5){
		obj.header = "Sorry, Couldn't apply for CL Encashment"
		obj.msg = "Your don't have enough CL balance. "
		return false;
	}
	else if(result.leaveDetails.lop > 0 ){
		obj.header = "Sorry, Couldn't apply for CL Encashment"
		obj.msg = "You have "+result.leaveDetails.lop+" LOP's during previous year. "
		return false;
	}
	else{
		obj.header="Successfully Applied for CL Encashment";
		return true;
	}
	

}

function verifySL(result){
	
	var d = new Date();

	if(!result.permanant){
		obj.header = "Sorry, Couldn't apply for SL Encashment"
		obj.msg = "Only Permanant Employees can apply for SL Encashment.<br> Your Employment Status : Temporary "
		return false;
	}
	else if(d.getMonth() != 0 || (d.getDate()<5 && d.getMonth ==0) || (d.getDate()>20 && d.getMonth() ==0)){
		obj.header = "Sorry, Couldn't apply for EL Encashment"
		obj.msg = "SL Encashment can only be applied from 5th Jan to 20th Jan of every year. "
		return false;
	}
	else if(result.leaveDetails.sl.balance < 5){
		obj.header = "Sorry, Couldn't apply for SL Encashment"
		obj.msg = "Your don't have enough SL balance. "
		return false;
	}
	else if(result.leaveDetails.lop > 0 ){
		obj.header = "Sorry, Couldn't apply for SL Encashment"
		obj.msg = "You have "+result.leaveDetails.lop+" LOP's during previous year. "
		return false;
	}
	else{
		obj.header="Successfully Applied for SL Encashment";
		return true;
	}

}
module.exports = router;