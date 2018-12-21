const PriceHelper = {
	writePrice: (value) => {
		return String(value).replace(/\./, ',');
	},
	readPrice: (value) => {
		return Number(String(value).replace(/,/, '.'));
	}
};

export default PriceHelper;