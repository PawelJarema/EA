import React, { Component } from 'react';

function draggable(WrappedComponent) {
	return class extends Component {
		constructor(props) {
			super(props);

			this.state = { position: null };

			this.mouseMove = this.mouseMove.bind(this);
			this.drag = this.drag.bind(this);
		}

		mouseMove(e) {
			e.preventDefault();
			const 
				x = e.pageX,
				y = e.pageY,
				screen = this.screenWidth = window.innerWidth,
				screenTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
				initialPosition = this.initialPosition = this.initialPosition || this.wrapperRef.getBoundingClientRect(),
				currentPosition = this.wrapperRef.getBoundingClientRect();

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
			const { position } = this.state;

			return (
				<div 
					className="draggable-component" 
					ref={ (e) => this.wrapperRef = e } 
					style={ ( position ? { position: 'fixed', right: position.right, top: position.top } : { position: 'fixed' } ) }
				>
					<i className="material-icons clickable" onMouseDown={ (e) => this.drag('mousedown', e) }>drag_handle</i>
					<WrappedComponent {...this.props} />
				</div>
			);
		}
	}
}

export { draggable };