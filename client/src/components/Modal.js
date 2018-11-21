import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component {
	componentDidUpdate() {
		if (this.props.open) {
			this.modalRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	render() {
		const open = this.props.open;
		const title = this.props.title;
		const content = this.props.children;
		const actions = this.props.actions;
		const close = this.props.close;

		return (
			<div ref={ (e) => this.modalRef = e } className={"Modal absolute-center" + (open ? ' open' : '')}>
				<div className="title">
					<h2>{ title }</h2>
				</div>
				<div className="content">
					{ content }
				</div>
				<div className="actions dont-hide">
					{ actions }<button className="standard-button" onClick={close}>Anuluj</button>
				</div>
			</div>
		);
	}
};

export default Modal;