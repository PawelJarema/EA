import React, { Component } from 'react';

class Property extends Component {
	constructor(props) {
		super(props);
		this.state = { prop: props.prop, open: false, dragged: false };

		this.skip = ['values', '_id', 'conditional_values'];
		this.names = {
			type: 'rodzaj pola',
			name: 'nazwa pola',
			unit: 'jednostka'
		};

		this.translateProp = (prop) => {
			const translate = {
				'Range': 'Pole liczbowe',
				'Singular': 'Pole tekstowe jednokrotnego wyboru',
				'Multiple': 'Pole tekstowe wielokrotnego wyboru'
			}

			if (translate[prop]) return translate[prop];
			return prop;
		}

		this.edit = (key, prop) => {
			switch(key) {
				case 'type':
					return (
						<select name={ key } value={ prop[key] } onChange={ this.handleChange }>
							<option value='Singular'>{ this.translateProp('Singular') }</option>
							<option value='Multiple'>{ this.translateProp('Multiple') }</option>
							<option value='Range'>{ this.translateProp('Range') }</option>
						</select>
					);
					break;
				default:
					return <input name={ key } type="text" value={ prop[key] } onChange={ this.handleChange } />
			} 
		}

		this.handleChange = this.handleChange.bind(this);
		this.confirm = this.confirm.bind(this);
	}

	handleChange(e) {
		const
			{ prop } = this.state,
			input = e.target,
			name  = input.name,
			value = input.value;

		prop[name] = value;

		this.setState({ prop }, this.confirm);
	}

	confirm() {
		const { prop } = this.state;
		if (this.changeTimeout) {
			clearTimeout(this.changeTimeout);
		}

		this.changeTimeout = setTimeout(() => this.props.updateProps(prop), 2500);
	}

	remove() {
		const { prop } = this.state;
		this.props.deleteProp(prop);
	}

	render() {
		const 
			{ prop, open } = this.state,
			remove = this.remove.bind(this);

		return (
			<div draggable onDragStart={ () => this.props.dragProp(prop) } className={ "property-editor-property" + (open ? ' open' : '')}>
				<span className="title" onClick={ () => this.setState({ open: !open }) }>
					<span>{ prop.name }</span>
					<span className="options">
						<i className="material-icons clickable" onClick={ remove }>close</i>
					</span>
				</span>
				{
					open && (
						<div className="property-editor-property-details">
							{
								Object.keys(prop).map((key, i) => {
									if (this.skip.indexOf(key) !== -1) return null;
									return (
										<div key={ 'value_' + i }>
											{ this.names[key] }: 
											{ this.edit(key, prop) }
										</div>
									)
								})
							}
						</div>
					)
				}
			</div>
		);
	}
}

export default Property;