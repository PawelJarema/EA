import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component {
	componentDidUpdate() {
		if (this.props.open) {
			this.modalRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	render() {
		const { open, title, actions, close, cancel } = this.props;
		const content = this.props.children;

		return (
			<div ref={ (e) => this.modalRef = e } className={"Modal absolute-center" + (open ? ' open' : '')}>
				<div className="title">
					<h2>{ title }</h2>
				</div>
				<div className="content">
					{ content }
				</div>
				<div className="actions dont-hide">
					{ actions }{ cancel !== false ? <button className="standard-button" onClick={close}>Zamknij</button> : null }
				</div>
			</div>
		);
	}
};

export default Modal;