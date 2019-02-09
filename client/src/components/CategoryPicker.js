import React, { Component } from 'react';
import PropertyPicker from './PropertyPicker';

class CategoryPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: props.categories,
      subcategories: null,
      subsubcategories: null,

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
    const { categories, activeCategory, activeSubcategory, activeSubSubCategory } = this.state;

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
          <select name="category" onChange={ this.handleCategory } defaultValue="Wybierz...">
              {
                  categories !== null && categories.map(category  => <option key={ category.name }>{category.name}</option>)
              }
              <option>Wybierz...</option>
          </select><span className="label">Kategoria główna</span>
        </p>
        {
          isNotEmpty(subcategories) && (<p>
              <select name="subcategory" onChange={ this.handleCategory } defaultValue="Wybierz...">
                  {
                    subcategories.map(subcategory => <option key={ subcategory.name }>{subcategory.name}</option>)
                  }
                  <option>Wybierz...</option>
              </select><span className="label">podkategoria</span>
          </p>)
        }
        {
          isNotEmpty(subsubcategories) && (<p>
            <select name="subsubcategory" onChange={ this.handleCategory } defaultValue="Wybierz...">
              {
                subsubcategories.map(subsubcategory => <option key={ subsubcategory.name }>{subsubcategory.name}</option>)
              }
              <option>Wybierz...</option>
            </select><span className="label">podkategoria</span>
          </p>)
        }
        {
          isNotEmpty(properties) && <PropertyPicker properties={ properties } />
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

    