import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as auctionActions from '../actions/auctionActions';
import './Filters.css';
import { applyToAuctions } from './Auctions.js';
import { DEFAULT } from '../constants/sort';

class Filters extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleInput = this.handleInput.bind(this);
		this.filterList = this.filterList.bind(this);
	}

	componentDidMount() {
		const { query, category, categories } = this.props;

		if (category) {
			if (category !== 'Szukaj Sprzedawcy' && category !== 'Kategorie')
				this.props.categoryCallback({ category: category });
		}

		if (category !== 'Szukaj Sprzedawcy') {
			this.setState({ title: query });
		} 

		setTimeout(this.filterList, 150);
	}

	componentWillUnmount() {
		if (this.filterListTimeout) {
			clearTimeout(this.filterListTimeout);
		}
	}

	componentWillReceiveProps(props) {
		if (props.page) {
			if (props.page !== this.props.page) {
				this.filterList();
				return;
			}
		}

		let change = false;

 		if (props.match && props.categories) {
			const { category, query }   = props.match.params,
				  { categories } 		= this.props;

			if (!categories)
				return;

			if (category !== this.props.match.params.category) {
				change = true;
			}

			if (query !== this.props.match.params.query || category !== this.props.match.params.category) {
				if(category !== 'Szukaj Sprzedawcy') {
					this.setState({ title: query });
				} else {
					this.setState({ seller: query });
				}
				change = true;
			}

			if (query !== this.props.match.params.query) {
				
			} else if (category !== this.props.match.params.category) {
				change = true;
			}

			if (change) {
				if (category !== 'Szukaj Sprzedawcy' && category !== 'Kategorie')
					this.props.categoryCallback({ category });
				else 
					this.props.categoryCallback({});
			}
		}

		if (props.categoryData && this.lastCatPropsUpdate !== props.categoryData.time) {
			this.lastCatPropsUpdate = props.categoryData.time;
			change = true;
		}

		if (props.per_page && this.props.per_page !== props.per_page) {
			change = true;
		}

		if (props.sort && this.props.sort !== props.sort) {
			if (props.sort !== DEFAULT) change = true;
		}

		if (change) {
			setTimeout(this.filterList, 50);
		}
	}

	filterList(props) {
		const { categoryData } = (props || this.props);

		if (this.filterListTimeout) {
			clearTimeout(this.filterListTimeout);
		}

		this.filterListTimeout = setTimeout(() => {
			const 	
				{ page, pages, per_page, sort } = this.props,
				formData  						= new FormData(this.formRef);

			formData.append('page', page);
			formData.append('per_page', per_page);
			formData.append('sort', sort);

			const categoryInfo = ['category', 'subcategory', 'subsubcategory'];
			if (categoryData) {
				for (let key in categoryData) {
					const value = categoryData[key];

					if (typeof value === 'string') {
						formData.append((categoryInfo.indexOf(key) !== -1 ? key : '_' + key), value);
					} else 
					if (typeof value === 'object') {
						for (let vKey in value) {
							const 
								k = '_' + key + '[' + vKey.split('_')[1] + ']',
								v = value[vKey];

							formData.append(k, v);
						}
					}
				}
			}

			this.props.filterAuctions(formData);
			applyToAuctions((a) => a.style.opacity = 0.8);
		}, 500)
	}

	handleInput(e) {
		const input = e.target,
			name 	= input.name,
			type	= input.type,
			value	= type === 'checkbox' ? input.checked : input.value;

		this.setState({ [name]: value }, this.filterList);
	}

	render() {
		const { user, categories } = this.props,
			  state 			   = this.state,
        	stats = this.props.auction_count;

        return (
            <div className="advanced-search filters">
                <h3>Filtry</h3>
                <form ref={(e) => this.formRef = e}>
                    <div>
                        <div className="label"><i className="material-icons">title</i>Tytuł aukcji</div>
                        <p>
                            <input style={{width: 'calc(100% - 22px)', fontSize: '16px'}} name="title" type="text" value={this.state.title} onChange={this.handleInput}/>
                        </p>
                    </div>
                    <div>
                        <div className="label"><i className="material-icons">perm_identity</i>Sprzedawca</div>
                        <p>
                            <input style={{width: 'calc(100% - 22px)', fontSize: '16px'}} name="seller" type="text" value={this.state.seller} onChange={this.handleInput}/>
                        </p>
                    </div>
                </form>
                <div>
                    {
                        stats && (
                            <div>
                                <h3>Inne przedmioty</h3>
                                <div className="items">
                                    {
                                        
                                        stats.map((stat, index) => (
                                            <Link key={stat.name + '_' + stat.count} to={`/aukcje/szukaj/${stat.name}/${'*'}`}>
                                                <div className="item">
                                                    <div className="name">{ stat.name }</div>
                                                    <div className="count">{ stat.count }</div>
                                                </div>
                                            </Link>
                                        ))
                               
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
	}
}

function mapAuctionsToProps({ auctions }) {
	return { auctions };
};

Filters = connect(mapAuctionsToProps, auctionActions)(Filters);
export default Filters;