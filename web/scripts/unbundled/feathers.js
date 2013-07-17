TD.controller.feather.applyFeathers([
    {
        id: 12,
        patch: function () {
            TD.services.TwitterClient.prototype.INTERNAL_API_BASE_URL = TD.services.TwitterClient.prototype.API_BASE_URL;
        }
    },
    {
        id: 11,
        patch: function () {
            if (!TD.util.versionComparator
                || TD.util.versionComparator(TD.version, '2.5.3') === -1) {
                window.location.assign('https://web.tweetdeck.com/web/deprecated.html?appenv='
                    + TD.util.getAppEnv());
            }
        }
    },
    {
        id: 10,
        patch: function () {
            TD.controller.columnManager.DISPLAY_ORDER = _.reject(TD.controller.columnManager.DISPLAY_ORDER,
                function (column) {
                    return column.service == 'facebook';
                }
            );

            // Delay enough for accounts to be setup and logged in.
            _.delay(function () {
                var messages =  {
                    messages: [
                        {
                            message: {
                                id: 'facebook-account-removed2',
                                text: 'We\'ve removed Facebook integration from TweetDeck.',
                                colors : {
                                    foreground : '#555',
                                    background : '#b2d5ed'
                                },
                                actions : [{
                                    id : 'read-more',
                                    label : 'Read More',
                                    action : 'url-ext',
                                    url : 'https://blog.twitter.com/2013/update-tweetdeck'
                                }]
                            }
                        }
                    ]
                };
                var accounts;

                if (TD.storage.accountController.getAccountsForService) {
                    accounts = TD.storage.accountController.getAccountsForService('facebook');
                    if (accounts.length > 0) {
                        if (!TD.util.versionComparator ||
                            TD.util.versionComparator(TD.version, '2.7.6') == -1) {
                            _.each(accounts, function (account) {
                                TD.controller.clients.removeClient(account.getKey());
                            });

                            $(document).trigger('dataMessages', messages);
                        }
                    }
                }

                delete TD.storage.accountController.ACCEPTED_ACCOUNT_TYPES.facebook;

            }, 20000);
        }
    },
    {
        id: 8,
        patch: function () {
            if (TD.util.getAppEnv() !== 'mac') {
                return;
            }

            TD.services.StreamEngine.prototype._handleDataInternal = TD.services.StreamEngine.prototype._handleData;
            TD.services.StreamEngine.prototype._handleData = function (data) {
                if (data === '') {
                    return;
                }

                TD.services.StreamEngine.prototype._handleDataInternal.call(this, data);
            };

        }
    },
    {
        id: 7,
        patch: function () {
            if (TD.util.getAppEnv() !== 'win') {
                return;
            }
            var INSTAGRAM_RE = /(http:\/\/|www.)?instagr.am\/p\/[\w-]+(\/)/;
            if (TD.services.TwitterMedia) {
                delete TD.services.TwitterMedia.SERVICES['instagram'];
            } else if (TD.services.media) {
                var _looksLikeMediaUrl = TD.services.media.looksLikeMediaUrl;
                TD.services.media.looksLikeMediaUrl = function(url) {
                    if(url.match(INSTAGRAM_RE)) {
                        return false;
                    }
                    return _looksLikeMediaUrl(url);
                }
                var _getEmbedableContent = TD.services.media.getEmbedableContent;
                TD.services.media.getEmbedableContent = function(tweet, callback) {
                    var wrappedCallback = function (embed, dict) {
                        if (embed.provider_name === 'Instagr.am') {
                            return;
                        }
                        callback(embed, dict);
                    }
                    _getEmbedableContent(tweet, wrappedCallback);
                }
            }

        }
    },
    {
        id: 6,
        patch: function () {
            TD.services.StreamEngine.prototype._connect = function (url) {
                if (url === this._url) {
                    // Already connecting/connected to this url
                    // Do nothing
                    this.log('Connect', url, 'Already connecting/connected. Do nothing');
                    return;
                }

                if (url) {
                    this.log('Connect', url);
                    this.disconnect();
                    this._url = url;
                    this._startNewStream();
                } else {
                    // Nothing to stream. Disconnect.
                    this.log('Connect', url, 'Nothing to stream. Disconnecting');
                    this.disconnect();
                }
            };

            TD.services.StreamEngine.prototype.connect = function () {
                // Replace connect on this instance
                this.connect = _.debounce(this._connect, 50);

                // And call it
                this.connect.apply(this, arguments);
            };
        }
    }
]);
