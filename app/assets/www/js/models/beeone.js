var Models = Models || {};

var beeone = {
	config: {
		login: {
			username: "tester1",
			password: "pwd"
		},
		accountId: "1", // AT032011156172743372
        name: "John Doe",
    	url: "http://nfcash1.elasticbeanstalk.com/api"
	},
	prepareAjaxCalls: function() {
	    console.log("preparing ajax calls for beeone");
	    $.ajaxPrefilter(function(options) {
	        if (options.url.indexOf("/beeone") === 0) {
	            options.url = beeone.config.url + options.url.replace("/beeone", '');
                if (beeone.auth) { // if available add stored auth to request
                    $.extend(options, beeone.auth);
                }
	        }
	    });
	}
}
beeone.prepareAjaxCalls();

Models.beeone = Models.beeone || {};
$.extend(Models.beeone, {
	Login: {
	    create: function(data, success, error) {
	    	var data = $.extend(beeone.config.login, data);
	    	return $.ajax("/beeone/login", {
		    		type: "POST",
		            data: data,
		            success: function(userInfo, textStatus, jqXHR) {
		            	beeone.config.userId = userInfo.id;
                        beeone.auth = { headers: { "X-BeeOne-Auth": jqXHR.getResponseHeader("X-BeeOne-Auth")}}
		            	if (typeof success === "function") {
		            		success.apply(this, arguments);
		            	}
		            },
		            error: error
		    	})
	    },
	    destroy: function(success, error) {
	    	return $.ajax("/beeone/logout/" + beeone.config.userId, {
	    		type: "POST",
                success: function() {
                    delete beeone.config.userId;
                    delete beeone.config.auth;
                }
	    	})
	    }
	},
	
	/*
	Account: {
	    findAll: "/beeone/{userId}/accounts",
	    findOne: "/beeone/{userId}/accounts/{id}"
	},
	*/
	
	Transaction: {
		create: function(params, success, error) {
			return $.ajax(can.sub("/beeone/user/{userId}/accounts/{accountId}/transactions", params, true), {
                data: params,
				type: "POST",
                dataType: "json",
                contentType: "application/json",
				success: success,
				error: error
			})
		}
	},
	transfer: function(iban, amount) {
		var err = function() {
			console.log("somewhere along the way it failed: " + arguments);
		};
		Models.beeone.Login.create({},
			function(result) {
				var p = {
					userId: beeone.config.userId,
					accountId: beeone.config.accountId,
					amount: amount,
					createdOn: new Date().getTime(),
                    carryOutDate: new Date().getTime(),
                    senderName: 'sender',
                    senderIban: 'senderiban',
                    receiverName: 'recipient',
                    receiverIban: 'recipientIban',
                    purpose: 'purpose',
                    identification: 'id',
                    category: 'manual',
                    type: 'OUT'
				};
				Models.beeone.Transaction.create(p,
					function() {
						console.log("transaction created", arguments);
					}, err);
			}
		)
	}
})
