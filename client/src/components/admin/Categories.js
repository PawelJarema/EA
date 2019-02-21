import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as categoryActions from '../../actions/categoryActions';

import Tree from './Tree';
import TreeProperties from './TreeProperties';
import PropertyEditor from './PropertyEditor';
import NotePad from './NotePad';

import { isNotEmpty } from '../auctions/functions';

let noteString = '';

class Categories extends Component {
	constructor(props) {
		super(props);

		this.state = { activeNode: null, draggedProp: null, tree: null, properties: null, notes: '' };

		this.treeChange = this.treeChange.bind(this);
		this.onClickNode = this.onClickNode.bind(this);
		this.renderNode = this.renderNode.bind(this);
		this.addCat = this.addCat.bind(this);
		this.addProp = this.addProp.bind(this);
		this.removeProp = this.removeProp.bind(this);
		this.updateProps = this.updateProps.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.dragProp = this.dragProp.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.replaceTreeNode = this.replaceTreeNode.bind(this);
		this.togglePropVisibility = this.togglePropVisibility.bind(this);
		this.postTree = this.postTree.bind(this);
		this.resetCategories = this.resetCategories.bind(this);
	}

	postTree() {
		const
			confirm = window.confirm('Chcesz nadpisać układ kategorii w serwisie ?'),
			{ admin } = this.props,
			{ tree } = this.state;

		tree.admin_id = String(admin._id);

		if (confirm) this.props.postCategoryTree(tree)
	}

	resetCategories() {
		const
			confirm = window.confirm('Napewno przywrócić fabryczny zestaw kategorii ?'),
			{ admin } = this.props;

		if (confirm) this.props.resetCategories().then(() => window.location.href='/admin/kategorie');
	}

	componentDidMount() {
		if (!this.props.categories) {
			this.props.fetchCategories();
		} else {
			this.componentWillReceiveProps(this.props);
		}
	}

	componentWillReceiveProps(props) {
		if (props.categories && !this.state.tree) {
			this.setState({ tree: categoriesToTreeObject(props.categories), properties: categoriesToProperties(props.categories) }, () => this.setState({ notes: noteString }));
		}
	}

	treeChange(tree) {
		tree = recreateTreeIndexes(tree);
		this.setState({
			tree
		});
	}

	addProp(prop) {
		this.setState(({ properties }) => {
			let data = properties.slice(0);
			data.unshift(prop);
			return ({ properties: data });
		});
	}

	dragProp(prop) {
		this.draggedProp = prop;
	}

	removeProp(prop) {
		this.setState(({ properties }) => {
			const index = properties.indexOf(prop);
			return ({ properties: properties.slice(0, index).concat(properties.slice(index + 1)) });
		});
	}


	updateProps(props) {
		this.setState({
			properties: props
		});
	}

	addCat(node) {
		if (isNotEmpty(node.properties)) {
			alert('Nie można dodać kategorii wewnętrznych do pola zawierającego cechy. Aby dodać kolejne podkategorie, najpierw usuń cechy.');
			return;
		}

		const 
			name 	 = window.prompt('Podaj nazwę nowej kategorii'),
			{ tree } = this.state;

		let 
			index = -1,
			children = null;

		if (name) {
			switch(node.type) {
				case 'root':
					tree.children.unshift({ module: name, type: 'category' });
					break;
				case 'category':
					index 	 = node.index; // tree.children.indexOf(node);
					children = tree.children[index].children;

					if (!isNotEmpty(children)) tree.children[index].children = [];
					tree.children[index].children.unshift({ module: name, type: 'subcategory', parent_indexes: [index] });
					break;
				case 'subcategory':
					index = node.index; //tree.children[node.parent_indexes[0]].children.indexOf(node);
					children = tree.children[node.parent_indexes[0]].children[index].children;

					if (!isNotEmpty(children)) tree.children[node.parent_indexes[0]].children[index].children = [];
					tree.children[node.parent_indexes[0]].children[index].children.unshift({ module: name, type: 'subsubcategory', parent_indexes: [node.parent_indexes[0], index] });
					break;
			}


			this.treeChange(tree);
		}
	}

	removeCat(node) {
		const 
			confirm  = (isNotEmpty(node.children) || isNotEmpty(node.properties)) ? window.confirm('Napewno usunąć "' + node.module + '" i wszystkie dane wewnątrz ?') : true,
			{ tree } = this.state;
		let 
			index,
			parent,
			children,
			change = false;

		if (confirm) {
			switch(node.type) {
				case 'category':
					index = node.index; //tree.children.indexOf(node);
					tree.children.splice(index, 1);
					change = true;
					break;

				case 'subcategory':
					parent = tree.children[node.parent_indexes[0]];
					index = node.index; //parent.children.indexOf(node);
					parent.children.splice(index, 1);
					change = true;
					break;

				case 'subsubcategory':
					parent = tree.children[node.parent_indexes[0]].children[node.parent_indexes[1]];
					index = node.index; //parent.children.indexOf(node);
					parent.children.splice(index, 1);
					change = true;
					break;
			}

			if (change) {
				this.treeChange(tree);
			}
		}
	}

	togglePropVisibility(node) {
		node.properties_seen = !node.properties_seen;
		this.replaceTreeNode(node);
	}

	onClickNode(node) {
		this.setState({ activeNode: node });
	}

	onDragOver(e, node) {
		e.preventDefault();
		//console.log('drag to ' + node.module);
	}

	replaceTreeNode(node) {
		const { tree } = this.state;
		this.treeChange(replaceTreeNode(tree, node));
	}

	onDrop(e, node) {
		e.preventDefault();

		if (this.draggedProp) {
			if (node.type === 'category') {
				alert('Nie można dodać cech do kategorii nadrzędnej.');
				return;
			}
			if (isNotEmpty(node.children)) {
				alert('Nie można dodać cech do pola zawierającego podkategorie. Dodawaj cechy do podkategorii albo usuń je.');
				return;
			}

			const { tree } = this.state;

			if (isNotEmpty(node.properties)) {
				if (node.properties.map(prop => prop.name).indexOf(this.draggedProp.name) !== -1) {
					alert('Tę cechę już dodałeś.');
					return;
				}
			} else {
				node.properties = [];
			}

			node.properties_seen = true;
			node.properties.push(this.draggedProp);
			this.treeChange(replaceTreeNode(tree, node));
		}
	}

	renderNode(node) {
		const 
			{ activeNode } = this.state,
			seen = node.properties_seen;

		let 
			options 	= [],
			collapsible = null;

		if (isNotEmpty(node.children)) {
			collapsible = <i className="material-icons" onClick={ () => { node.collapsed = !node.collapsed; }}>{ node.collapsed ? 'arrow_right' : 'arrow_drop_down' }</i>
		}
		if (node.type === 'category') {
			options = [
				<i key="a" className="material-icons" title="dodaj podkategorię" onClick={ () => this.addCat(node) }>playlist_add</i>,
				<i key="b" className="material-icons" title="usuń kategorię" onClick={ () => this.removeCat(node) }>close</i>
			]
		}
		if (node.type === 'subcategory') {
			options = [
				<i key="a" className="material-icons" title="dodaj podkategorię 3 poziomu" onClick={ () => this.addCat(node) }>playlist_add</i>,
				<i key="b" className="material-icons" title="usuń podkategorię" onClick={ () => this.removeCat(node) }>close</i>
			]
		}
		if (node.type === 'subsubcategory') {
			options = [<i key="b" className="material-icons" title="usuń kategorię 3 poziomu" onClick={ () => this.removeCat(node) }>close</i>]
		}
		if (isNotEmpty(node.properties)) {
			
			options.unshift(<i key='_' className="material-icons layers" title={ (seen ? 'ukryj cechy' : 'pokaż cechy') } onClick={ () => this.togglePropVisibility(node) } >{ (seen ? 'layers_clear' : 'layers') }</i>)
		}

		return (
			<div>
				<span
					onDragOver={ (e) => this.onDragOver(e, node) }
					onDrop={ (e) => this.onDrop(e, node) }
					className={ 'node ' + node.type + ( node === activeNode ? ' is-active' : '' ) }
					onClick={ this.onClickNode.bind(null, node) }
				>
					<span className="tree-collapsible">{ collapsible }</span> { node.module } <span className="options">{ options }</span>			
				</span>
				{
					seen && <TreeProperties node={ node } replaceTreeNode={ this.replaceTreeNode }/>
				}
			</div>
		);
	}

	render() {
		const { tree, properties, notes } = this.state;

		return (
			<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
				<Tree paddingLeft={20} tree={ tree } onChange={ this.treeChange } renderNode={ this.renderNode } addCat={ this.addCat } saveTree={ this.postTree } resetCategories={ this.resetCategories } />
				<NotePad notes={ notes } />
				<PropertyEditor properties={ properties } updateProps={ this.updateProps } addProp={ this.addProp } dragProp={ this.dragProp } removeProp={ this.removeProp }/>
			</div>
		);
	}
}

function parseProperties(propArray) {
	return propArray;
}

function concatUnique(propArray_1, propArray_2) {
	const
		nameIndex = propArray_1.map(prop => prop.name),
		result = propArray_1.slice(0);

	for (let i = 0; i < propArray_2.length; i++) {
		const prop = propArray_2[i];
		if (nameIndex.indexOf(prop.name) === -1) {
			result.push(prop);
		}
	}

	return result.filter(prop => prop.name);
}

function replaceTreeNode(tree, node) {
	if (!isNotEmpty(node.parent_indexes)) {
		tree.children[node.index] = node;
	} else if (node.parent_indexes.length === 1) {
		tree.children[node.parent_indexes[0]].children[node.index] = node;
	} else if (node.parent_indexes.length === 2) {
		tree.children[node.parent_indexes[0]].children[node.parent_indexes[1]].children[node.index] = node;
	}

	return tree;
}

function categoriesToTreeObject(categories) {
	const tree = {
		module: 'Drzewo Kategorii',
		type: 'root',
		children: []
	};

	for (let c = 0; c < categories.length; c++) {
		const
			category 		= categories[c],
			category_name 	= category.name,
			category_index 	= c,
			subcategories 	= category.subcategories,
			categoryModule 	= {
				module: category_name,
				type: 'category',
				index: category_index
			};

		if (category.subcategories) {
			categoryModule.children = [];

			for (let sc = 0; sc < subcategories.length; sc++) {
				const
					subcategory 		= subcategories[sc],
					subcategory_name	= subcategory.name,
					subcategory_index 	= sc,
					properties 			= subcategory.properties,
					subcategoryModule   = {
						module: subcategory_name,
						category: category_name,
						type: 'subcategory',
						index: subcategory_index,
						parent_indexes: [category_index]
					};

				if (subcategory.properties) {
					subcategoryModule.properties = subcategory.properties;
					//subcategoryModule.properties_seen = true;
				}
				// podkategoria - albo ma cechy albo jeszcze jeden poziom kategorii
				if (subcategory.sub_subcategories) {
					subcategoryModule.children = [];

					const
						subsubcategories 		= subcategory.sub_subcategories;

					for (let ssc = 0; ssc < subsubcategories.length; ssc++) {
						const
							subsubcategory 			= subsubcategories[ssc],
							subsubcategory_name 	= subsubcategory.name,
							subsubcategory_index 	= ssc,
							subsubcategoryModule 	= {
								module: subsubcategory_name,
								type: 'subsubcategory',
								index: subsubcategory_index,
								parent_indexes: [category_index, subcategory_index],
								leaf: true
							};

						if (subsubcategory.properties) {
							subsubcategoryModule.properties = subsubcategory.properties;
							//subsubcategoryModule.properties_seen = true;
						}

						subcategoryModule.children.push(subsubcategoryModule);
					}
				} else if (properties) {
					subcategoryModule.leaf = true;
					subcategoryModule.properties = properties;
				}

				categoryModule.children.push(subcategoryModule);
			}
		} else {
			// categoryModule.leaf = true;
		}

		tree.children.push(categoryModule);
	}

	return tree;
}

function categoriesToProperties(categories) {
	let properties = [];
	noteString = '';

	for (let c = 0; c < categories.length; c ++) {
		const category = categories[c];
			
		if (isNotEmpty(category.properties)) {
			properties = concatUnique(properties, parseProperties(category.properties));
		}

		if (isNotEmpty(category.subcategories)) {
			for (let sc = 0; sc < category.subcategories.length; sc++) {
				const subcategory = category.subcategories[sc];
				
				if (isNotEmpty(subcategory.properties)) {
					properties = concatUnique(properties, parseProperties(subcategory.properties));
				}

				if (isNotEmpty(subcategory.sub_subcategories)) {
					for (let ssc = 0; ssc < subcategory.sub_subcategories.length; ssc++) {
						const subsubcategory = subcategory.sub_subcategories[ssc];
						
						if (isNotEmpty(subsubcategory.properties)) {
							properties = concatUnique(properties, parseProperties(subsubcategory.properties));
						}
					}
				}
			}
		}
	}

	for (let i = 0; i < properties.length; i++) {
		const prop = properties[i];
		noteString += `- Przykładowe Podpowiedzi dla Cechy "${ prop.name }":\n\n${ prop.values.join(', ') }\n\n\n`;
	}

	return properties;
}

function recreateTreeIndexes(tree) {
	// categories
	if (isNotEmpty(tree.children)) {
		for (let c = 0; c < tree.children.length; c++) {
			tree.children[c].index = c;

			// subcategories
			if (isNotEmpty(tree.children[c].children)) {
				for (let sc = 0; sc < tree.children[c].children.length; sc++) {
					tree.children[c].children[sc].index = sc;
					tree.children[c].children[sc].parent_indexes = [c];

					// subsubcategories
					if (isNotEmpty(tree.children[c].children[sc].children)) {
						for (let ssc = 0; ssc < tree.children[c].children[sc].children.length; ssc++) {
							tree.children[c].children[sc].children[ssc].index = ssc;
							tree.children[c].children[sc].children[ssc].parent_indexes = [c, sc];
						}
					}
				}
			}
		}
	}

	return tree;
}

function mapCategoryStateToProps({ admin, categories }) {
	return { admin, categories };
}

Categories = connect(mapCategoryStateToProps, categoryActions)(Categories);
export default Categories;