import React, { Component } from 'react';
import PropertyPicker from './PropertyPicker';

class CategoryPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: props.categories,

      activeCategory: null,
      activeSubcategory: null,
      activeSubSubCategory: null
    };

    this.handleCategory = this.handleCategory.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.categories && !this.state.categories) {
      this.setState({ categories: props.categories });
    }

    if (props.update && props.categoryData && !this.editPropertiesLoaded) {
      this.editPropertiesLoaded = true;

      const 
        { categories } = this.props,
        { category, subcategory, subsubcategory } = props.categoryData;

      if (!categories) return;

      const getIndex = (catSet, cat) => {
        if (!catSet || !category) return null;

        const index = catSet.map(cs => cs.name).indexOf(cat);
        return index !== -1 ? index : null;
      };

      const 
        activeCategory       = category ? getIndex(this.props.categories, category) : null,
        activeSubcategory    = subcategory ? getIndex(this.props.categories[activeCategory].subcategories, subcategory) : null,
        activeSubSubCategory = subsubcategory ? getIndex(this.props.categories[activeCategory].subcategories[activeSubcategory].sub_subcategories, subsubcategory) : null;

      this.setState({ activeCategory, activeSubcategory, activeSubSubCategory }, () => {
        if (isSet(activeCategory)) this.catRef.value = category;
        if (isSet(activeSubcategory)) this.subCatRef.value = subcategory;
        if (isSet(activeSubSubCategory)) this.subSubCatRef.value = subsubcategory;
      });

    }
  }

  handleCategory(event) {
    const
      select  = event.target,
      name    = select.name,
      index   = select.selectedIndex;

    switch (name) {
      case "category":
        this.setState({ activeCategory: index, activeSubcategory: null, activeSubSubCategory: null });
        break;
      case "subcategory":
        this.setState({ activeSubcategory: index, activeSubSubCategory: null });
        break;
      case "subsubcategory":
        this.setState({ activeSubSubCategory: index });
        break;
    }
  }

  render() {
    const 
      { update, categoryData, propertyData } = this.props,
      { categories, activeCategory, activeSubcategory, activeSubSubCategory } = this.state;

    if (!categories) return null;

    const 
      subcategories    = isSet(activeCategory) ? categories[activeCategory].subcategories : null,
      subcategory      = subcategories && isSet(activeSubcategory) ? subcategories[activeSubcategory] : null,
      subsubcategories = subcategory 
        ? 
        subcategory.sub_subcategories
          ? 
          subcategory.sub_subcategories 
          : 
          null 
        : 
        null,
      sub_subcategory  = subsubcategories && isSet(activeSubSubCategory) ? subsubcategories[activeSubSubCategory] : null,
      properties       = subcategory && isNotEmpty(subcategory.properties)
        ? 
        subcategory.properties
        :
        sub_subcategory && sub_subcategory.properties
          ?
          sub_subcategory.properties
          :
          null;

    return (
      <div>
        <p>
          <select ref={ (e) => this.catRef = e } name="category" onChange={ this.handleCategory } defaultValue="Wybierz...">
              {
                  categories !== null && categories.map(category  => <option key={ category.name }>{category.name}</option>)
              }
              <option>Wybierz...</option>
          </select><span className="label">Kategoria główna</span>
        </p>
        {
          isNotEmpty(subcategories) && (<p>
              <select ref={ (e) => this.subCatRef = e } name="subcategory" onChange={ this.handleCategory } defaultValue="Wybierz...">
                  {
                    subcategories.map(subcategory => <option key={ subcategory.name }>{subcategory.name}</option>)
                  }
                  <option>Wybierz...</option>
              </select><span className="label">podkategoria</span>
          </p>)
        }
        {
          isNotEmpty(subsubcategories) && (<p>
            <select ref={ (e) => this.subSubCatRef = e } name="subsubcategory" onChange={ this.handleCategory } defaultValue="Wybierz...">
              {
                subsubcategories.map(subsubcategory => <option key={ subsubcategory.name }>{subsubcategory.name}</option>)
              }
              <option>Wybierz...</option>
            </select><span className="label">podkategoria</span>
          </p>)
        }
        {
          isNotEmpty(properties) && <PropertyPicker properties={ properties } update={ update } propertyData={ propertyData } />
        }
      </div>
    );
  }
}

function isSet(number) {
  if (typeof number === 'number' && number >= 0) return true;
  return false;
}

function isNotEmpty(object) {
  if (Object.prototype.toString.call(object) === '[object Array]') {
    return object.length > 0;
  }

  return Boolean(object);
}

export { isSet, isNotEmpty };
export default CategoryPicker;

    