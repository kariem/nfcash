var Controllers = Controllers || {};
Controllers.Transfer = can.Control({
  'init': function(element , options) {
      this.element.html(can.view( 'js/views/transfer.ejs', {} ) );
  },
  "#submit click": function(el, ev){
      var amount = this.element.find("#amount").val();
      alert("Bump your phones to transfer € "+amount);
  }
})