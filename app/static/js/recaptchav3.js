grecaptcha.ready(function() {
  $('#add_form').submit(function(e){
      var form = this;
      e.preventDefault()
      grecaptcha.execute('6Lc3K-MUAAAAAJM2Ho9U4tiTIZp-A9PPeGIyyw5z', {action: 'add_form'}).then(function(token) {
          $('#recaptcha').val(token)
          form.submit()
      });
  })
});