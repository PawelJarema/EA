import React, { Component } from 'react';
import { isSet, isNotEmpty } from './CategoryPicker';

class InputSingular extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: null,	
			hints: []
		};

		this.hints  = this.hints.bind(this);
		this.hintsOff = this.hintsOff.bind(this);
		this.select = this.select.bind(this);
		this.callback = this.callback.bind(this);
	}

	hints() {
		if (isNotEmpty(this.state.hints)) {
			// this.hintsOff();
		} else {
			this.setState({ hints: this.props.property.values });
		}
	}

	hintsOff() {
		this.setState({ hints: [] });
	}

	select(event) {
		const
			target	 	= event.target,
			value 		= target.innerText;

		this.setState({ value }, this.callback);
	}

	callback() {
		const
			{ property, callback } 	= this.props,
			{ value } 	 			= this.state,
			event = {
				target: {
					name: property.name,
					value
				}
			};

		if (callback) {
			callback(event); this.hintsOff();
		}
	}

	render() {
		const 
			{ focus, setFocus, property } 	= this.props,
			{ hints, value } = this.state,
			isFocused = focus === property.name;

		if (!property) return null;

		return (
			<div className="input-singular">
				<span className="input input-input">
					<span className="unit-span">
						<label>{ property.name }</label>
						<input name={ property.name } type="text" value={ value } onClick={ this.hints } onFocus={ () => setFocus(property.name) } />
						<span className="unit">
							<i className="material-icons">category</i>
						</span>
					</span>
					{
						isFocused && isNotEmpty(hints) && (
							<ul className="hints">
								{
									hints.map((hint, i) => (
										<li key={ "check_hint_" + i } onClick={ this.select }> { hint } </li>
									))
								}
							</ul>
						)
					}
				</span>
			</div>
		);
	}
}

class InputMultiple extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {},	
			hints: [],
			checkedString: ''
		};

		this.allKey = this.allKey.bind(this);
		this.hints  = this.hints.bind(this);
		this.hintsOff = this.hintsOff.bind(this);
		this.select = this.select.bind(this);
		this.select2 = this.select2.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.callback = this.callback.bind(this);
	}

	allKey() {
		const { property } = this.props;
		return `${property.name}_wszystkie`;
	}

	makeString(data) {
		const 
			{ property } 	= this.props,
			prefix 			= `${property.name}_`,
			keys 			= Object.keys(data);

		return keys.map((key) => key.replace(prefix, '')).join(', ');
	}

	hints() {
		const { property, marka, focus } = this.props;

		// conditional values
		if (isNotEmpty(this.state.hints)) {
			this.hintsOff();
		} else {
			this.setState({ hints: marka ? property.conditional_values[marka] : property.values });
		}
	}

	hintsOff() {
		this.setState({ hints: [] });
	}

	select(event) {
		const
			{ data } 	= this.state,
			target	 	= event.target,
			name 		= target.name,
			checked 	= target.checked,
			allKey 		= this.allKey();

		delete data[allKey];

		if (checked) {
			data[name] = checked;
		} else {
			if (data[name]) delete data[name];
		}

		this.setState({ data, checkedString: this.makeString(data) }, this.callback);
	}

	select2(name, checked) {
		const
			{ data } = this.state, 
			allKey = this.allKey();

		delete data[allKey];

		if (checked) {
			data[name] = checked;
		} else {
			if (data[name]) delete data[name];
		}

		this.setState({ data, checkedString: this.makeString(data) }, this.callback);
	}

	selectAll(event) {
		const 
			{ callback } 	= this.props,
			allKey 			= this.allKey(),
			data 			= { [allKey]: true };

		this.setState({ data, checkedString: 'Wszystkie...' }, this.callback);
	}

	callback() {
		const
			{ property, callback } 	= this.props,
			{ data } 	 			= this.state,
			event = {
				target: {
					name: property.name,
					value: data
				}
			};

		if (callback) {
			callback(event);
		}
	}

	render() {
		const 
			{ focus, setFocus, property } 	= this.props,
			{ hints, data } = this.state,
			isFocused = focus === property.name;

		if (!property) return null;

		return (
			<div className="input-multiple">
				<span className="input input-input">
					<span className="unit-span">
						<label>{ property.name }</label>
						<input ref={ (e) => this.inputRef = e } type="text" value={ this.state.checkedString } onClick={ this.hints } onFocus={ () => { setFocus(property.name); if (!isFocused) this.hintsOff() }} />
						<span className="unit">
							<i className="material-icons">arrow_drop_down</i>
						</span>
					</span>
					{
						isFocused && isNotEmpty(hints) && (
							<ul className="hints">
								<li onClick={ this.selectAll }>
									<input type="checkbox" name={ this.allKey() } checked={ data[this.allKey()] || false } />
									<span className="label"> Wszystkie...</span>
								</li>
								{
									hints.map((hint, i) => (
										<li 
											key={ "check_hint_" + i } 
											onClick={ () => {
												let name = `${property.name}_${hint}`;
												this.select2(name, !data[name]);
											}}>
											<input type="checkbox" name={ `${property.name}_${hint}` } checked={ data[`${property.name}_${hint}`] || false } />
											<span className="label"> { hint }</span>
										</li>
									))
								}
							</ul>
						)
					}
				</span>
			</div>
		);
	}
}

class InputRange extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.inputRefs  = {};

		this.clearHints = this.clearHints.bind(this);
		this.hints = this.hints.bind(this);
		this.allhints = this.allhints.bind(this);
		this.setValue = this.setValue.bind(this);
		this.callback = this.callback.bind(this);
	}

	clearHints(input) {
		this.setState({ [input]: [] });
	}

	allhints(event) {
		const
			{ property } 	= this.props,
			target 			= event.target,
			name 			= target.name;

		this.setState({ [name]: property.values });
	}

	hints(event) {
		const 
			{ property } 	= this.props,
			target 			= event.target,
			name 			= target.name,
			value			= target.value,
			regexp			= new RegExp(value, 'i');

		this.setState({ [name]: property.values.filter(val => regexp.test(val)) });
		this.callback();
	}

	setValue(inputName, value) {
		const
			input = this.inputRefs[inputName];

		if (input) {
			input.value = value;
			this.clearHints(inputName);

			this.callback();
		}
	}

	callback() {
		const 
			{ property, callback } = this.props,
			input_od = this.inputRefs[property.name + '-' + 'od'],
			input_do = this.inputRefs[property.name + '-' + 'do'],
			_od = input_od ? input_od.value : null, 
			_do = input_do ? input_do.value : null,
			event = {
				target: {
					name: property.name,
					value: {
						_od,
						_do
					}
				}
			};

			if (callback) callback(event);
	}

	generateInput(property, suffix, focus, setFocus) {
		const
			name = `${property.name}-${suffix}`,
			hints = this.state[name],
			refs = this.inputRefs,
			isFocused = focus === name;

		return (
			<span className="input input-input">
				<span className="unit-span">
					<label htmlFor={ name }>{ name.replace('-', ' ') }</label>
					<input ref={ (e) => refs[name] = e } name={ name } type="number" onChange={ this.hints } onFocus={ (event) => { setFocus(name); this.allhints(event); }} />
					<span className="unit">
						{ property.unit }
					</span>
				</span>
				{
					isFocused && isNotEmpty(hints) && (
						<ul className="hints">
							{
								hints.map((hint, i) => <li key={ "hint_" + i } onClick={ () => this.setValue(name, hint) }> { hint } { property.unit ? property.unit : null }</li>)
							}
						</ul>
					)
				}
			</span>
		);
	}

	render() {
		const { focus, setFocus, property } = this.props;

		return (
			<div className="input-range">
				{ this.generateInput(property, 'od', focus, setFocus) }
				{ this.generateInput(property, 'do', focus, setFocus) }
			</div>
		);
	}
}

export { InputSingular, InputMultiple, InputRange };