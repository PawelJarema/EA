const PriceHelper = {
	write: (value) => {
		return String(value).replace(/\./, ',');
	},
	read: (value) => {
		return Number(String(value).replace(/,/, '.'));
	}
};

export default PriceHelper;