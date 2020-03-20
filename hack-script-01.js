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
};
