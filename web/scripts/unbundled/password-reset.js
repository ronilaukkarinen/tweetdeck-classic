var getURLParameter = function (name) {
    var paramsRegex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
    return decodeURIComponent((paramsRegex.exec(location.search) || [,""])[1].replace(/\+/g, '%20')) || null;
}

$(document).ready(function() {
    // wrong password reset link
    if (getURLParameter('hash') == null) {
        $('#send_link').show();
    }
    else {
        // JS presence check
        $('#reset_form').show();
        $('.reset_text').show();
    }
});

/*-------------------------------------
     Password reset form handling
------------------------------------- */

/* Validation
------------------------------------- */
function check_username()
{
    var username = $('#username').val();

    if (username == "") {
        $('#reset_alert').html('<p class="error">Please enter your e-mail address.</p>');
        $('#reset_alert').data('from', 'username');
        if (!$('#reset_alert').is(":visible"))
            $('#reset_alert').fadeIn();
        return false;
    }
    if ($('#reset_alert').is(":visible") && $('#reset_alert').data('from') == 'username')
        $('#reset_alert').fadeOut();
    return true;
}

function check_passwords()
{
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();

    if (password1.length < 7) {
        $('#reset_alert').html('<p class="error">Sorry, password needs to have 7 characters.</p>');
        $('#reset_alert').data('from', 'password');
        if (!$('#reset_alert').is(":visible"))
            $('#reset_alert').fadeIn();
        return false;
    }

    if (password1 != password2) {
        $('#reset_alert').html('<p class="error">Sorry, both passwords must match.</p>');
        $('#reset_alert').data('from', 'password');
        if (!$('#reset_alert').is(":visible"))
            $('#reset_alert').fadeIn();
        return false;
    }

    if ($('#reset_alert').is(":visible") && $('#reset_alert').data('from') == 'password')
        $('#reset_alert').fadeOut();
    return true;
}

/* Form submission handler
------------------------------------- */
$('#reset_form').submit(function (evt) {

    evt.preventDefault();

    if (!check_username()) return;
    if (!check_passwords()) return;

    var data = {};
    data.hash  = getURLParameter('hash');
    var json = JSON.stringify(data);

    var username = $('#username').val();
    var password = $('#password1').val();
    var token = username + ':' + TD.core.sha1(password);
    var basic_auth = TD.core.base64.encode(token);

    $.ajax({
      type: "POST",
      url: "/password-reset",
      beforeSend: function (xhr) { xhr.setRequestHeader ("Authorization", "x-td-basic " + basic_auth); },
      data: json,
      success: function(msg){
            $('#reset_alert').html('<p class="no_error">Your password has been changed. You can sign in to <a href="https://tweetdeck.twitter.com">the web app</a> or in your client.</p>');

            $('#reset_alert').stop();
            $('.reset_text').hide();
            $('#reset_form').hide();

            if (!$('#reset_alert').is(":visible"))
                $('#reset_alert').fadeIn();
            return;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
            var ret = $.parseJSON(XMLHttpRequest.responseText);

            var error = ret.error;

            if (ret.error == 'Invalid token.') {
                // Hides current form and shows the one for new link generation
                $('#send_info_text').html('Sorry, invalid reset link. Use the form below to generate a new one:');
                $('#send_link').show();
                $('.send_text').hide();
                $('#send_info_text').show();

                $('#reset_alert').stop();
                $('#reset_alert').hide();
                $('.reset_text').hide();
                $('#reset_form').hide();

                return;
            }

            $('#reset_alert').html('<p class="error">' + error + '</p>');

            $('#reset_alert').stop();

            if (!$('#reset_alert').is(":visible"))
                $('#reset_alert').fadeIn();

            return;
      }
    });
});
