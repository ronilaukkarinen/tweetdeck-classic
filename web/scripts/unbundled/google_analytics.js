/* Google Analytics Asynchronous Tracking */
/* For more information see here: */
/* http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-4790629-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    ga.setAttribute('async', 'true');
    var i = document.getElementsByTagName('script')[0]; i.parentNode.insertBefore(ga, i);
})();
