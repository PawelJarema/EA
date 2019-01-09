import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as auctionActions from '../actions/auctionActions';
import './Filters.css';
import { applyToAuctions } from './Auctions.js';

class Filters extends Component {
	constructor(props) {
		super(props);
		this.state = { hidden: [], checked: [] };

		this.isHidden = name => this.state.hidden.indexOf(name) !== -1;
		this.isChecked = name => this.state.checked.indexOf(name) !== -1;
		this.hide = name => this.setState(prev => {
			if (this.isHidden(name)) {
				const i = prev.hidden.indexOf(name);
				return { hidden: prev.hidden.slice(0, i).concat(prev.hidden.slice(i + 1)) }
			} else {
				return { hidden: prev.hidden.concat([name]) }
			}
		});
		this.check = (name, noupdate) => this.setState(prev => {
			if (this.isChecked(name)) {
				const i = prev.checked.indexOf(name);
				return { checked: prev.checked.slice(0, i).concat(prev.checked.slice(i + 1)) }
			} else {
				return { checked: prev.checked.concat([name]) }
			}
		}, () => { if (noupdate) {} else { this.filterList() } });

		this.handleInput = this.handleInput.bind(this);
		this.filterList = this.filterList.bind(this);
	}

	componentDidMount() {
		this.filterList();
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
			}
		}

		if (props.match && props.categories) {
			const { category, query }   = props.match.params,
				  { categories } 		= this.props;

			let check_all 	 			= false;

			if (query && (query !== this.props.match.params.query || query !== this.state.title)) {
				this.setState({ title: query });
				this.filterList();
			} else if (category && category !== this.props.match.params.category) {
				this.filterList();
			}

			if (!categories)
				return;

			if (category === 'Kategorie' || category === 'Szukaj Sprzedawcy') {
				check_all = true;
			}

			for (let i = 0; i < categories.length; i++) {
				const main = categories[i];

				if (check_all) {
					// main.subcategories.map(sub => { this.check(sub.name); console.log(sub.name) });
				} else {
					const checked_subcat = main.subcategories.filter(sub => sub.name === category);

					if (main.name === category || checked_subcat.length) {
						
						if (checked_subcat.length) 
							this.check(checked_subcat[0].name, true);

						if (this.isHidden(main.name)) {
							this.hide(main.name);
						}
					} else {
						this.hide(main.name);
					}
				}
			}
		}
	}

	filterList() {
		if (this.filterListTimeout) {
			clearTimeout(this.filterListTimeout);
		}

		this.filterListTimeout = setTimeout(() => {
			const 	{ page, pages, per_page } 	= this.props,
					formData  					= new FormData(this.formRef);

			formData.append('page', page);
			formData.append('per_page', per_page);

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
                        <div className="label"><i className="material-icons">attach_money</i>Cena</div>
                        <p>
                            <input name="min" type="number" min="1" step="0.01" placeholder="od" value={this.state.min} onChange={this.handleInput}/>
                            <input name="max" type="number" min="1" step="0.02" placeholder="do" value={this.state.max} onChange={this.handleInput}/>
                        </p>
                    </div>
                    <div>
                        <div className="label"><i className="material-icons">search</i>Stan</div>
                        <p>
                            <input name="state_nowy" type="checkbox" checked={state.state_nowe} onChange={this.handleInput}/><span className="label">Nowy</span>
                        </p>
                        <p>
                            <input name="state_używany" type="checkbox" checked={state.state_uzywane} onChange={this.handleInput}/><span className="label">Używany</span>
                        </p>
                    </div>
                    <div>
                        <div className="label"><i className="material-icons">sort_by_alpha</i>Sortuj</div>
                        <p>
                            <input name="sort" type="radio" value="tanie" checked={this.state.sort === 'tanie'} onChange={this.handleInput}/><span className="label">od najtańszych</span>
                        </p>
                        <p>
                            <input name="sort" type="radio" value="drogie" checked={this.state.sort === 'drogie'} onChange={this.handleInput}/><span className="label">od najdroższych</span>
                        </p>
                        <p>
                            <input name="sort" type="radio" value="alfabetycznie" checked={this.state.sort === 'alfabetycznie'} onChange={this.handleInput}/><span className="label">alfabetycznie</span>
                        </p>
                    </div>
                    <div>
                        <div className="label"><i className="material-icons">title</i>Tytuł</div>
                        <p>
                            <input style={{width: 'calc(100% - 22px)', fontSize: '16px'}} name="title" type="text" value={this.state.title} onChange={this.handleInput}/>
                        </p>
                    </div>        
                
	                <div className="form-subsection">
	                	<div className="items">
	                		{
	                			categories && categories.map((main, i) => (
	                				<div key={"main_" + i}>
	                					<div className="main-category label" onClick={() => this.hide(main.name)}>{ main.name } <i className="material-icons category">arrow_drop_down</i></div>
	                					{
	                						!this.isHidden(main.name) && main.subcategories.map((sub, i) => (
	                							<div className="subcategory" key={"subcategory_" + i}><input name={"cat_" + sub.name} type="checkbox" onChange={() => this.check(sub.name)} checked={this.isChecked(sub.name)} className={this.isChecked(sub.name) ? 'checked' : ''}/>{ sub.name }</div>
	                						))
	                					}
	                				</div>
	                			))
	                		}
	                	</div>
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

function mapUserCategoriesAndAuctionsToProps({ user, categories, auctions }) {
	return { user, categories, auctions };
};

Filters = connect(mapUserCategoriesAndAuctionsToProps, auctionActions)(Filters);
export default Filters;