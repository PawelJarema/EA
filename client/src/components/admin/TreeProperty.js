import React, { Component } from 'react';
import { isNotEmpty } from '../auctions/functions';

class ValueEditor extends Component {

	render() {
		const { values, changeFieldValues } = this.props;

		return (
			<div className="tree-property-value-editor">
				<div className="title">Wpisz wartości oddzielone przecinkiem:</div>
				<textarea ref={ (e) => this.textRef = e } defaultValue={ values } />

				<div className="options">
					<i className="material-icons" onClick={ this.props.toggleEditor }>close</i>
					<i className="material-icons" onClick={ () => { changeFieldValues(this.textRef.value); this.props.toggleEditor(); }}>done</i>
				</div>
			</div>
		);
	}
}

class TreeProperty extends Component {
	constructor(props) {
		super(props);
		this.state={ editValues: false };

		this.toggleEditor = this.toggleEditor.bind(this);
	}

	handleChange(e) {
		
	}

	toggleEditor() {
		this.setState(({ editValues }) => ({ editValues: !editValues }));
	}

	render() {
		const 
			{ i, prop, changeFieldValue, changeFieldValues, deleteProp } = this.props,
			{ editValues } = this.state;

		return (
			<div className="tree-property">
				<div className="title"><span className="lp">{ i + 1 }.</span> { prop.name } <span className="options"><i className="material-icons clickable" onClick={ () => deleteProp(prop) }>close</i></span></div>
				<div>
				{
					prop.unit && (
						<span> jednostka: <input name="unit" type='text' value={ prop.unit } onChange={ (e) => changeFieldValue(prop, 'unit', e.target.value) } /></span>
					)
				}
				</div>
				<div>
				{
					isNotEmpty(prop.values) && (
						<span> 
							wartości: <input name="values" type='text' value={ prop.values.join(', ') } onFocus={ this.toggleEditor } /> ...
							{
								editValues && (
									<ValueEditor values={ prop.values.join(', ') } toggleEditor={ this.toggleEditor } changeFieldValues={ (values) => changeFieldValues(prop, values) } />
								)
							}
						</span>
					)
				}
				</div>
			</div>
		);
	}
}

export default TreeProperty;