import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { isNotEmpty } from '../auctions/functions';

const SortableItem = SortableElement(({ tree, node, renderNode, onChange, i }) => {
	let children = null;
	if (isNotEmpty(node.children) && !node.collapsed) {
		children = <span><SortableList key={ 'cat_' + i } pressDelay={ 200 } helperClass="tree-drag" items={ node.children } renderNode={ renderNode } onSortEnd={ (props) => onSortEnd({tree, ...props, onChange, node}) } tree={ tree } onChange={ onChange } /></span>; // onSortEnd={ (props) => this.onSortEnd({...props, listIndex}) }
	}

	return (<li className="category-tree-entry">{ renderNode(node) } { children }</li>);
});

const SortableList = SortableContainer(({ items, renderNode, onChange, tree }) => {


	return (
		<ul className="tree-node-list">
			{
				items.map((node, i) => (
					<SortableItem key={ node.module + '_' + i } index={ i } i={ i } node={ node } renderNode={ renderNode } onChange={ onChange } tree={ tree } />
				))
			}
		</ul>
	);
});

class Tree extends Component {
	render() {
		const { paddingLeft, tree, onChange, addCat, renderNode } = this.props;
		const listIndex = 0;

		if (isEmptyObject(tree)) return null;

		return (
			<div className="CategoryTree">
				<div className="category-tree-heading">{ tree.module } 
					<span className="options">
						<i className="material-icons" title="dodaj kategorię główną" onClick={ () => addCat(tree) }>playlist_add</i>
					</span>
				</div>
				<div className="category-tree-main-categories">
					<SortableList helperClass="tree-drag" pressDelay={ 200 } items={ tree.children } onSortEnd={ (props) => onSortEnd({tree, ...props, onChange}) } renderNode={ renderNode } tree={ tree } onChange={ onChange } />
				</div>
			</div>
		);
	}
}

function onSortEnd({ tree, oldIndex, newIndex, onChange, node }) {
	let 
		index,
		change = false;

	if (!node) {
		// sortujemy u korzenia drzewa kategorii
		tree.children = arrayMove(tree.children, oldIndex, newIndex);
		change = true;
	} else if (node.type === 'category') {
		// sortujemy wewnątrz kategorii głównej
		index = node.index; //tree.children.indexOf(node);
		tree.children[index].children = arrayMove(tree.children[index].children, oldIndex, newIndex);
		change = true;
	} else if (node.type === 'subcategory') {
		// sortujemy wewnątrz podkategorii
		index = node.index; //tree.children[node.parent_indexes[0]].children.indexOf(node);
		tree.children[node.parent_indexes[0]].children[index].children = arrayMove(tree.children[node.parent_indexes[0]].children[index].children, oldIndex, newIndex);
		change = true;
	}
	

	if (change) {
		onChange(tree);
	}
}

function isEmptyObject(object) {
	if (!object) return true;

	for (let prop in object) {
		if (object.hasOwnProperty(prop)) {
			return false;
		}
	}

	return JSON.stringify(object) === JSON.stringify({});
}

export default Tree;