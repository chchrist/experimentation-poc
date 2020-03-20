window.onload = function() {
  /**
 * Track user's attributes
 * @type {Object}
 */
var criteriasTracker = {

	/**
	 * Cookies data
	 * @type {Object}
	 */
	cookies: {
		member: cookies.get('MEMBER_ID'),
		acquisition: cookies.get('acquisition')
	},

	/**
	 * Decoded acquisition cookie value
	 * @type {String}
	 */
	decodedAcquisition: '',

	/**
	 * Decode cookie
	 * Used from Mozilla MDN
	 * @param {String} input
	 * @returns {String}
	 */
	decodeBase64: function(input) {

		var output = '',
			chr1, chr2, chr3 = '',
			enc1, enc2, enc3, enc4 = '',
			i = 0,
			keyStr = 'ABCDEFGHIJKLMNOP' +
					 'QRSTUVWXYZabcdef' +
					 'ghijklmnopqrstuv' +
					 'wxyz0123456789+/' +
					 '=';

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

			chr1 = chr2 = chr3 = '';
			enc1 = enc2 = enc3 = enc4 = '';

		} while (i < input.length);

		return unescape(output);

	},

	/**
	 * Get channel type
	 * @returns {String}
	 */
	getChannelType: function() {

		var channel = '',
			otherValue = 'Other';

		// Other traffic
		if(!this.decodedAcquisition) {
			return otherValue;
		}

		// Try to read channel type
		try {

			channel =  this.decodedAcquisition.match(/channel_type=([^&]*)/i)[1].toLowerCase();
			channel = channel.replace(/\W/gi, '');

		} catch(e) {

			return otherValue;

		}

		// Detect channel type
		switch(true) {

			// Paypal traffic
			case channel === 'media' && this.decodedAcquisition.indexOf('publisher_id=1156894') !== -1:
				return 'Paypal';

			// Media traffic
			case channel === 'media':
				return 'Media';

			// Affiliate traffic
			case channel === 'affiliate':
				return 'Affiliate';

			// PPC traffic
			case channel === 'ppc':
				return 'PPC';

			// Other traffic
			default:
				return otherValue;

		}

	},

	/**
	 * Get registered user type
	 * @returns {String}
	 */
	getRegisteredType: function() {

		return this.cookies.member ? 'Registered' : 'Not Registered';

	},

	/**
	 * Get publisher ID
	 * @returns {String}
	 */
	getPublisherID: function() {

		try {

			var id = this.decodedAcquisition.match(/publisher_id=([^&]*)/i)[1];

			id = id.replace(/\W/gi, '');

			return id;

		} catch(e) {

			return 'No ID';

		}

	},

	/**
	 * Get keyword ID
	 * @returns {String}
	 */
	getKeywordID: function() {

		try {

			var id = this.decodedAcquisition.match(/keyword_id=([^&]*)/i)[1];

			id = id.replace(/\W/gi, '');

			return id;

		} catch(e) {

			return 'No ID';

		}

	},

	/**
	 * Set user's attributes
	 */
	setUserAttrs: function() {

		visitor.storeAttr('Acquisition', this.getChannelType());
		visitor.storeAttr('RegisteredUser', this.getRegisteredType());
		visitor.storeAttr('PUBLISHER_ID', this.getPublisherID());
		visitor.storeAttr('KEYWORD_ID', this.getKeywordID());

	},

	/**
	 * Init tracking
	 */
	init: function() {

		try {

			this.decodedAcquisition = (
				this.decodeBase64(this.cookies.acquisition) || ''
			).toLowerCase();

		} catch(e) {} finally {

			this.setUserAttrs();

		}

	}

};


// Init tracking
criteriasTracker.init();


/*!
 *	GoogleUniversal 1.0.7
 *	-- Maxymiser Google Universal Analytics integration
 *	-- Built on 2018-07-26
 */

(function() {
  var GU = {
      version: '1.0.7',

      campaignRequired: true,

      timeout: 7000,

      validate: function(integration) {
          //if (!integration.dimension) {
          //    return helpers.errors.missingDimension;
          //}
          if (integration.dimension && !helpers.isDimension(integration.dimension)) {
              return helpers.errors.invalidDimension(integration.dimension);
          }
          return true;
      },

      check: function(integration) {
          // use provided variable, or defined variable, or default 'ga'
          var ga = window[integration.gaVariable] || window[window.GoogleAnalyticsObject] || window.ga;
          return ga && typeof ga.getAll === 'function';
      },

      exec: function(integration) {
          return helpers.send(integration);
      }
  };
  var helpers = {
      errors: {
          missingAccount: 'Missing Google Universal Account Number',
          invalidAccount: function(account) {
              return 'Invalid Google Universal Account Number provided [' + account.toString() + ']';
          },
          missingDimension: 'Missing Google Universal Dimension',
          invalidDimension: function(dimension) {
              return 'Invalid Google Universal Dimension provided [' + dimension.toString() + ']';
          }
      },
      send: function(integration) {
          var mode = integration.isProduction ? 'Maxymiser' : 'Maxymiser QA',
              ga = window[integration.gaVariable] || window[window.GoogleAnalyticsObject] || window.ga,
              namespace = '';

          integration.campaignExperience = integration.campaign.getName() + '=' + integration.campaignExperience;

          if (integration.persist) {
              integration.campaignExperience = helpers.getPersist(integration).campaignInfo;
          }

          if (integration.account) {
              namespace = 'mm_' + integration.account.replace(/\W/g, '');
              ga('create', integration.account, 'auto', {
                  'name': namespace
              });
              if (integration.dimension) {
                ga(namespace + '.set', 'dimension' + integration.dimension, integration.campaignExperience);
              }
              ga(namespace + '.send', 'event', mode, integration.campaignExperience, integration.campaignExperience, {
                  'nonInteraction': 1
              });
          } else {
              var tr = ga.getAll(),
                  trCnt = tr.length,
                  gtmName;

              while (trCnt--) {
                  gtmName = tr[trCnt].get('name');

                  if ((/^gtm/).test(gtmName)) {
                      namespace = tr[trCnt].get('name') + '.';
                  }
              }

              if (integration.dimension) {
                ga(namespace + 'set', 'dimension' + integration.dimension, integration.campaignExperience);
              }
              ga(namespace + 'send', 'event', mode, integration.campaignExperience, integration.campaignExperience, {
                  'nonInteraction': 1
              });
          }

          return true;
      },

      getPersist: function(integration) {
          var config = {
                  maxDataSize: 150,
                  cookieName: 'mm-if-site-persist-ua-' + integration.dimension
              },

              data = {
                  campaign: integration.campaign.getName(),
                  campaignInfo: integration.campaignExperience
              },

              getCampaignIndex = function(dataArr) {
                  var i;

                  for (i = dataArr.length; i--;) {
                      if (new RegExp('(' + data.campaign + ')' + '=').test(dataArr[i])) {
                          return i;
                      }
                  }

                  return -1;
              },

              concatCampaigns = function() {
                  var storedInfo = getFromStorage(config.cookieName),
                      parsedInfo = storedInfo ? JSON.parse(storedInfo) : [],
                      i = getCampaignIndex(parsedInfo);

                  if (i !== -1) {
                      parsedInfo[i] = data.campaignInfo;
                  } else {
                      parsedInfo.push(data.campaignInfo);
                  }

                  return parsedInfo.join('&');
              },

              getFromStorage = function() {
                  return cookies.get(config.cookieName);
              },

              saveToStorage = function(concatData) {
                  var concatDataArr = concatData.split('&');
                  cookies.set(config.cookieName, JSON.stringify(concatDataArr), {expires: 365}); 
              },

              removeOldestCampaigns = function(concatData) {
                  var parsedData = concatData.split('&');
                  var flag = true;

                  while (flag) {
                      if (parsedData.join('&').length >= config.maxDataSize) {
                          parsedData.shift();
                      } else {
                          flag = false;
                          return parsedData.join('&');
                      }
                  }
              },

              updateCampaignInfo = function(concatData) {
                  data.campaignInfo = concatData;
              };

          return (function() {
              var concatData = concatCampaigns();

              concatData = removeOldestCampaigns(concatData);
              updateCampaignInfo(concatData);
              saveToStorage(concatData);

              return data;
          })();
      },

      isAccountNumber: function(account) {
          return account && /^UA-\d{5,}-\d{1,3}$/.test(account.toString());
      },

      isDimension: function(dimension) {
          return dimension && dimension > 0 && dimension <= 200;
      }
  };
  // Register and export
  if (typeof modules === 'object' && typeof modules.define === 'function') {
      modules.require('Integrations').register('Google Universal', GU);
  }
})();


/**
 * Listen "Copy" button click
 */
var listenCopyBtnClick = function() {

  var bridgeClicked = false;

  jQuery(document)
    .on('mouseup', '#global-zeroclipboard-html-bridge', function() {
      actions.send('Referral_Click', 1, 'Link');
      bridgeClicked = true;
    })
    .on('click', '#copy-button', function () {
      !bridgeClicked && actions.send('Referral_Click', 1, 'Link');
      bridgeClicked = false;
    });

},

/**
 * Save referrer count for future actions
 */
saveReferrerCount = function () {

  var count = 0,
    desktopEmailFields = jQuery('#referAFriendForm')
      .find('.referAFriendRow')
      .find('.referfriendName')
      .find('.refereeFieldWrapper')
      .find('input'),
    mobileEmailFields = jQuery('.referAFriendColContainer')
      .find('.referAFriendRow')
      .find('.referEmail')
      .find('input'),
    fields;

  fields = desktopEmailFields.length > 0 ? desktopEmailFields : mobileEmailFields;

  fields.each(function(index, field) {
    if(field.value) {
      count += 1;
    }
  });

  cookies.set('mm_referrer_count', count);

},

/**
 * Listen "Send Invite" button click
 */
listenSendInviteBtnClick = function () {

  var sendBtnSel = '#referAFriendForm .submitButton, .referAFriendColContainer .submitButton';

  // Remove old referrer count
  cookies.remove('mm_referrer_count');

  jQuery(document).on('click', sendBtnSel, function() {

    // Set postpone click action
    actions.postpone('Referral_Click', 1, 'Email');

    // Save referrers count
    saveReferrerCount();

  });

};


// Wait required nodes
when(function() {

return typeof window.jQuery === 'function';

}).done(function() {

listenCopyBtnClick();
listenSendInviteBtnClick();

});

};
