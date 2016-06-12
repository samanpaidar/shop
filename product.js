var mongoose = require('mongoose');
var Category = require('./category');
var fx = require('./fx');

var productSchema = {
	name: { type: String, required:true },
	//pictures must be start with "http://"
	pictures: [{ type: String, match: /^http:\/\//i }],
	price: {
		amount: { type: Number, 
			required: true,
			set: function (v) {
				this.internal.approximatePriceUSD =
					v / (fx()[this.price.currency] || 1);
				return v;
			}
		},
		//only 3 supported currencies for now
		currency: {
			type: String,
			enum: ['USD','EUR','GBP'],
			required: true,
			set: function (v) {
				// body...
				this.internal.approximatePriceUSD =
				 this.price.amount / (fx()[v] || 1);
			 	return v;
			}
		}
	},
	category: Category.categorySchema,
	internal: {
		approximatePriceUSD : Number
	}

};

module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;
var currencySymbols = {
	'USD': '$'
	'EUR': '€'
	'GBP': '£'
};

schema.virtual('displayPrice').get(function () {
	return currencySymbols[this.price.currency] +
	'' + this.price.amount;
});
schema.set('toObject',{ virtuals: true });
schema.set('toJson',{ virtuals: true });

module.exports = schema;