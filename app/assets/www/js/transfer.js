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
          var record = ndef.mimeMediaRecord("application/com.github.nfcash", nfc.stringToBytes(payload));
          var recordApp = ndef.record(0x04, [0x61,0x6e,0x64,0x72,0x6f,0x69,0x64,0x2e,0x63,0x6f,0x6d,0x3a,0x70,0x6b,0x67], [], nfc.stringToBytes("com.github.nfcash"));
          var url = nfc.stringToBytes("http://play.google.com/store/apps/details?id=com.github.nfcash");
          // 0 byte in the beginning means that the protocol is included in the URI
          url.unshift(0);
          var recordU = ndef.record(0x01, [0x55], [], url);
          //alert(nfc.stringToBytes("play.google.com/store/apps/details?id=com.github.nfcash"));

          nfc.share(
              [record, recordU, recordApp],
              function () {
                  navigator.notification.vibrate(100);
              },
              function () {
                  alert("Failed to share tag.");
              });
      });
  }
})
