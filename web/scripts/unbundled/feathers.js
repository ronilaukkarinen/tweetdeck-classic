TD.controller.feather.applyFeathers([
    {
        id: 9,
        patch: function () {
            if (TD.util.versionComparator(TD.version, '2.5.0') === -1) {
                return;
            }

            // Save the old function in case we need it later
            TD.services.TwitterClient.prototype._getHomeTimeline = TD.services.TwitterClient.prototype.getHomeTimeline;

            TD.services.TwitterClient.prototype.getHomeTimeline = function (sinceID, maxID, count, callback, errback) {
                this.getTimeline('https://api.twitter.com/1/statuses/home_timeline.json', sinceID, maxID, count, callback, errback);
            };
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
