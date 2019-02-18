import React, { Component } from 'react';

class NotePad extends Component {
	constructor(props) {
		super(props);

		this.state = { open: false };
	}

	componentWillReceiveProps(props) {
		if (props.notes) {
			if (this.notesRef) {
				const value = this.notesRef.value;
				this.notesRef.value = (value  ? value + '\n\n' : '') + props.notes;
			}
		}
	}

	clear() {
		this.notesRef.value = '';
	}

	toggleOpen() {
		this.setState(({ open }) => ({ open: !open }));
	}

	render() {
		const 
			{ notes } = this.props,
			{ open }  = this.state;

		return (
			<div className="NotePad" ref={ (e) => this.notepadRef = e } style={ (open ? null : { top: 'calc(100vh - 70px)' }) }>
				<div className="title">
					<span onClick={ this.toggleOpen.bind(this) }><i className="material-icons clickable">{ (open ? 'arrow_drop_down' : 'arrow_right') }</i>  Notatnik</span>
					<span className="notepad-options">
						<i className="material-icons clickable" onClick={ this.clear.bind(this) }>delete_outline</i>
					</span>
				</div>
				<textarea ref={ (e) => this.notesRef = e } />
			</div>
		);
	}
}

export default NotePad;