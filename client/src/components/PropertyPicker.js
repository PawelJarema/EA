import React, { Component } from 'react';
import { isNotEmpty } from './CategoryPicker';
import './Categories.css';

class Input extends Component {
	constructor(props) {
		super(props);

		this.state = { hints: [] };

		this.setValue  = this.setValue.bind(this);
		this.showHints = this.showHints.bind(this);
		this.filterHints = this.filterHints.bind(this);
		this.hideHints = this.hideHints.bind(this);
	}

	setValue(value) {
		if (this.inputRef) {
			this.inputRef.value = value;
			this.hideHints();

			if (this.props.callback) {
				this.props.callback(this.inputRef.name, this.inputRef.value);
			}
		}
	}

	showHints() {
		this.setState({ hints: this.props.values });
	}

	filterHints() {
		if (this.inputRef) {
			const 
				value = this.inputRef.value,
				regex = new RegExp(value, 'i');

			this.setState({ hints: this.props.values.filter(val => regex.test(val)) });
		} 
	}

	hideHints() {
		this.setState({ hints: [] });
	}

	render() {
		const 
			{ name, type, unit, placeholder } = this.props,
			{ hints } = this.state;

		const symbol = unit ? unit : '';

		return (
			<div className="input-input">
				<span className="unit-span">
					<input name={ name } type={ type === 'Range' ? 'number' : 'text' } placeholder={ placeholder } ref={ (e) => this.inputRef = e } onFocus={ this.showHints } onChange={ this.filterHints } />
					{
						symbol && <span className="unit">{ symbol }</span>
					}
				</span>
				{
					isNotEmpty(hints) && (<ul className="input-hints">
						{
							hints.map((hint, i) => <li className="hint" onClick={ () => this.setValue(hint) }>{ hint + ' ' + symbol }</li>)
						}
					</ul>)
				}
			</div>
		);
	}
}

class Property extends Component {
	render() {
		const 
			{ property, callback, marka } = this.props,
			{ name, type, unit, icon, values, conditional_values } = property;

		if (!property) return null;

		const alias = type === 'Range' ? '%' + name : name;

		return (
			<span className="property">
				<label htmlFor={ 'property_' + name }>{ name }</label>
				<Input name={ 'property_' + alias } type="text" unit={ unit } callback={ callback } values={ marka ? conditional_values[marka] : values } />
			</span>
		);
	}
}

class PropertyPicker extends Component {
	constructor(props) {
		super(props);

		this.state = { marka: '' };

		this.callback = this.callback.bind(this);
	}

	callback(name, value) {
		// keep track of conditional props
		if (name.endsWith('Marka')) this.setState({ marka: value });
	}

	render() {
		const { properties, callback } = this.props;

		if (!properties) return null;
	
		return (
			<div className="Properties">
				{
					properties.map((prop, index) => { 
						if (prop.name === 'Cena') 
							return null;

						if (prop.name === 'Marka')
							return <Property key={ "prop_" + index } property={ prop } callback={ this.callback } />;
						
						if (prop.name === 'Model') 
							return <Property key={ "prop_" + index } property={ prop } marka={ this.state.marka } />;

						return <Property key={ "prop_" + index } property={ prop } />;
					})
				}
			</div>
		);
	}
}

export default PropertyPicker;