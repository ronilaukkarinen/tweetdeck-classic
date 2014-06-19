$(document).ready(function() {
    // Client detection
    if (navigator.platform && navigator.platform.indexOf('Mac') != -1) {
        $('#win-btn').hide();
        $('#mac-btn').show();
    }

    $('.js-one-click-install').on('click', function(event) {
        if (window.chrome) {
            event.preventDefault();
            chrome.webstore.install();
        }
    });
});