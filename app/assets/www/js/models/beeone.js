var Models = Models || {};

var beeone = {
	config: {
		login: {
			username: "user",
			password: "verysecret"
		},
		accountId: "5655665656556665",
        name: "John Doe",
    	url: "http://nblighttest1.elasticbeanstalk.com/api"
	},
	prepareAjaxCalls: function() {
	    console.log("preparing ajax calls for beeone");
	    $.ajaxPrefilter(function(options) {
	        if (options.url.indexOf("/beeone") === 0) {
	            options.url = beeone.config.url + options.url.replace("/beeone", '');
	        }
	    });
	},
}
beeone.prepareAjaxCalls();

Models.beeone = Models.beeone || {};
$.extend(Models.beeone, {
	Login: can.Model({
	    create: function(data, success, error) {
	    	var data = $.extend(beeone.config.login, data);
	    	return $.ajax("/beeone/login", {
	    		type: "POST",
	            data: data,
	            succes: success,
	            error: error
	    	})
	    },
	    destroy : 'POST /beeone/logout/{id}'
	}, {}),
	
	Account: can.Model({
	    findAll: "/beeone/{userId}/accounts",
	    findOne: "/beeone/{userId}/accounts/{id}"
	}, {}),
	
	Transaction: can.Model({
		create: "/user/{userId}/accounts/{accountId}/transactions",
	}),
	transfer: function(iban, amount) {
		var err = function() {
			console.log("somewhere along the way it failed: " + arguments);
		};
		new Models.beeone.Login().save({},
			function(result) {
				console.log("Logged in. Result", result);
				var p = {
					userId: result.id,
					accountId: beeone.config.accountId,
					
					amount: amount,
					createdOn: new Date()
				};
				var userId = result.id;
			}, 
			err
		)
	}	
})
