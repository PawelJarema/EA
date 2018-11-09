import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as auctionActions from '../actions/auctionActions';
import * as profileActions from '../actions/profileActions';
import './Auctions.css';

import { Link } from 'react-router-dom';
import { ProfileLinks } from './Profile';
import { Seller } from './OtherUser';

import Dropzone from 'react-dropzone';
import RichTextEditor from 'react-rte';

import Progress from './Progress';

class RawImage extends Component {

    render() {
        const data = this.props.data;
        return <img className="absolute-center" src={ 'data:' + (data.type || 'image/jpeg') + ';base64,' + data.data } />;
    }
}

class AuctionDetails extends Component {
    constructor(props) {
        super(props);        
        this.state = { auction: '' };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        const auction_id = this.props.match.params.id;
        this.props.fetchAuction(auction_id);
    }

    componentWillReceiveProps(props) {
        if (props.auctions) {
            this.setState({ auction: props.auctions });
        }
    }

    handleTab(event) {
        event.preventDefault();
        const link = event.target;
        const tab = document.getElementById(link.href.split('#')[1]);

        if (link.className.indexOf('active') === -1) {
            let prev = document.querySelectorAll('.tab-view .active');
            for (let i = 0, l = prev.length; i < l; i++) {
                prev[i].className = prev[i].className.replace(/\s*active/g, '');
            }

            link.className += 'active';
            tab.className += 'active';
        }

    }

    submit(event) {
        event.preventDefault();

        const formData = new FormData(this.formRef);
        alert('send');
    }

    render() {
        const auction = this.state.auction;

        return (
            <div className="AuctionDetails">
                {
                    !auction ? <Progress /> : (
                        <div className="auction-view">
                            <div className="basic-info">
                                <div className="photos">
                                    <div className="photo-big">
                                        <div className="image-wrapper">
                                            {
                                                auction.photos.length 
                                                ?
                                                <RawImage data={auction.photos[0]} />
                                                :
                                                <div className='no-image'></div>
                                            }
                                        </div>
                                    </div>
                                    <div className="photos-small">
                                    </div>
                                </div>

                                <div className="text">
                                    <div className="content">
                                        <h1>{ auction.title }</h1>
                                        <p>{auction.shortdescription}</p>
                                        <p className="attribute-tags">
                                            {
                                                auction.attributes.map(attr => (
                                                    <span key={`${attr.name}_${attr.value}`} className="attribute">{attr.name}<span>{attr.value}</span></span>
                                                ))
                                            }
                                        </p> 
                                        <div>
                                            <div className="price">Aktualna cena: <span className="value">{ auction.price.current_price || auction.price.start_price }</span></div>
                                            <form ref={ (e) => this.formRef = e } action="/auction/bid" method="post">
                                                <input name="bid" placeholder="Kwota" min="5" step="1" />
                                                <button type="submit" onClick={this.submit}><i className="material-icons">gavel</i>Podbij</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tab-view">
                                <div className="tab-controls">
                                    <a className="active"  href="#bids" onClick={this.handleTab}>Stan licytacji</a>
                                    <a href="#description" onClick={this.handleTab}>Opis przedmiotu</a>
                                    <a href="#seller" onClick={this.handleTab}>Sprzedawca</a>
                                    <a href="#shipping" onClick={this.handleTab}>Metody dostawy i zwroty</a>
                                </div>
                                <div className="tab-content-area">
                                    <div className="active" id="bids">
                                    </div>
                                    <div id="description">
                                        { 
                                            auction.description && auction.description.length > 20 ? 
                                            <div className="html-description" dangerouslySetInnerHTML={{ __html: auction.description }}></div> 
                                            :
                                            <div className="no-result">
                                                <i className="material-icons">sentiment_dissatisfied</i>
                                                <h1>Brak dodatkowych informacji</h1>
                                                <p>Sprzedawca nie dodał opisu rozszerzonego.<br />Zadaj pytanie o przedmiot w zakładce 'Sprzedawca'</p>
                                            </div>
                                        }
                                    </div>
                                    <div id="seller">
                                        <Seller id={ auction._user } />
                                    </div>
                                    <div id="shipping">d
                                    </div>
                                </div>
                            </div>


                        </div>
                    )
                }
            </div>
        );
    }
}

class Pagination extends Component {
    render() {
        const page = this.props.page;
        const pages = this.props.pages;
        const clickHandler = this.props.clickHandler;

        return (
            <div className="pagination-wrapper">
                <div className="pagination">
                    {
                        Array.from({length: pages}, (v, k) => (k + 1)).map(index => (
                            <a key={'page_' + index} 
                                onClick={() => clickHandler(index)}
                                className={index === page ? 'active' : ''}
                            >{index}</a>
                        ))
                    }
                </div>
            </div>
        )
    }
}
class AuctionList extends Component {
    constructor(props) {
        super(props);
        this.state = { auctions: [] };
        this.page = 1;
        this.pages = 1;
        this.auctions_per_page = 10;
        this.query = null;

        this.paginateTo = this.paginateTo.bind(this);
        this.no_result = false;

        this.getQuery = (props) => {
            const propz = props || this.props;
            if (Object.keys(propz.match.params).length) {
                const params = propz.match.params;
                const category = params.category;
                const query = params.query;

                const min = params.min;
                const max = params.max;
                const state = params.state;
                const sort = params.sort;


                if (!this.query || category != this.query.category || query != this.query.query || this.query.min != min || this.query.max != max || this.query.state != state || this.query.sort != sort ) {
                    this.query = { category, query, min, max, state, sort };
                    return true;
                }
            } else {
                this.query = null
            }

            return false;
        }

        this.getQuery = this.getQuery.bind(this);
        this.getQuery();
    }
    
    componentDidMount() {     
        this.props.paginate(1, this.auctions_per_page, this.query);
    }
    
    componentWillReceiveProps(props) {
        if (props.auctions) {
            this.getQuery();

            if (typeof props.auctions[props.auctions.length - 1] === 'number') {
                const count = props.auctions.pop();
                const pages = Math.ceil(count / this.auctions_per_page);

                this.pages = pages;
                if (this.page > pages) {
                    this.page = pages;
                }

                this.setState({ auctions: props.auctions });

                if (count === 0) {
                    this.no_result = true;
                }
            }
        }

        if (this.getQuery(props)) {
            this.props.paginate(this.page || 1, this.auctions_per_page, this.query);
            this.no_result = false;
        }
    }

    paginateTo(index) {
        this.page = index;
        this.props.paginate(index, this.auctions_per_page, this.query);
    }

    render() {
        const auctions = this.state.auctions;

        return (
            <div className="AuctionList">
                {
                    this.pages > 1 && auctions.length > 2 && <Pagination page={this.page} pages={this.pages} clickHandler={this.paginateTo}/>
                }
                { 
                    !auctions.length && !this.no_result ? <Progress /> :
                    auctions.map((auction, i) => {
                        const photo = auction.photos[0] || {};
                        const photo_type = photo.type || '';
                        const photo_raw = photo.data || '';

                        return (
                            <div key={ auction.title + '_' + i } className="auction">
                                <div className="image-wrapper">
                                    {
                                        photo_raw ? <img className="absolute-center" src={ 'data:' + (photo_type || 'image/jpeg') + ';base64,' + photo_raw } /> : <div className="no-image"></div>
                                    }
                                </div>
                                <div className="text">
                                    <h3>{ auction.title }</h3>
                                    <div className="short-description">{auction.shortdescription }</div>
                                    <p><span className="price">Aktualna cena:</span> <span className="value">{ auction.price.current_price || auction.price.start_price }</span></p>

                                    <div className="actions">
                                        <div>
                                            <Link to={'/aukcje/' + auction._id }><button>Zobacz szczegóły</button></Link>
                                            <button>Licytuj</button>
                                            <i className="material-icons" onClick={ (e) => { let icon = e.target.innerHTML; e.target.innerHTML = (icon === 'favorite' ? 'favorite_outline' : 'favorite'); } }>favorite_outline</i>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        )
                    })
                }
                {
                    this.no_result && (
                        <div className="no-result">
                            <div>
                                <i className="material-icons">folder_open</i>
                                <h1>Nic nie znalazłem.</h1>
                                <p>Skorzystaj z wyszukiwania zaawansowanego<br /> albo spróbuj pnownie za jakiś czas.</p>
                            </div>
                        </div>
                    )
                }
                {
                    this.pages > 1 && <Pagination page={this.page} pages={this.pages} clickHandler={this.paginateTo}/>
                }
            </div>
        );
    }
};
// dangerouslySetInnerHTML={{ __html: }}
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
    
   componentWillMount() {
        if (this.props.categories && this.state.subcategories.length === 0) {
            this.setState({ subcategories: this.props.categories[0].subcategories });
        }
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
                if (!/.{4,}/i.test(value)) message[0] = 'Wpisz tytuł';
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
                if (!/.{10,}/i.test(value)) message[4] = 'Podaj krótki opis przedmiotu dla wyników wyszukiwań';
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
                        <legend><i className="material-icons">title</i>Tytuł</legend>
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
                            <span className="label add-horizontal-margin">Stan przedmiotu:
                                <input name="attribute_Stan" type="radio" value="nowy" checked /><span className="label">nowy</span>
                        
                                <input name="attribute_Stan" type="radio" value="używany" /><span className="label">używany</span>
                            </span>
                        </p>
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
                            accept="image/jpeg,image/jpg,image/tiff,image/gif,image/png,image/svg" 
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
AuctionDetails = connect(mapAuctionsStateToProps, auctionActions)(AuctionDetails);

export { CreateUpdateAction, AuctionList, AuctionDetails };