var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
//        if(!app.transferController){
            app.transferController = new Controllers.Transfer($(app.selector.transfer));
//        }
//        document.addEventListener('menubutton', function() { alert("Settings"); }, false);
        $("#settings-open").bind("tap", function(ev){
            app.showSettings();
        });

        // NFC Listener
        nfc.addMimeTypeListener(
          "application/vnd.nfcash",
          function(nfcEvent) {
            var data = eval("("+nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload)+")");
            //alert(data.name);
            app.showPayment(data);

          },
          function() {
              console.log("Success.");
          },
          function() {
              console.log("Fail.");
          }
        );
    },
    showSettings: function(){
        $.mobile.changePage("settings.html",{
            transition: "slideup",
            changeHash: false
        });
        $('#settings').live('pageshow', function(event, ui) {
            new Controllers.Settings($(app.selector.settings));
        });
    },
    showPayment: function(data){
        $.mobile.changePage("payment.html",{
            transition: "slideup",
            changeHash: false
        });
        $('#payment').live('pageshow', function(event, ui) {
            new Controllers.Payment($(app.selector.payment), data);
        });
    },
    getAccounts: function(){
        var accounts = []
        for(key in window.localStorage){
            if(key.indexOf("account_") !== -1){
                var account = $.parseJSON(window.localStorage.getItem(key));
                accounts.push(account);
            }
        }
        return accounts;
    },
    selector: {
        transfer: "#transfer",
        settings: "#settings",
        payment: "#payment"
    }
};
