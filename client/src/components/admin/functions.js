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
							properties 				= subcategory.properties,
							subsubcategoryModule 	= {
								module: subsubcategory_name,
								type: 'subsubcategory',
								index: subsubcategory_index,
								parent_indexes: [category_index, subcategory_index],
								leaf: true
							};

						if (properties) {
							subsubcategoryModule.properties = properties;
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

export { categoriesToTreeObject, categoriesToProperties, recreateTreeIndexes, replaceTreeNode };