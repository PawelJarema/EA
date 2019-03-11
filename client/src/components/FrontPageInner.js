import React, { Component } from 'react';
import Auction from './auctions/Auction';

class FrontPageInner extends Component {
	constructor(props) {
		super(props);

		const { onMobile } = props;

		this.state = { items: [], itemCount: 0, itemsPerFetch: onMobile ? 6 : 30, allFetched: true };
		this.fetchItems = this.fetchItems.bind(this);
	}

	componentDidMount() {
		const { mode } = this.props;

		this.url = '/auction/front_page_auctions/' + mode;
		this.fetchItems();
	}

	componentDidUpdate() {
		setTimeout(() => {
			if (this.contentRef) {
				this.contentRef.scrollIntoView({ block: 'center', behavior: 'smooth' });
			}
		}, 500);
	}

	fetchItems() {
		const { itemCount, itemsPerFetch, allFetched } = this.state;

		if (this.url) {
			fetch(this.url, {
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
				body: JSON.stringify({ itemCount, itemsPerFetch })
			})
			.then(res => res.json())
			.then(array => this.setState(
				({ items, itemCount, itemsPerFetch }) => ({ 
					items: items.concat(array), 
					itemCount: itemCount + array.length, 
					allFetched: array.length < itemsPerFetch 
				})
			));
		}	
	}

	render() {
		const 
			{ items, allFetched } = this.state,
			{ mode } = this.props;

		return (
			<div ref={ (e) => this.contentRef = e } className={ 'front-page-more auctions-' + mode }>
				<div className="six-column flex-wrap">
					{
						items.map((auction, i) => (
							<div key={ `${ auction.title }_${ i }` } className="column">
								<Auction auction={ auction } />
							</div>
						))
					}
				</div>
				{
					!allFetched && <a className="link" onClick={ this.fetchItems }>Wczytaj więcej <i className="material-icons">arrow_right_alt</i></a>
				}
			</div>
		);
	}
}

export default FrontPageInner;