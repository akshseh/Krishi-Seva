exports.logout = function(req, res)
{	
	req.session.destroy();
	res.redirect("/");
};


exports.login = function(req, res)
{
	if(req.session.admin)
		res.redirect("/admin/dashboard");
	else if(req.session.farmer)
		res.redirect("/farmer/dashboard");
	else
		res.render("login");

};

exports.loginAdmin = function(req, res)
{
	var input = JSON.parse(JSON.stringify(req.body));
	if(input.username == 7053937100 && input.password == 'iamadmin')
	{
		req.session.admin = input.username;
		
		res.json({ success : true , redir : "/admin/dashboard"});
	}
	else
	{
		if(req.session.admin)
			res.json({ success : true , redir : "/admin/dashboard"});
		else if(req.session.farmer)
			res.json({ success : true , redir : "/farmer/dashboard"});
		else
			res.json({message : "invalid credentials" , success : false});
	}
};


exports.Register = function(req, res)
{
	if(req.session.admin || req.session.farmer)
	{
		return res.redirect("/");
	}
	else
	{
		res.render("register");
	}

};

exports.savenewFarmer = function(req, res)
{
	if(req.session.admin || req.session.farmer)
	{
		return res.json({ success : true , redir : "/"});
	}
	else
	{
		req.getConnection(function(err,connection)
		{
			var input = JSON.parse(JSON.stringify(req.body));

			if(phoneValidation(input.phone) == false)
			 {
			 	return res.json({message : "invalid phone number" , success: false});
			 }


			 if(validateinputLength(input.password)== false)
			 {

			 	return res.json({message : "password should be of length >= 6 and <= 20" , success: false});
			 }
			 connection.query('SELECT * FROM farmers where phone = ?',[input.phone],function(err,rows)
			 {
			 	if(err)
			 	{
			 		console.log(err)
			 	}
			 	else
			 	{
			 		if(rows.length != 0)
			 		{
			 			if(rows[0].phone == input.phone)
			 				return res.json({message : "Phone Number already taken" , success: false});
			 		}
			 		else
			 		{
			 			var bCrypt = require('bcrypt-nodejs');
			 			var d  = new Date();
						var data = 
						{
							name : input.name,
							phone : input.phone,
							address : input.address,
							password : bCrypt.hashSync(input.password, bCrypt.genSaltSync(8), null),			
							created_at : d
						};

						connection.query('INSERT INTO farmers set ?',[data],function(err,rows)
						{
							if(err)
							{
								console.log(err)
							}
							else
							{
								console.log("farmer registered");
								var farmer = 
										{
											name : input.name,
											phone : input.phone,
											address : input.address,				
											created_at : d
										};
										req.session.farmer = farmer;
								res.json({ success : "true" , redir : "/farmer/dashboard"});
							}
						});
			 		}
			 	}

			 });
		});
	}
};

// exports.farmerLogin = function(req, res)
// {
// 	if(req.session.admin || req.session.farmer)
// 	{
// 		return res.redirect("/");
// 	}
// 	else
// 	{
// 		res.render("login");
// 	}
// };

exports.loginFarmer = function(req, res)
{
	if(req.session.admin || req.session.farmer)
	{
		return res.redirect("/");
	}
	else
	{
		req.getConnection(function(err,connection)
		{

			var input = JSON.parse(JSON.stringify(req.body));
			if((!isNaN(parseInt(input.username)) && isFinite(input.username)) && phoneValidation(parseInt(input.username)))
			{
				var bCrypt = require('bcrypt-nodejs');
				connection.query('SELECT * FROM farmers where phone = ?',[parseInt(input.username)],function(err,rows)
				{
					if(err)
					{
						console.log(err)
					}
					else
					{
						if(rows.length == 0)
						{
							res.json({message : "phone number not registered" , success : false});
						}
						else if(! bCrypt.compareSync(input.password,rows[0].password))
						{
							res.json({message : "wrong password" , success : false});
						}
						else
						{
										var farmer = 
										{
											farmer_id : rows[0].farmer_id,
											name : rows[0].name,
											phone : rows[0].phone,
											address : rows[0].address,
											age : rows[0].age,
											created_at : rows[0].created_at
										};
										req.session.farmer = farmer;
									res.json({ success : true , redir : "/farmer/dashboard"});
						}
					}
				});
			}
			else
			{
				res.json({message : "enter valid phone number or email" , success : false});
			}
			
		});
	}
};


exports.farmerDashboard = function(req, res)
{
	if(req.session.farmer)
	{
		res.redirect("/farmer/sell");
	}
	else
	{
		res.redirect("/");
	}

};

exports.adminDashboard = function(req,res)
{
	if(req.session.admin)
	{
		console.log("========================================")
		res.redirect("/admin/view/farmers");
	}
	else
	{
		res.redirect("/");
	}
};

exports.buy = function(req,res)
{
	if(req.session.farmer)
	{
		res.render("buy");
	}
	else
	{
		res.redirect('/');
	}
};


exports.sell = function(req,res)
{
	if(req.session.farmer)
	{
		res.render("sell");
	}
	else
	{
		res.redirect('/');
	}
};

exports.saveOperation = function(req,res)
{
	if(req.session.farmer)
	{
		var conversion=
		{
		  rice:30,
		  wheat:10,
		  maize :20,
		  crop:40,
		  amp:100,
		  ams:120,
		  urea:110,
		  pn:90
		};
		req.getConnection(function(err,connection)
		{
			var operation = req.params.operation;
			var input = JSON.parse(JSON.stringify(req.body));
			var data = {
				farmer_id : req.session.farmer.farmer_id,
				type : input.name,
				quantity : input.amt,
				price : input.amt * conversion[input.name],
				created_at  : new Date(),
				modified_at : new Date(),
				status : 'pending',
				operation : operation == 'buy' ? 1 : 2 
			};
			console.log(data);
			connection.query('INSERT into buynsell set ?',[data],function(err,rows)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					console.log("opeartaion successfull");
					res.redirect("/farmer/history");
				}
			});
		});
	}
	else
	{
		res.redirect("/");
	}
};

exports.viewOperations = function(req,res)
{
	if(req.session.farmer)
	{
		req.getConnection(function(err,connection)
		{
			connection.query('SELECT * FROM buynsell where farmer_id = ?',[req.session.farmer.farmer_id],function(err,rows)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					res.render("history",{data : rows});
				}

			});
		});
	}
	else if(req.session.admin)
	{
		req.getConnection(function(err,connection)
		{
			connection.query('SELECT * FROM buynsell ',function(err,rows)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					res.render("requests",{data : rows});
				}

			});
		});
	}
	else
	{
		res.redirect("/");
	}
};

exports.approveOperation = function(req,res)
{
	if(req.session.admin)
	{
		req.getConnection(function(err,connection)
		{
			var operation_id = req.params.operation_id;
			connection.query('SELECT * FROM buynsell where operation_id = ?',[operation_id],function(err,rows)
			{
				if(err)
				{
					console.log(err)
				}
				else if(rows.length == 0)
				{
					res.json("invalid operation id");
				}
				else
				{
					var data = 
					{
						modified_at : new Date(),
						status : 'approved'
					};
					connection.query('UPDATE buynsell set ? where operation_id = ? ',[data,operation_id],function(err,rows)
					{
						if(err)
						{
							console.log(err)
						}
						else
						{
							console.log("approved");
							res.redirect("/admin/view/requests");
						}
					});
				}
			});
		});
	}
	else
	{
		res.redirect("/");
	}

};

exports.denyOperation = function(req,res)
{
	if(req.session.admin)
	{
		req.getConnection(function(err,connection)
		{
			var operation_id = req.params.operation_id;
			connection.query('SELECT * FROM buynsell where operation_id = ?',[operation_id],function(err,rows)
			{
				if(err)
				{
					console.log(err)
				}
				else if(rows.length == 0)
				{
					res.json("invalid operation id");
				}
				else
				{
					var data = 
					{
						modified_at : new Date(),
						status : 'denied'
					};
					connection.query('UPDATE buynsell set ? where operation_id = ? ',[data,operation_id],function(err,rows)
					{
						if(err)
						{
							console.log(err)
						}
						else
						{
							console.log("denied");
							res.redirect("/admin/view/requests");
						}
					});
				}
			});
		});
	}
	else
	{
		res.redirect("/");
	}

};

exports.viewFarmers = function(req,res)
{
	if(req.session.admin)
	{
		req.getConnection(function(err,connection)
		{
			connection.query('SELECT * FROM farmers ',function(err,rows)
			{
				if(err)
				{
					console.log(err)
				}
				else
				{
					res.render("viewFarmers" ,{data : rows});
				}
			});
		});
		
	}
	else
	{
		res.redirect("/");
	}
};

exports.viewSchemes = function(req,res)
{
	if(req.session.farmer)
	{
		res.render("govt");
	}
	else
	{
		res.redirect("/");
	}
};

exports.help = function(req,res)
{
	if(req.session.farmer)
	{
		res.render("help");
	}
	else
	{
		res.redirect("/");
	}
}


















function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function phoneValidation(inputtxt)  
{  
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;  
  if(String(inputtxt).match(phoneno))  
     {  
       return true;  
     }  
   else  
     {    
       return false;  
     }  
}
function validateinputLength(inputtxt)
{
	if(String(inputtxt).length < 6 || String(inputtxt).length > 20 )
		return false;
	else
		return true;
}
function validateText(inputtxt)  
{   
  var regex = /^[a-zA-Z ]*$/;
  
  if(String(inputtxt).match(regex))  
     {  
       return true;  
     }  
   else  
     {    
       return false;  
     }  
}
function validatePurpose(inputtxt)  
{   
	var regex = /^[a-zA-Z0-9_ ]*$/;
  if(String(inputtxt).match(regex))  
     {  
       return true;  
     }  
   else  
     {    
       return false;  
     }  
}

function validateURL(str) {
  var pattern1 = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ ;// fragment locater
  if(!pattern1.test(str)) 
  {
    return false;
  } 
  else 
  {
    return true;
  }
}

function validateNumber(n) 
{
  return !isNaN(parseFloat(n)) && isFinite(n);
}