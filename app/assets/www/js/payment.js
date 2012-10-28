var Controllers = Controllers || {};
Controllers.Payment = can.Control({
  'init': function(element , options) {
      element.find("#amount").text(options.amount);
      element.find("#name").text(options.n);
      var methods = element.find("#methods");
      var myAccounts = app.getAccounts();
      var payAccounts = $.grep(myAccounts, function(account){
          return (account.type == "beeone" || account.type == "paypal");
      });
      $.each(options.methods, function(i, method){
          var account;
          $.each(payAccounts, function(i, acc){
              var suitType = (method.type == "bank") ? "beeone" : method.type;
              if(acc.type == suitType){
                  account = acc;
                  return false;
              }
          });
          method.label = (method.type == "paypal") ? "PayPal" : "Bank transfer";
          if(account){
              methods.append(can.view("js/views/payment-method.ejs", {
                  account: account,
                  method: method
              }));
          } else {
              methods.append(can.view("js/views/payment-inactive.ejs", {
                  method: method
              }));
          }
          
      });
      $("#cancel").bind("tap", function(){
          
      });

      var that = this;
      $(".method").bind("tap", function(ev) {
          var element = $(ev.srcElement);
          var type =  element.data("paytype");
          var data = element.data("paydata");
          that.makeTransaction(type, data, options.amount)
      })
      
      this.element.trigger("create");
  },
  makeTransaction: function(type, data, amount){
      switch (type) {
      case "bank":
      case "beeone":
          var iban = data;
          amount = amount*100; // convert from euros to eurocents
          Models.beeone.transfer(iban, amount);
          break;
      case "paypal":
          // put paypal transaction code here
      default:
          console.log(type, " not supported");
      }
  }
})