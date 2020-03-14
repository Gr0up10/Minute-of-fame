grecaptcha.ready(function() {
  $('#add_form').submit(function(e){
      var form = this;
      e.preventDefault()
      grecaptcha.execute('6LetidkUAAAAABFq06Yj16QMvjIpfRulOuOg40xR', {action: 'add_form'}).then(function(token) {
          $('#recaptcha').val(token)
          form.submit()
      });
  })
});