import React, { Component } from 'react';

class Ads extends Component {
 	componentDidMount() {
 		(window.adsbygoogle = window.adsbygoogle || []).push({});
 	}

	render() {
		return (
            <ins className="adsbygoogle"
                 style={{ display:'block' }}
                 data-ad-format="fluid"
                 data-ad-layout-key="-6s+ed+2g-1n-4q"
                 data-ad-client="ca-pub-8335314547116222"
                 data-ad-slot="2902925355"></ins>
		);
	}
}

export default Ads;