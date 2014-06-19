/*-------------------------------------
  Send a new reset link form handling
------------------------------------- */

/* Validation
------------------------------------- */
function check_send_username()
{
    var username = $('#send_username').val();

    if (username == "") {
        $('#send_alert').html('<p class="error">Please enter your e-mail address.</p>');
        if (!$('#send_alert').is(":visible"))
            $('#send_alert').fadeIn();
        return false;
    }
    if ($('#send_alert').is(":visible"))
        $('#send_alert').fadeOut();
    return true;
}

/* Form submission handler
------------------------------------- */
$('#send_form').submit(function (evt) {

    evt.preventDefault();

    if (!check_send_username()) return;

    var username = $('#send_username').val();
    var token = username + ':' + TD.core.sha1('junk'); // :)
    var basic_auth = TD.core.base64.encode(token);

    $.ajax({
      type: "DELETE",
      url: "/password",
      beforeSend: function (xhr) { xhr.setRequestHeader ("Authorization", "x-td-basic " + basic_auth); },
      data: {},
      success: function(msg){
            $('#send_alert').html('<p class="no_error">A new password reset link has been sent, please check your inbox.</p>');

            $('#send_alert').stop();
            $('.send_text').hide();
            $('#send_form').hide();

            if (!$('#send_alert').is(":visible"))
                $('#send_alert').fadeIn();
            return;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
            var ret = $.parseJSON(XMLHttpRequest.responseText);

            var error = ret.error;

            $('#send_alert').html('<p class="error">' + error + '</p>');

            $('#send_alert').stop();

            if (!$('#send_alert').is(":visible"))
                $('#send_alert').fadeIn();

            return;
      }
    });
});
