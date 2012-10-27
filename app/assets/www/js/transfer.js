var Controllers = Controllers || {};
Controllers.Transfer = can.Control({
  'init': function(element , options) {
      $("#submit").bind("tap", function(){
          var amount = element.find("#amount").val();
          alert("Bump your phones to transfer € "+amount);
      })
  }
})