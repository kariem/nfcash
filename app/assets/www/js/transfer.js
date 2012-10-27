var Controllers = Controllers || {};
Controllers.Transfer = can.Control({
  'init': function(element , options) {
      $("#submit").bind("tap", function(){
          var amount = element.find("#amount").val();
          //alert("Bump your phones to transfer € "+amount);
          // NFC Tag gets written
          var record = ndef.mimeMediaRecord("application/vnd.nfcash", nfc.stringToBytes(amount));
          nfc.share(
              [record],
              function () {
                  navigator.notification.vibrate(100);
              },
              function () {
                  alert("Failed to share tag.");
              });
      });

      $("#received").bind("tap", function() {
          var info = { type: "iban", value: "123" };
          switch (info.type) {
              case "iban":
                  var iban = info.value;
                  var amount = this.amount;
                  Models.beeone.transfer(iban, amount);
                  break;
              default:
                  console.log(info.type, " not supported");
          }          
      })
  }
})