$(document).ready(function() {
    // JS presence check
    $('#delete_form').show();
});

/*-------------------------------------
     Delete account form handling
------------------------------------- */

/* Validation
------------------------------------- */
function check_form()
{
    if (!check_username())  return false;
    if (!check_password())  return false
;    return true;
}

function check_username()
{
    var username = $('#username').val();

    if (username == "") {
        $('#delete_alert').html('<p class="error">Please enter your e-mail address.</p>');
        $('#delete_alert').data('from', 'username');
        if (!$('#delete_alert').is(":visible"))
            $('#delete_alert').fadeIn();
        return false;
    }
    if ($('#delete_alert').is(":visible") && $('#delete_alert').data('from') == 'username')
        $('#delete_alert').fadeOut();
    return true;
}

function check_password()
{
    var password = $('#password').val();

    if (password == "") {
        $('#delete_alert').html('<p class="error">Please enter your password.</p>');
        $('#delete_alert').data('from', 'password');
        if (!$('#delete_alert').is(":visible"))
            $('#delete_alert').fadeIn();
        return false;
    }
    if ($('#delete_alert').is(":visible") && $('#delete_alert').data('from') == 'password')
        $('#delete_alert').fadeOut();
    return true;
}

/* Form submission handler
------------------------------------- */
$('#delete_form').submit(function (evt) {

    evt.preventDefault();

    if (!check_form()) return;

    var username = $('#username').val();
    var password = $('#password').val();

    var token = username + ':' + TD.core.sha1(password);
    var basic_auth = TD.core.base64.encode(token);

    $.ajax({
      type: "POST",
      url: "/account-delete",
      data: {},
      beforeSend: function (xhr) { xhr.setRequestHeader ("Authorization", "x-td-basic " + basic_auth); },
      success: function(msg){
            $('#delete_alert').html('<p class="no_error">Ok. Your account has been deleted.<br />Please come back again in the future!</p>');

            $('#delete_alert').stop();
            $('.info_text').hide();
            $('#delete_form').hide();

            $('h3').css('text-align', 'center');
            $('.no_error').css('text-align', 'center');

            if (!$('#delete_alert').is(":visible"))
                $('#delete_alert').fadeIn();
            return;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
            var ret = $.parseJSON(XMLHttpRequest.responseText);

            var error = ret.error;

            if (error == 'BadPassword')
                error = 'Sorry the supplied password is incorrect.';

            if (error == 'Account does not exist.')
                error = 'Sorry the supplied account does not exist.';

            $('#delete_alert').html('<p class="error">' + error + '</p>');

            $('#delete_alert').stop();

            if (!$('#delete_alert').is(":visible"))
                $('#delete_alert').fadeIn();
            return;
      }
    });
});
