import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as auctionActions from '../actions/auctionActions';
import * as profileActions from '../actions/profileActions';
import './Auctions.css';

import { ProfileLinks } from './Profile';
import Dropzone from 'react-dropzone';
import RichTextEditor from 'react-rte';

class AuctionList extends Component {
    constructor(props) {
        super(props);
        this.state = { auctions: [] };
    }
    
    componentDidMount() {
        this.props.fetchAuctions();
    }
    
    componentWillReceiveProps(props) {
        if (props.auctions) {
            this.setState({ auctions: props.auctions });


            console.log(props.auctions);


        }
    }

    render() {
        return (
            <div className="AuctionList">
                { 
                    this.state.auctions.map(auction => {
                        return (
                            <div key={ auction.title } className="auction">
                                <div className="image-wrapper">
                                    <img className="absolute-center" src={ 'data:' + (auction.photos[0].type || 'image/jpeg') + ';base64,' + auction.photos[0].data } />
                                </div>
                                <div className="text">
                                    <h3>{ auction.title }</h3>
                                    <div dangerouslySetInnerHTML={{ __html: auction.shortdescription }}></div>
                                    <p><span className="price">Aktualna cena:</span> <span className="value">{ auction.price.current_price || auction.price.start_price }</span></p>
                                </div>
                                <div className="actions">
                                    <div>
                                        <i className="material-icons" onClick={ (e) => { let icon = e.target.innerHTML; e.target.innerHTML = (icon === 'favorite' ? 'favorite_outline' : 'favorite'); } }>favorite_outline</i>
                                        <button>Zobacz szczegóły</button>
                                        <button>Licytuj</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
};

class CreateUpdateAction extends Component {
   constructor(props) {
       super(props);
       
       let emptyValue = RichTextEditor.createEmptyValue();
       this.state = { subcategories: [], images: [], richText: emptyValue, description: emptyValue.toString('html'), message: [] };
       
       this.handleCategory = this.handleCategory.bind(this);
       this.addAttribute = this.addAttribute.bind(this);
       this.onDrop = this.onDrop.bind(this);
       this.removeImage = this.removeImage.bind(this);
       this.handleRichText = this.handleRichText.bind(this);
       this.validate = this.validate.bind(this);
       this.submit = this.submit.bind(this);
   }
    
   componentWillReceiveProps(props) {
       if (props.categories) {
           this.setState({ subcategories: props.categories[0].subcategories });
       }
   }
    
   handleCategory(event) {
       const select = event.target;
       const value = select.value;
       
       this.setState({ subcategories: this.props.categories.filter(cat => cat.name === value)[0].subcategories});
   }
    
   handleRichText(text) {
       this.setState({ richText: text, description: text.toString('html') });
   }
    
   componentDidMount() {
       let options = document.querySelector('.rich-text-editor select').childNodes,
           option_text = ['Akapit', 'Duży nagłówek', 'Średni nagłówek', 'Mały nagłówek', 'Linia kodu'];
       
       for (let i = 0, l = options.length; i < l; i++) {
           options[i].innerHTML = option_text.shift();
       }
   }
    
   componentWillUnmount() {
       const { images } = this.state;
       
       for (let i = 0, l = images.length; i < l; i++) {
            const image = images[i];
            URL.revokeObjectURL(image.preview);
       }
   }
    
    addAttribute() {
        let name = window.prompt('Podaj nazwę atrybutu', 'Rozmiar');
        
        let input = document.createElement('input');
        input.name = 'attribute_' + name;
        input.type = 'text';
        input.placeholder = name;
        
        this.attributesRef.appendChild(input);
    }
    
    onDropRejected() {
        alert('Zdjęcie ma niewłaściwy format pliku lub jest za duże');
    }
    
    onDrop(files) {
        if (this.state.images.length > 7) {
            alert('Dodaj maksymalnie 8 zdjęć');
            return;
        }
        
        if (files.length > (8 - this.state.images.length)) {
            files = files.slice(0, (8 - this.state.images.length));
        }
        
        this.setState(prevState => ({    
            images: prevState.images.concat(files.map(file => ({ file: file, preview: URL.createObjectURL(file) })))
        
        }));
    }

    removeImage(index) {
        this.setState(prevState => {
            const images = prevState.images;
            URL.revokeObjectURL(images[index].preview);
            return { images: images.slice(0, index).concat(images.slice(index + 1)) };
        });
    }

    validate(event) {
        const input = event.target;
        const name = input.name;
        const value = input.value;

        let message = [];

        switch(name) {
            case 'title':
                if (!/.{5,}/i.test(value)) message[0] = 'Wpisz tytuł';
                break;
            case 'start_price':
                if (!value) message[1] = 'Wpisz cenę wywoławczą';
                break;
            case 'duration':
                if (!value) message[2] = 'Wprowadź czas trwania aukcji';
                break;
            case 'quantity':
                if (!value) message[3] = 'Wprowadź ilość';
                break;
            case 'shortdescription':
                if (!/.{20,}/i.test(value)) message[4] = 'Podaj krótki opis przedmiotu dla wyników wyszukiwań';
                break;
        } 

        this.setState({ message });
        return message.length === 0;
    }
    
    submit(event) {
        event.preventDefault();

        const images = this.state.images;
        const formData = new FormData(this.formRef);
        if (images.length > 0) {
            images.forEach(image => {
                formData.append('images', image.file, image.file.name);
            });
        }

        let allValid = true;
        let inputs = document.querySelectorAll('.Auction input');
        for (let i = 0, l = inputs.length; i < l; i++) {
            if (this.validate({ target: inputs[i] }) !== true) {
                inputs[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }

        if (this.state.images.length < 1) {
            alert('Dodaj chociaż jedno zdjęcie');
            allValid = false;
        }

        if (allValid) {
            this.props.newAuction(formData);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            //this.formRef.reset();
        }
    }
    
   render() {
       const update = this.props.update === true;
       const categories = this.props.categories;
       
       return (
            <div className={ "Profile Auction" + ( update ? ' UpdateAuction' : ' CreateAuction')}>
                <ProfileLinks active="addauction" />
                <form ref={ e => this.formRef = e } className="user-settings" action="/auction/create_or_update" method="post" encType="multipart/form-data">
                    <h1>{ update ? 'Edytuj aukcję' : 'Dodaj aukcję' }</h1>
        
                    <fieldset>
                        <legend><i className="material-icons">line_style</i>Tytuł</legend>
                        <p>
                            <input name="title" type="string" placeholder="Tytuł aukcji" onInput={this.validate} />
                            <span className="validation-message">{ this.state.message[0] }</span>
                        </p>
                    </fieldset>
       
                    <fieldset>
                        <legend><i className="material-icons">category</i>Kategorie</legend>
                        <p>
                            <select name="main" onChange={ this.handleCategory }>
                                {
                                    categories !== null && categories.map(category => <option key={ category.name } >{category.name}</option>)
                                }
                            </select><span className="label">Kategoria główna</span>
                        </p>
                        <p>
                            <select name="sub">
                                {
                                    this.state.subcategories.map(subcategory => <option key={ subcategory.name }>{subcategory.name}</option>)
                                }
                            </select><span className="label">podkategoria</span>
                        </p>
                    </fieldset>
       
                    <fieldset>
                        <legend><i className="material-icons">monetization_on</i>Cena</legend>
                        <p>
                            <input name="start_price" type="number" placeholder="Cena wywoławcza" step="0.01"  onInput={this.validate} />
                            <span className="validation-message">{ this.state.message[1] }</span>
                        </p>
                        <p>
                            <input name="buy_now_price" type="number" placeholder="Cena kup teraz" step="0.01" />
                        </p>
                        <p>
                            <input name="min_price" type="number" placeholder="Cena minimalna" step="0.01" />
                        </p>
                        <p className="checkbox">
                            <span>
                                <input name="hide_min_price" type="checkbox" />
                                <span className="checkbox-value"></span>
                                <span className="label">Ukryj cenę minimalną</span>
                            </span>
                        </p>
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">access_time</i>Czas trwania</legend>
                        <p>
                            <input name="duration" type="number" placeholder="Ilość dni" max="30" min="1" onInput={this.validate} />
                            <span className="validation-message">{ this.state.message[2] }</span>
                        </p>
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">edit_attributes</i>Atrybuty</legend>
                        <p>
                            <input name="quantity" type="number" placeholder="Ilość sztuk" min="1" onInput={this.validate} />
                            <span className="validation-message">{ this.state.message[3] }</span>
                        </p>
                        <p className="attributes" ref={ e => this.attributesRef = e }></p>
                        <p>
                            <span className="label add" onClick={this.addAttribute}><i className="material-icons">add_circle_outline</i>Dodaj atrybut</span>
                        </p>
                        
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">photo</i>Zdjęcia</legend>
                        <Dropzone className="drag-and-drop-images" 
                            onDrop={ this.onDrop }
                            accept="image/jpeg,image/jpg,image/tiff,image/gif,image/png" 
                            multiple={ true }
                            onDropRejected={ this.onDropRejected }
                        >
                            <div className="thumbnails">
                                { 
                                    this.state.images.map((image, index) => (
                                        <div className="container" onClick={(e) => { e.preventDefault(); this.removeImage(index);}}>
                                            <img className="image-preview absolute-center" src={ image.preview } />
                                        </div>
                                    )) 
                                }
                            </div>  
                        </Dropzone>
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">description</i>Opis</legend>
                        <p>
                            <input name="shortdescription" type="text" placeholder="Opis skrócony" onInput={this.validate}/>
                            <span className="validation-message">{ this.state.message[4] }</span>
                        </p>
                        <RichTextEditor
                            className="rich-text-editor"
                            value={ this.state.richText }
                            onChange={ this.handleRichText }
                            placeholder="Opis szczegółowy"
                        />
                        <input name="description" type="hidden" value={this.state.description} />
                        <br />
                        <button type="submit" onClick={this.submit}>{ update ? 'Edytuj' : 'Zapisz' }</button>
                    </fieldset>
                    
                </form>
            </div>
       );
   }
}

function mapAuctionsStateToProps({ auctions }) {
    return { auctions };
}

function mapCategoryStateToProps({ categories }) {
    return { categories };
}

CreateUpdateAction = connect(mapCategoryStateToProps, profileActions)(CreateUpdateAction);
AuctionList = connect(mapAuctionsStateToProps, auctionActions)(AuctionList);

export { CreateUpdateAction, AuctionList };