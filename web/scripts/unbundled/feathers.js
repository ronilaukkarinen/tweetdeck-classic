TD.controller.feather.applyFeathers([
    {
        id: 19,
        patch: function () {
            if (TD.util.emojify) {
                TD.util.emojify = function (text) {
                    return text;
                };
            }
        }
    },

    {
        id: 18,
        patch: function () {

            /*
             * Builds less than 3.5.8 have a bug where there are some code paths that do not
             * correctly remove the loading spinner from the native Mac wrapper.
             */
            if (TD.util.versionComparator(TD.version, '3.5.8') !== -1) {
                return;
            }

            if (TD.util.isWrapperApp() && deck.closeLoadingScreen) {
                deck.closeLoadingScreen();
            }
        }
    },
    {
        id: 17,
        patch: function () {
            /*
             * Change the copy on the sign in page, telling people that they no
             * longer can sign up for a TweetDeck account.
             * Only for clients prior to 3.5.0
             */
            if (TD.util.versionComparator(TD.version, '3.5.0') !== -1) {
                return;
            }

            var newTemplate =
                '<h3>Don\'t have a TweetDeck account?</h3>' +
                '<p class="frm-row">Your version of TweetDeck does not support the creation of new accounts. But we\'ve got you covered: </p>' +
                '<a class="frm-row" href="https://tweetdeck.com/">Upgrade to the latest version of TweetDeck</a>' +
                '<p class="frm-row txt-center">Or</p>' +
                '<p class="frm-row">Use TweetDeck on the web at <a href="https://tweetdeck.twitter.com">https://tweetdeck.twitter.com</a> - ' +
                'all you need is a Twitter account to get started.</p>';

            var template = TD.ui.template;
            var renderOrig = template.render;

            function patchInPlace($node) {
                $node.find('.srt-register-txt').html(newTemplate);
            }

            function patchTemplate(html) {
                var $node = $(html);
                patchInPlace($node);
                return $node.html();
            }

            function renderPatched(file) {
                var result = renderOrig.apply(this, arguments);
                if (file === 'startup/signin') {
                    result = patchTemplate(result);
                }

                return result;
            }

            // Patch the template rendering in case the template hasn't been
            // rendered yet.
            template.render = renderPatched;
            // Patch current document in case we've already rendered it.
            patchInPlace($(document.body));
        }
    },
    {
        id: 16,
        patch: function () {
            if (!TD.util.versionComparator ||
                TD.util.versionComparator(TD.version, '3.5.0') !== 0) {
                return;
            }

            var origUpdateSeenVersion = TD.components.NewFeaturesSplash.updateSeenVersion;

            function patchFeatureSplash() {
                var $text = $('.js-modal-panel .release-notes-header-subtitle');
                // Remove the article that had never been written.
                $text.find('a[href^="https://blog.twitter.com"]').remove();
            }

            TD.components.NewFeaturesSplash.updateSeenVersion = function () {
                patchFeatureSplash();
                origUpdateSeenVersion();
            };

            TD.components.NewFeaturesSplash.shouldShow = function () {
                var FOR_VERSION = TD.components.NewFeaturesSplash.FOR_VERSION,
                    prev = TD.settings.getPreviousSplashVersion();

                if (TD.storage.storeUtils.getCurrentAuthType() !== 'twitter') {
                    return false;
                }

                if (TD.util.versionComparator(FOR_VERSION, prev) !== 1) {
                    // FOR_VERSION <= prev
                    // This splash (or newer) has already been displayed. Do not show.
                    return false;
                }

                if (TD.util.versionComparator(TD.version, FOR_VERSION) === -1) {
                    // TD.version < FOR_VERSION:
                    // The splash is intended for a future client. Do not show.
                    return false;
                }

                return true;
            }
        }
    },
    {
        id: 15,
        patch: function () {
            if (TD.util.versionComparator &&
                TD.util.versionComparator(TD.version, '3.3.3') !== 0) {
                return;
            }

            var PREVIEW_IMAGE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMsAAADLCAAAAADlkDjvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxOEVGMUFGOTJFODgxMUUzOEQ5MURFN0E2QzQ0RjA4QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxOEVGMUFGQTJFODgxMUUzOEQ5MURFN0E2QzQ0RjA4QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE4RUYxQUY3MkU4ODExRTM4RDkxREU3QTZDNDRGMDhDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE4RUYxQUY4MkU4ODExRTM4RDkxREU3QTZDNDRGMDhDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+RYPa3wAAAc5JREFUeNrt2NGOgjAQhWHf/7FaRBSluiBCy3mXvXFXiG6WbLKRIf+5m/SmX9qkM91oPdlgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwYIFCxYsWLBgwbIay23v3Ti+uFq1XN1zPoxati8sPpmypOYSQgjh5F6lDCGEcG4GC5bg3ZzkafmW4GbmvHyLn2s5LN/y4jaFtuvbkNu3ZPXXSp0Zt+ziY6nPTVu2SVJT5nnZSIqZZUsrpeK+9zTtBKxZ9tJQjAoVdi21dPmpsmaJ0m5ySp1dizSM+8pJaczinyyyey5p0vjvpGjX0krVowpSY9dyHL+P2ySVdi0+Srd755x1Um/53T9IikfvnD9FTZ5Kg73lSZKGvh8k6Wi85z98N8pxb34W81UnSV3lVzBXOufz3K9jRrY776/p76Kca6mWb+nnHsxt+RZd/Xuu2L/8J/fl7xpfJhOWdwULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFix/yyc1Kor3O+31gwAAAABJRU5ErkJggg==';

            // For Safari 5.1 on OS X Lion, re-enable uploads and mock the
            // FileReader API we use to return a static image.
            if (!!window.File && !window.FileReader) {
                var hasFeatureOrig = TD.util.hasFeature;

                TD.util.hasFeature = function (feature) {
                    if (feature === 'fileapi') {
                        return true;
                    }
                    return hasFeatureOrig(feature);
                };

                window.FileReader = function () {
                    this.onload = null;
                };

                window.FileReader.prototype.readAsDataURL = function () {
                    if (!this.onload) {
                        return;
                    }

                    var event = {
                        target: {
                            result: PREVIEW_IMAGE_URL
                        }
                    };

                    this.onload(event);
                };
            }
        }
    },
    {
        id: 13,
        patch: function () {
            TD.services.TwitterClient.prototype.INTERNAL_API_BASE_URL = TD.services.TwitterClient.prototype.API_BASE_URL;
            TD.services.TwitterClient.prototype.API_V1_BASE_URL = TD.services.TwitterClient.prototype.API_BASE_URL;
        }
    },
    {
        id: 11,
        patch: function () {
            if (!TD.util.versionComparator
                || TD.util.versionComparator(TD.version, '2.5.3') === -1) {
                window.location.assign('https://tweetdeck.twitter.com/web/deprecated.html?appenv='
                    + TD.util.getAppEnv());
            }
        }
    }
]);
