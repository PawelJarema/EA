import React, { Component } from 'react';

import Property from './Property';
import { isNotEmpty } from '../auctions/functions';

let uid = 1;

class PropertyEditor extends Component {
	constructor(props) {
		super(props);

		this.state = { txtProps: false, numProps: false, position: null };

		this.mouseMove = this.mouseMove.bind(this);
	}

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
				if (!this.state.numProps) this.setState({ numProps: true });
				break;
			default:
				prop.type = 'Singular';
				if (!this.state.txtProps) this.setState({ txtProps: true });
		}

		addProp(prop);
	}

	deleteProp(prop) {
		const { removeProp } = this.props;
		removeProp(prop);
	}

	mouseMove(e) {
		e.preventDefault();
		const 
			x = e.pageX,
			y = e.pageY,
			screen = this.screenWidth = window.innerWidth,
			screenTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
			initialPosition = this.initialPosition = this.initialPosition || this.editorRef.getBoundingClientRect(),
			currentPosition = this.editorRef.getBoundingClientRect();

		let
			basicOffset = this.basicOffset ? this.basicOffset : this.basicOffset = currentPosition.width - Math.abs(currentPosition.x - x),
			xOffset = screen - x - basicOffset,
			yOffset = initialPosition.y - y;

		this.setState({
			position: { right: xOffset , top: initialPosition.top - yOffset - screenTop }
		});
	}

	drag(type, e) {
		switch(type) {
			case 'mousedown':
				this.mouseupfunction = () => this.drag('mouseup', e);
				document.addEventListener('mousemove', this.mouseMove);
				document.addEventListener('mouseup', this.mouseupfunction);
			break;
			case 'mouseup':
				document.removeEventListener('mousemove', this.mouseMove);
				document.removeEventListener('mouseup', this.mouseupfunction);
				this.basicOffset = null;
			break;
		}
	}

	render() {
		const
			{ txtProps, numProps, position } = this.state, // txtProps, numProps - wartości bool do wyświetlania
			{ properties } 	= this.props,
			drag 			= this.drag.bind(this),
			numberProps 	= [],
			textProps 		= [];

		const 
			updateProps = this.updateProps.bind(this),
			deleteProp = this.deleteProp.bind(this),
			addProp = this.addProp.bind(this);

		if (!isNotEmpty(properties)) return <span className="anim-loading-text">Trwa wczytywanie ...</span>;

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
			<div className="PropertyEditor" ref={ (e) => this.editorRef = e } style={ ( position ? { right: position.right, top: position.top } : null ) }>
				<div className="property-editor-heading" onMouseDown={ (e) => drag('mousedown', e) }>Szablony Cech</div>
				<div className="property-editor-info">przeciągaj cechy na najgłębiej zagnieżdżone kategorie, <br/>potem ustawiaj wartości cech w powstałym w ten sposób kontekście</div>
				<div className="container">
					<div className="property-editor-subheading" title="występują jako pola jednokrotnego lub wielokrotnego wyboru. zawierają wartości tekstowe">
						<span className="options">
							<i className="material-icons clickable" onClick={ () => addProp('Singular') }>playlist_add</i>
						</span>
						<span className="visibility" onClick={ () => this.setState(({ txtProps }) => ({ txtProps: !txtProps })) }>cechy tekstowe <i className="material-icons clickable">{ (txtProps ? 'layers_clear': 'layers') }</i></span>
					</div>
					<div className="property-editor-text-properties">
						{ txtProps && textProps }
					</div>
					<div className="property-editor-subheading" title="w widoku wyszukiwania wyświetlają się jako widełki. zawierają wartość liczbową">
						<span className="options">
							<i className="material-icons clickable" onClick={ () => addProp('Range') }>playlist_add</i>
						</span>
						<span className="visibility" onClick={ () => this.setState(({ numProps }) => ({ numProps: !numProps })) }>cechy liczbowe <i className="material-icons clickable">{ (numProps ? 'layers_clear' : 'layers') }</i></span>
					</div>
					<div className="property-editor-number-properties">
						{ numProps && numberProps }
					</div>
					<div style={{ width: '100%', height: '50vh' }}></div>
				</div>
			</div>
		)
	}
}

export default PropertyEditor;