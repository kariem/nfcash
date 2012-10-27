var app = {
    // Application Constructor
    initialize: function() {
        //document.addEventListener('deviceready', app.onDeviceReady, false);
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
        app.transferController = new Controllers.Transfer($(app.selector.transfer));
        document.addEventListener('menubutton', function() { alert("Settings"); }, false);
        $("#settings-open").bind("tap", function(ev){
            app.showSettings();
        });
        // NFC Listener
        nfc.addMimeTypeListener(
          "application/vnd.nfcash",
          function(nfcEvent) {
            var data = nfc.bytesToString(nfcEvent.tag.ndefMessage[0].payload);
            alert(data);
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
            app.settingsController = new Controllers.Settings($(app.selector.settings));
        });
    },
    selector: {
        transfer: "#transfer",
        settings: "#settings"
    }
};
