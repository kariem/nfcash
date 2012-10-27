var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.transferController = new Controllers.Transfer($(app.selector.transfer));
        document.addEventListener('menubutton', app.showSettings, false);
        $("#settings-open").bind("tap", function(ev){
            app.showSettings();
        });
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
