import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { frontPageCategories as categories } from '../constants/categories';
import { stripPolish } from '../helpers/charHelper';

const
	iconWidth = 150, 
	assetNames = categories.map(cat => cat.toLowerCase().replace(/\s+/g, '_') + '.png');

class CategoryLink extends Component {
	navigate() {
		const { to, categoryCallback } = this.props;

        new Promise((resolve, reject) => {
     		resolve(
            	categoryCallback({ category: to, subcategory: null, subcategory: null, time: new Date().getTime() })
            );
        }).then(this.props.history.push('/aukcje'));
	}

	render() {
		return (
			<div className="category-link clickable" onClick={ this.navigate.bind(this) }>
				{ this.props.children }
			</div>
		);
	}
}

class FrontPageCategories extends Component {
	constructor(props) {
		super(props);

		this.state = { left: false, right: true };

		this.left = this.left.bind(this);
		this.right = this.right.bind(this);
		this.disabled = this.disabled.bind(this);
		this.animate = this.animate.bind(this);
	}

	left() {
		this.animate(-iconWidth);
	}
	
	right() {
		this.animate(iconWidth);
	}

	animate(distance) {
		const ref = this.containerRef;

		if (ref && !this.animation) {
			let
				startPosition = ref.scrollLeft,
				endPosition = startPosition + distance,
				step = distance / 10;

			this.animation = setInterval(() => {
				ref.scrollLeft += step;

				if (ref.scrollLeft === endPosition) {
					clearInterval(this.animation);
					this.animation = null;
					this.disabled();
				}
			}, Math.abs(step))
		}
	}

	disabled(which) {
		const 
			ref = this.containerRef;

		if (ref) {
			const
				scroll = ref.scrollLeft,
				overflow = ref.scrollWidth - ref.offsetWidth;

			this.setState({ left: (scroll > 0), right: (scroll < overflow) });
		}
	}

	render() {
		const
			{ onMobile, windowWidth } = this.props,
			componentWidth = windowWidth <= 580 ? windowWidth - 40 : windowWidth - 240; // marginesy na stronie + kontrolki

		return (
			<div className="carousel-control position-relative">
				{ onMobile && <div className={ "control left" + (this.state.left ? '' : ' disabled') } onClick={ this.left }><i className="material-icons">arrow_left</i></div> }
				<div ref={ (e) => this.containerRef = e } className={ "frontPageCategories" + (onMobile ? ' carousel' : '')} style={ (onMobile ? { width: parseInt(componentWidth / iconWidth) * iconWidth, margin: 'auto' } : {}) }>
					
					{
						assetNames.map((asset, i) => {
							const categoryName = categories[i];
							return (
								<CategoryLink key={ 'cat_' + i } to={ categoryName } categoryCallback={ this.props.categoryCallback }>
									<figure className="frontpage category-icon">
										<img src={ '/assets/icons/new/' + stripPolish(asset) } alt={ categoryName } />
										<figcaption>{ categoryName }</figcaption>
									</figure>
								</CategoryLink>
							);
						})
					}
				</div>
				{ onMobile && <div className={ "control right" + (this.state.right ? '' : ' disabled') } onClick={ this.right }><i className="material-icons">arrow_right</i></div> }
			</div>
		);
	}
}

CategoryLink = withRouter(CategoryLink);
export default FrontPageCategories;