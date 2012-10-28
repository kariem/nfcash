var Controllers = Controllers || {};
Controllers.Transfer = can.Control({
  'init': function(element , options) {
      $("#submit").button("disable");
      $("#amount").bind("keyup", function() {
          if(parseInt($(this).val())>0) $("#submit").button("enable");
          else $("#submit").button("disable");
      });
      $("#submit").bind("tap", function(){
          var amount = element.find("#amount").val();
          var name = window.localStorage.getItem("name") || "Donald Tump";
          //alert("Bump your phones to transfer € "+amount);
          // NFC Tag gets written
          var payload = "{ amount: "+amount+", name: '"+name+"', ";
          var methods = [];
          for(key in window.localStorage) {
            if(key.indexOf("account_") !== -1) {
                var account = $.parseJSON(window.localStorage.getItem(key));
                methods.push("{ type: '"+account.type+"', data: '"+account.iban+"' }");
            }
          }
          payload += "methods: ["+methods.join(", ") + "] }";
          //alert(payload);
          var record = ndef.mimeMediaRecord("application/vnd.nfcash", nfc.stringToBytes(payload));
          nfc.share(
              [record],
              function () {
                  navigator.notification.vibrate(100);
              },
              function () {
                  alert("Failed to share tag.");
              });
      });
  }
})
