import React, { Component } from 'react';
import { isSet, isNotEmpty } from './CategoryPicker';
import { InputSingular, InputRange, InputMultiple } from './CategoryInputs';

import './CategoryPicker.css';
import './CategoryFilters.css';

class PropertyInputs extends Component {
	constructor(props) {
		super(props);

		this.state = { focus: null };

		this.focus = this.focus.bind(this);
	}

	focus(inputName) {
		this.setState({ focus: inputName });
	}

	render() {
		const 
			{ properties, callback, marka } = this.props,
			{ focus } = this.state;

		if (!isNotEmpty(properties)) return null;

		const 
			single = [],
			range  = [];

		// zmienimy kolejność
		properties.map(prop => {
			if (prop.type === 'Range') range.push(prop)
			else single.push(prop);
		});

		const propInputs = (props) => (
			<div className="Properties">
				{
					props.map((prop, i) => {
						const key = prop.name + '_' + i;
						switch(prop.type) {
							case 'Range':
								return <InputRange key={ key } property={ prop } callback={ callback } focus={ focus } setFocus={ this.focus } />
							case 'Multiple':
								return <InputMultiple key={ key } property={ prop } callback={ callback } marka={ prop.name === 'Model' ? marka : null } focus={ focus } setFocus={ this.focus } />
							case 'Singular':
								return <InputSingular key={ key } property={ prop } callback={ callback } focus={ focus } setFocus={ this.focus } />
						}
					})
				}
			</div>
		);

		return (
			<div>
				{ propInputs(single) }
				{ propInputs(range) }
			</div>
		);
	}
}

class CategoryNavigation extends Component {
	render() {
		const 
			{ data, callback, level } = this.props,
			nextLevel = level === null ? 'category' : level === 'category' ? 'subcategory' : level === 'subcategory' ? 'subsubcategory' : null,
			squirtle = level === null ? 'main-cat ' : ''; 

		if (!isNotEmpty(data)) return null;

		return(
			<div className={ "CategoryTree " + nextLevel }>
				{
					data.map((cat, i) => <a key={ "cat_" + i } href="#" className={ squirtle + cat.name } onClick={ () => callback(nextLevel, cat.name, i) }>{ cat.name }</a>)
				}
			</div>
		);
	}
}

class Breadcrumbs extends Component {
	render() {
		const { category, subcategory, subsubcategory, navigateBack } = this.props;

		if (!category && !subcategory && !subsubcategory) return null;

		return (
			<div className="breadcrumb-navigation">
				<span><a href="#" onClick={ () => navigateBack('home')}>Wszystkie</a></span>
				{ category && <span><a href="#" onClick={ subcategory ? () => navigateBack('category') : null }>{ category }</a></span> }
				{ subcategory && <span><a href="#" onClick={ subsubcategory ? () => navigateBack('subcategory') : null }>{ subcategory }</a></span> }
				{ subsubcategory && <span>{ subsubcategory }</span> }
			</div>
		);
	}
}

class CategoryFilters extends Component {
	constructor(props) {
		super(props);
 
 		const 
 			initialCat 		= props.category || null,
 			initialCatIndex = initialCat ? props.categories.map(cat => cat.name).indexOf(initialCat) : null;

 		this.initialState = { marka: null, category: null, subcategory: null, subsubcategory: null, categoryIndex: null, subcategoryIndex: null, subsubcategoryIndex: null, data: {} };
		this.state = { marka: null, category: initialCat, subcategory: null, subsubcategory: null, categoryIndex: initialCatIndex, subcategoryIndex: null, subsubcategoryIndex: null, data: {} };

		this.handleInput = this.handleInput.bind(this);
		this.setCategory = this.setCategory.bind(this);
		this.navigateBack = this.navigateBack.bind(this);
		this.sendData = this.sendData.bind(this);
	}

	componentWillReceiveProps(props) {
		const { category } = props;

		if (category && category !== this.state.category) {
			if (category !== 'Kategorie' && category !== 'Szukaj Sprzedawcy') {
				this.setState({ category, categoryIndex: props.categories.map(cat => cat.name).indexOf(category) });
			} else {
				this.setState({ category: null, categoryIndex: null });
			}
		}

		if (props.categoryData) {
			const { categoryData } = props;

			if (categoryData.category !== this.state.category || categoryData.subcategory !== this.state.subcategory) {
				const
					category = categoryData.category || null,
					categoryIndex = category ? props.categories.map(cat => cat.name).indexOf(category) : null,
					subcategory = categoryData.subcategory || null,
					subcategoryIndex = subcategory ? props.categories[categoryIndex].subcategories.map(sub => sub.name).indexOf(subcategory) : null;

				this.setState({  
					category,
					categoryIndex,
					subcategory,
					subcategoryIndex  
				});
			}
		}
	}

	setCategory(which, name, index) {
		switch(which) {
			case 'category':
				this.setState({ category: name, categoryIndex: index, subcategory: null, subcategoryIndex: null, subsubcategory: null, subsubcategoryIndex: null, data: {} }, this.sendData);
				break;
			case 'subcategory':
				this.setState({ subcategory: name, subcategoryIndex: index, subsubcategory: null, subsubcategoryIndex: null, data: {} }, this.sendData);
				break;
			case 'subsubcategory':
				this.setState({ subsubcategory: name, subsubcategoryIndex: index, data: {} }, this.sendData);
		}
	}

	navigateBack(level) {
		switch(level) {
			case 'home':
				this.setState(this.initialState, this.sendData);
				break;
			case 'category':
				this.setState({ subcategory: null, subcategoryIndex: null, subsubcategory: null, subsubcategoryIndex: null, data: {} }, this.sendData);
				break;
			case 'subcategory':
				this.setState({ subsubcategory: null, subsubcategoryIndex: null, data: {} }, this.sendData);
				break;
		}
	}

	handleInput(event) {
		const
			data 	= this.state.data,
			target	= event.target,
			type	= target.type,
			name 	= target.name,
			value	= type === 'checkbox' ? target.checked : target.value;

		data[name] = value;

		this.setState({ data }, this.sendData);
	}

	sendData() {
		const 
			{ categoryCallback } = this.props,
			{ data, category, subcategory, subsubcategory } = this.state;

		data.category = category;
		data.subcategory = subcategory;
		data.subsubcategory = subsubcategory;
		data.time = new Date().getTime(); // czas jest unikatowym parametrem identyfikującym wysłany zestaw właściwości (każdy przetwarzany ma być tylko raz)
		categoryCallback(data);

		if (data['Marka'] && data['Marka'] !== this.state.marka) {
			this.setState({ marka: data['Marka'] });
		}
	}

	render() {
		const 
			{ categories } = this.props,
			{ categoryIndex, subcategoryIndex, subsubcategoryIndex } = this.state,
			// conditional props
			{ marka }			= this.state,
			category 	   		= isSet(categoryIndex) ? categories[categoryIndex] : null,
			subcategories  		= category ? category.subcategories : null,
			subcategory    		= isSet(subcategoryIndex) ? category.subcategories[subcategoryIndex] : null,
			subsubcategories	= subcategory && isNotEmpty(subcategory.sub_subcategories) ? subcategory.sub_subcategories : null,
			subsubcategory 		= isSet(subsubcategoryIndex) ? subcategory.sub_subcategories[subsubcategoryIndex] : null,
			level 				= isSet(subsubcategoryIndex) ? 'subsubcategory' : isSet(subcategoryIndex) ? 'subcategory' : isSet(categoryIndex) ? 'category' : null,
			dataToDisplay 		= level === null ? categories : level === 'category' ? subcategories : level === 'subcategory' ? subsubcategories : null,
			properties 			= subcategory && isNotEmpty(subcategory.properties) ? subcategory.properties : subsubcategory && isNotEmpty(subsubcategory.properties) ? subsubcategory.properties : null;

		const initialCategory = this.props.category;

		return (
			<div className="CategoryFilters">
				<CategoryNavigation data={ dataToDisplay } level={ level } callback={ this.setCategory } />
				<Breadcrumbs navigateBack={this.navigateBack} category={ this.state.category } subcategory={ this.state.subcategory } subsubcategory={ this.state.subsubcategory } />
				<PropertyInputs properties={ properties } callback={ this.handleInput } marka={marka} />
			</div>
		);
	}
}

export default CategoryFilters;