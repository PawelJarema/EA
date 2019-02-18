import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TreeProperty from './TreeProperty';
import { isNotEmpty } from '../auctions/functions';

const SortableTreeProperty = SortableElement(({ i, prop, changeFieldValue, changeFieldValues, deleteProp  }) => (
	<li>
		<TreeProperty i={ i } prop={prop} changeFieldValue={ changeFieldValue } changeFieldValues={ changeFieldValues } deleteProp={ deleteProp } />
	</li>
));

const SortableTreePropertyList = SortableContainer(({ props, changeFieldValue, changeFieldValues, deleteProp }) => {
	return (
		<ul>
			{
				props.map((prop, i) => <SortableTreeProperty key={ prop.name + '_' + i } index={ i } i={ i } prop={ prop } changeFieldValue={ changeFieldValue } changeFieldValues={ changeFieldValues } deleteProp={ deleteProp }/> )
			}
		</ul>
	);
});

class TreeProperties extends Component {
	constructor(props) {
		super(props);

		if (isNotEmpty(props.node.properties)) {
			this.state = { props: props.node.properties };
		} else {
			this.state = {};
		}

		this.onSortEnd = this.onSortEnd.bind(this);
		this.changeFieldValue = this.changeFieldValue.bind(this);
		this.changeFieldValues = this.changeFieldValues.bind(this);
		this.deleteProp = this.deleteProp.bind(this);
		this.updateProperties = this.updateProperties.bind(this);
	}

	changeFieldValue(prop, field, value) {
		const
			{ props } = this.state, 
			index = props.indexOf(prop),
			newProps = props.slice(0);

		prop[field] = value;
		newProps[index] = prop;

		this.setState({ props: newProps }, this.updateProperties);
	}

	changeFieldValues(prop, values) {
		this.changeFieldValue(prop, 'values', values.split(/\s*,\s*/));
	}

	deleteProp(prop) {
		const
			{ props } = this.state,
			index = props.indexOf(prop),
			newProps = props.slice(0, index).concat(props.slice(index + 1));

		this.setState({ props: newProps }, this.updateProperties);
	}

	updateProperties() {
		const 
			{ node, replaceTreeNode } = this.props,
			{ props } = this.state;

		node.properties = props;

		if (replaceTreeNode) replaceTreeNode(node);
	}

	componentWillReceiveProps(props) {
		if (props.node && isNotEmpty(props.node.properties)) {
			this.setState({ props: props.node.properties });
		}
	}

	onSortEnd({ oldIndex, newIndex}) {
		this.setState(({ props }) => ({
			props: arrayMove(props, oldIndex, newIndex)
		}), this.updateProperties);
	}

	render() {
		const { props } = this.state;

		if (!isNotEmpty(props)) return null;

		return (
			<div className="tree-properties">
				<SortableTreePropertyList props={ props } onSortEnd={ this.onSortEnd } helperClass="tree-drag" pressDelay={200} changeFieldValues={ this.changeFieldValues } changeFieldValue={ this.changeFieldValue } deleteProp={ this.deleteProp }/>
			</div>
		);
	}
}

export default TreeProperties;