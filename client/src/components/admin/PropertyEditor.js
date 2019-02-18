import React, { Component } from 'react';

import Property from './Property';
import { isNotEmpty } from '../auctions/functions';

let uid = 1;

class PropertyEditor extends Component {
	updateProps(prop) {
		const 
			{ properties, updateProps } = this.props,
			index = properties.indexOf(prop);

		properties[index] = prop;
		updateProps(properties);
	}

	addProp(which) {
		const 
			{ properties, addProp } = this.props,
			prop = { 
				name: 'Nazwij...',
				values: []
			};
		switch(which) {
			case 'Range':
				prop.type = 'Range';
				prop.unit = 'dodaj jednostkę...';
				break;
			default:
				prop.type = 'Singular';
		}

		addProp(prop);
	}

	deleteProp(prop) {
		const { removeProp } = this.props;
		removeProp(prop);
	}

	render() {
		const 
			{ properties } 	= this.props,
			numberProps 	= [],
			textProps 		= [];

		const 
			updateProps = this.updateProps.bind(this),
			deleteProp = this.deleteProp.bind(this),
			addProp = this.addProp.bind(this);

		if (!isNotEmpty(properties)) return null;

		properties.map((prop, i) => {
			const 
				key = 'prop_' + prop.name + '_' + ++uid,
				property = <Property key={ key } prop={prop} updateProps={ updateProps } dragProp={ this.props.dragProp } deleteProp={ deleteProp } />;

			if (prop.type === 'Range') {
				numberProps.push(property);
			} else {
				textProps.push(property);
			}
		});

		return (
			<div className="PropertyEditor">
				<div className="property-editor-heading">Szablony Cech</div>
				<div className="property-editor-info">przeciągaj cechy na najgłębiej zagnieżdżone kategorie, <br/>potem ustawiaj wartości cech w powstałym w ten sposób kontekście</div>
				<div className="container">
					<div className="property-editor-subheading" title="występują jako pola jednokrotnego lub wielokrotnego wyboru. zawierają wartości tekstowe">
						<span className="options">
							<i className="material-icons clickable" onClick={ () => addProp('Singular') }>playlist_add</i>
						</span>
						<span>cechy tekstowe</span>
					</div>
					<div className="property-editor-text-properties">
						{ textProps }
					</div>
					<div className="property-editor-subheading" title="w widoku wyszukiwania wyświetlają się jako widełki. zawierają wartość liczbową">
						<span className="options">
							<i className="material-icons clickable" onClick={ () => addProp('Range') }>playlist_add</i>
						</span>
						<span>cechy liczbowe</span>
					</div>
					<div className="property-editor-number-properties">
						{ numberProps }
					</div>
					<div style={{ width: '100%', height: '50vh' }}></div>
				</div>
			</div>
		)
	}
}

export default PropertyEditor;