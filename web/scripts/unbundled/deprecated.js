var getURLParameter = function (name) {
    var paramsRegex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
    return decodeURIComponent((paramsRegex.exec(location.search) || [,""])[1].replace(/\+/g, '%20')) || null;
}

$(document).ready(function() {
    var appEnv = getURLParameter('appenv');
    var $macAppStoreButton = $('.js-mac-app-store');
    var $restartBrowser = $('.js-restart-browser');
    var $restartWindowsApp = $('.js-restart-windows');
    var $downloadWindowsApp = $('.js-win-download');

    switch (appEnv) {
        case 'mac':
            $macAppStoreButton.removeClass('is-hidden');
            $restartBrowser.addClass('is-hidden');
            $macAppStoreButton.click(function(){
                window.open('macappstore://itunes.apple.com/app/id485812721?mt=12');
            });
            break;
        case 'win':
            $restartBrowser.addClass('is-hidden');
            $restartWindowsApp.removeClass('is-hidden');
            $downloadWindowsApp.removeClass('is-hidden');
            $downloadWindowsApp.click(function(){
                window.open('http://www.tweetdeck.com/download/pc/latest');
            });
            break;
    }
});
