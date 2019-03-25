import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as auctionActions from '../../actions/auctionActions';
import * as profileActions from '../../actions/profileActions';

import { ProfileLinks } from '../Profile';
import CategoryPicker from '../CategoryPicker';

import Dropzone from 'react-dropzone';
import RichTextEditor from 'react-rte';

import b64toBlob from 'b64-to-blob';
import { arrayMove } from 'react-sortable-hoc';

import ThumbnailPreview from './ThumbnailPreview';
import ImageEditor from './ImageEditor';

import { UserHelper } from '../../helpers/UserHelper';
import { isSet, isNotEmpty, concatUnique } from './functions';

import AuctionPreview from './AuctionPreview';
import PromoteAuction from './PromoteAuction';

class CreateUpdateAuction extends Component {
   constructor(props) {
       super(props);

       let emptyValue = RichTextEditor.createEmptyValue();
       this.state = {
        subcategories: [], images: [], richText: emptyValue, description: emptyValue.toString('html'), message: [],
        categoryData: null, propertyData: null,
        editPhotoIndex: null,
        buyNowOption: false,
        preview: null,
        promote: null
       };

       this.addAttribute = this.addAttribute.bind(this);
       this.onDrop = this.onDrop.bind(this);
       this.shiftImageLeft = this.shiftImageLeft.bind(this);
       this.shiftImageRight = this.shiftImageRight.bind(this);
       this.removeImage = this.removeImage.bind(this);
       this.handleRichText = this.handleRichText.bind(this);
       this.validate = this.validate.bind(this);
       this.submit = this.submit.bind(this);
       this.saveEditedPhoto = this.saveEditedPhoto.bind(this);
       this.editPhoto = this.editPhoto.bind(this);
       this.onSortEnd = this.onSortEnd.bind(this);
       this.preview = this.preview.bind(this);
       this.promote = this.promote.bind(this);
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

   handleRichText(text) {
       this.setState({ richText: text, description: text.toString('html') });
   }

   componentDidMount() {
        this.props.clearAuction();
        let editor = document.querySelector('.rich-text-editor select');
        if (!editor)
            return;

        let options = editor.childNodes,
           option_text = ['Akapit', 'Duży nagłówek', 'Średni nagłówek', 'Mały nagłówek', 'Linia kodu'];

       for (let i = 0, l = options.length; i < l; i++) {
           options[i].innerHTML = option_text.shift();
       }

       const { update } = this.props;
       const { id } = this.props.match.params;

       if (update) {
            this.props.editAuction(id);
       }
   }

   componentWillReceiveProps(props) {
        if (this.props.auctions)
                return;

        if (props.auctions) {
            const { categoryData, propertyData } = this.state;
            const auction = props.auctions;

            if (!categoryData && !propertyData) {
                this.setState({
                    categoryData: {
                        category: auction.categories.main,
                        subcategory: auction.categories.sub,
                        subsubcategory: auction.categories.subsub
                    },
                    propertyData: {
                        properties: auction.properties,
                        int_properties: auction.int_properties
                    }
                });
            }

            const queryInput = query => document.querySelector('input' + query);
            const querySelect = query => document.querySelector('select' + query);
            const queryByName = query => document.querySelector(`[name="${query}"]`);
            let input;

            // title
            input = queryByName('title');
            input.value = auction.title;

            // categories and properties


            //input = queryByName('main');
            //input.value = auction.categories.main;
            //this.handleCategory({ target: input });
            // setTimeout(() => {
            //     input = queryByName('sub');
            //     input.value = auction.categories.sub;
            // }, 1000);

            // prices
            input = queryByName('start_price');
            input.value = auction.price.start_price;


            if (auction.price.buy_now_price) {
                this.setState({ buyNowOption: true }, () => {
                    input = queryByName('buy_now_price');
                    input.value = auction.price.buy_now_price;
                })
            }


            input = queryByName('min_price');
            input.value = auction.price.min_price;
            input = queryByName('hide_min_price');
            input.checked = auction.price.hide_min_price;

            //time
            input = queryByName('duration');
            input.value = auction.date.duration;

            // photos
            let count = 1,
                files = [];

            if (auction.photos) {
                auction.photos.forEach(photo => {
                    const   type    = photo.type || 'image/jpeg',
                            blob    = b64toBlob(photo.data, type);

                    files.push(blob);
                });

                this.onDrop(files);
            }

            if (auction.quantity) {
                input = queryByName('quantity');
                input.value = auction.quantity;
            }

            if (auction.attributes) {
                auction.attributes.map(attribute => {
                    switch(attribute.name) {
                        case 'Stan':
                            input = queryInput(`[name="attribute_Stan"][value="${attribute.value}"]`);
                            input.checked = true;
                            break;
                        default:
                            this.addAttribute(attribute.name);
                            input = queryByName(`attribute_${attribute.name}`);
                            input.value = attribute.value;
                    }
                });
            }

            //descriptions
            input = queryByName('shortdescription');
            input.value = auction.shortdescription;

            if (auction.description) {
                const text = RichTextEditor.createValueFromString(auction.description, 'html');
                this.handleRichText(text);
            }

            //deliveries
            if (auction.deliveries) {
                for (let i = 0; i < auction.deliveries.length; i++) {
                    const
                        delivery = auction.deliveries[i],
                        name     = `delivery_${delivery.name}_${delivery.price}`;

                    input = queryByName(name);
                    if (input) input.checked = true;
                }
            }
        }
   }

   componentWillUnmount() {
       const { images } = this.state;

       for (let i = 0, l = images.length; i < l; i++) {
            const image = images[i];
            URL.revokeObjectURL(image.preview);
       }
   }

    addAttribute(update_name) {
        let name = typeof update_name === 'string' ? update_name : window.prompt('Podaj nazwę atrybutu', 'Rozmiar');

        if (!name)
            return;

        let input = document.createElement('input');
        input.name = 'attribute_' + name;
        input.type = 'text';

        let label = document.createElement('label');
        label.for = 'attribute_' + name;
        label.innerText = name;

        this.attributesRef.appendChild(label);
        this.attributesRef.appendChild(input);
    }

    onDropRejected() {
        alert('Zdjęcie ma niewłaściwy format pliku lub jest za duże');
    }

    onDrop(files) {
        if (!files) return;

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

    shiftImageLeft(index) {
        this.setState(prev => {
            const
                images = prev.images,
                prevImg = images[index - 1];

            images[index - 1] = images[index];
            images[index] = prevImg;

            return { images };
        });
    }

    shiftImageRight(index) {
        this.setState(prev => {
            const
                images = prev.images,
                nextImg = images[index + 1];

            images[index + 1] = images[index];
            images[index] = nextImg;

            return { images };
        });
    }

    removeImage(index) {
        this.setState(prevState => {
            const images = prevState.images;

            if (images[index].preview) URL.revokeObjectURL(images[index].preview);
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

    preview() {
        const
            photos = this.state.images.map(item => item.preview),
            auction = makeAuction(new FormData(this.formRef));

        this.setState({ preview: { auction, photos } });

        window.scrollTo(0, 0);
    }

    submit(event) {
        event.preventDefault();

        const images = this.state.images;
        const formData = new FormData(this.formRef);

        const photoData = new FormData();
        if (this.props.auctions) {
            photoData.append('_id', this.props.auctions._id || null);
        }
        if (images.length > 0) {
            images.forEach(image => {
                photoData.append('images', image.file, image.file.name);
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

        if (!deliveryChecked()) {
            alert('Wybierz sposób dostawy towaru');
            allValid = false;
        }


        if (allValid) {
            if (this.props.update) {
                formData.append('auction_id', this.props.auctions._id);
                this.props.showSpinner();
                this.props.updateAuction(formData)
                    .then(
                        () => {
                            this.props.postPhotos(photoData);
                            this.promote(this.props.last_auction);
                        }
                    );
            } else {
                this.props.showSpinner();
                this.props.newAuction(formData)
                    .then(
                        () => {
                            this.props.postPhotos(photoData);
                            this.promote(this.props.last_auction);
                        }
                    );
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    editPhoto(index) {
        this.setState({ editPhotoIndex: index });
    }

    saveEditedPhoto(blob) {
        if (blob) {
            const { editPhotoIndex } = this.state;

            this.setState(({ images }) => {
                const files = images;
                URL.revokeObjectURL(files[editPhotoIndex].preview);

                files[editPhotoIndex] = { file: blob, preview: URL.createObjectURL(blob) };

                return { files };
            }, () => this.editPhoto(null));

        } else {
            this.editPhoto(null);
        }
    }

    onSortEnd({ oldIndex, newIndex }) {
        this.setState(({images}) => ({
            images: arrayMove(images, oldIndex, newIndex)
        }));
    }

    promote(auction) {
        // zostanie wywołana po dodaniu ogłoszenia
        if (auction) {
            this.setState({ promote: auction });
        } else {
            // test
            this.setState({ promote: true });
        }
    }

   render() {
       const
            { user, update, categories, auctions } = this.props,
            { categoryData, propertyData, preview } = this.state,
            userDataComplete = user && user.firstname && user.lastname && user.address,
            userHasFreebies = user.freebies ? Boolean(user.freebies.auctions) : false,
            deliveries = user.deliveries && user.deliveries.length,
            bids = auctions && auctions.bids && auctions.bids.length > 0,
            is18 = UserHelper.is18(user),
            isVerified = Boolean((user.security ? user.security.verified : false)),
            blockBuyNowPriceChange = auctions && isNotEmpty(auctions.buynowpayees),
            blockAllChanges = auctions && isNotEmpty(auctions.bids);

       // if (!update && !user.balance.credits) {
       //      return (
       //          <div className={ "Profile Auction" + ( update ? ' UpdateAuction' : ' CreateAuction')}>
       //              <ProfileLinks active="addauction" />
       //              <BuyCredits user={user} />
       //          </div>
       //      );
       // }


        // <p>
        //     <span className="label add-horizontal-margin"><span className="orange">*</span> Stan przedmiotu:
        //         <input name="attribute_Stan" type="radio" value="nowy" defaultChecked /><span className="label">nowy</span>

        //         <input name="attribute_Stan" type="radio" value="używany" /><span className="label">używany</span>
        //     </span>
        // </p>
        // <p className="attributes" ref={ e => this.attributesRef = e }></p>
        // <p>
        //     <span className="label add" onClick={this.addAttribute}><i className="material-icons">add_circle_outline</i>Dodaj atrybut</span>
        // </p>

        if (this.state.promote) return (
            <PromoteAuction
                user={ user }
                auction={ this.state.promote }
                close={ () => this.setState({ promote: null }) } />
        );

       return (
            <div>
                {
                    preview && (
                        <div className="AuctionPreview">
                            <h1><i className="material-icons clickable" onClick={ () => this.setState({ preview: null }) }>close</i> Podgląd ogłoszenia: </h1>
                            <br />
                            <AuctionPreview user={ user } auction={ preview && preview.auction } photos={ preview && preview.photos } />
                        </div>
                    )
                }
                <div className={ "Profile Auction" + ( update ? ' UpdateAuction' : ' CreateAuction') + (preview ? ' display-none' : '')}>
                    <ProfileLinks active="addauction" />
                    <div>
                        {
                            !is18 && <p className="warn">Osoba poniżej 18 lat nie może wystawiać aukcji</p>
                        }
                        {
                            !isVerified && <p className="warn">Aby dodać ogłoszenie, zweryfikuj adres email.</p>
                        }
                        {
                            blockAllChanges && <p className="warn">Nie można edytować aukcji. Ktoś już licytuje.</p>
                        }
                        {
                            !userDataComplete && <p className="warn"><i className="material-icons">warning</i> <span className="block">Zanim dodasz aukcję, uzupełnij dane w "<Link to="/konto/ustawienia">Ustawieniach konta</Link>" !</span></p>
                        }
                        {
                            !deliveries && <p className="warn"><i className="material-icons">warning</i> <span className="block">Zanim dodasz aukcję, wprowadź metody dostawy towaru w zakładce "<Link to="/konto/aukcje/dostawa">Dostawa</Link>" !</span></p>
                        }
                    <form ref={ e => this.formRef = e } className={"user-settings" + (!is18 || !isVerified || !userDataComplete || !deliveries || blockAllChanges ? ' disabled' : '')} action="/auction/create_or_update" method="post" encType="multipart/form-data">
                        <h1>{ update ? 'Edytuj aukcję' : 'Dodaj aukcję' }</h1>

                        <fieldset>
                            <legend><i className="material-icons">title</i>Tytuł</legend>
                            <p>
                                <label htmlFor="title" className="required">Tytuł aukcji</label>
                                <input name="title" type="string" onInput={this.validate} />
                                <span className="validation-message">{ this.state.message[0] }</span>
                            </p>
                        </fieldset>

                        <fieldset>
                            <legend><i className="material-icons">category</i>Kategorie i Cechy</legend>
                            <CategoryPicker categories={categories} update={ update } categoryData={ categoryData } propertyData={ propertyData } />
                        </fieldset>

                        <fieldset>
                            <legend><span className="lettr-icon">PLN</span>Cena</legend>
                            <p>
                                <span className="label add-horizontal-margin">
                                    <input name="buy_now_option" type="radio" onClick={ () => this.setState({ buyNowOption: false }) } checked={ !this.state.buyNowOption } />
                                    <span className="label"> Czysta licytacja</span>

                                    <input name="buy_now_option" type="radio" onClick={ () => this.setState({ buyNowOption: true }) } checked={ this.state.buyNowOption } />
                                    <span className="label"> Z opcją "Kup Teraz"</span>
                                </span>
                            </p>
                            <p>
                                <label htmlFor="start_price" className="required">Cena wywoławcza</label>
                                <span className="price-input-wrapper"><input name="start_price" type="number" step="0.01" onInput={this.validate} /></span>
                                <span className="validation-message">{ this.state.message[1] }</span>
                            </p>
                            {
                                this.state.buyNowOption &&
                                (
                                    <p>
                                        <label htmlFor="buy_now_price">Cena "Kup Teraz" <span style={{ opacity: 0.3 }}>{ (blockBuyNowPriceChange ? '- nie można zmienić ceny, ponieważ ktoś już kupił przedmiot' : null) }</span></label>
                                        <span className="price-input-wrapper"><input name="buy_now_price" type="number" step="0.01" className={ (blockBuyNowPriceChange ? 'disabled' : '') } /></span>
                                    </p>
                                )
                            }
                            <p>
                                <label htmlFor="min_price">Cena minimalna</label>
                                <span className="price-input-wrapper"><input name="min_price" type="number" step="0.01" /></span>
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
                                <label htmlFor="duration" className="required">Ilość dni</label>
                                <input name="duration" type="number" max="30" min="1" onInput={this.validate} />
                                <span className="validation-message">{ this.state.message[2] }</span>
                            </p>
                        </fieldset>

                        <fieldset>
                            <legend><i className="material-icons">exposure_plus_1</i>Ilość sztuk</legend>
                            <p>
                                <label htmlFor="quantity" className="required">Ilość sztuk</label>
                                <input name="quantity" type="number" min="1" onInput={this.validate} />
                                <span className="validation-message">{ this.state.message[3] }</span>
                            </p>
                        </fieldset>
                        {
                            isSet(this.state.editPhotoIndex)
                            ?
                            (
                                <ImageEditor src={ this.state.images[this.state.editPhotoIndex].preview } callback={ this.saveEditedPhoto } />
                            )
                            :
                            (
                                <fieldset>
                                    <legend><i className="material-icons">photo</i>Zdjęcia</legend>
                                    <p><label className="required" style={{ marginBottom: 4 }}>Dodaj chociaż 1 zdjęcie.</label></p>
                                    <Dropzone className="drag-and-drop-images"
                                        onDrop={ this.onDrop }
                                        onClick={ (e) => { if (e.target.className.indexOf('drag-and-drop-images') === -1) e.preventDefault() }}
                                        accept="image/jpeg,image/jpg,image/tiff,image/gif,image/png,image/svg"
                                        multiple={ true }
                                        onDropRejected={ this.onDropRejected }
                                    >
                                        <ThumbnailPreview images={this.state.images} onSortEnd={ this.onSortEnd } removeImage={ this.removeImage } editPhoto={ this.editPhoto } />
                                    </Dropzone>
                                </fieldset>
                            )
                        }

                        <fieldset>
                            <legend><i className="material-icons">description</i>Opis</legend>
                            <p>
                                <label htmlFor="shortdescription" className="required">Opis skrócony</label>
                                <input name="shortdescription" type="text" onInput={this.validate}/>
                                <span className="validation-message">{ this.state.message[4] }</span>
                            </p>
                            <RichTextEditor
                                className="rich-text-editor"
                                value={ this.state.richText }
                                onChange={ this.handleRichText }
                                placeholder="Opis szczegółowy"
                            />
                            <input name="description" type="hidden" value={this.state.description} />
                        </fieldset>

                        <fieldset>
                            <legend><i className="material-icons">local_shipping</i>Dostawa</legend>
                            <p><label className="required" style={{ marginBottom: 4 }}>Wybierz chociaż 1 sposób dostawy towaru</label></p>
                            <p className="auction-deliveries">
                                {
                                    concatUnique(user.deliveries, (auctions ? auctions.deliveries : null)).map((delivery, i) => (
                                        <span>
                                            <input type="checkbox" name={ "delivery_" + `${delivery.name}_${delivery.price}` } />
                                            <span className="checkbox-value"></span>
                                            <span className="label">{delivery.name} <span className="d-price">{delivery.price} zł</span></span>
                                        </span>
                                    ))
                                }
                            </p>
                            <br />
                            <span>
                                <span className="standard-button" onClick={ this.preview }>Podgląd ogłoszenia</span>
                                <button type="submit" onClick={this.submit}><i className="material-icons">save</i> Zapisz</button>
                            </span>
                        </fieldset>
                        <input type="hidden" name="start_date" value={ auctions && auctions.date ? auctions.date.start_date : new Date().getTime() } />
                    </form>

                    </div>
                </div>
            </div>
       );
   }
}

function makeAuction(formData) {
    const
        data = [...formData],
        auction = {};
        auction.deliveries = [];
        auction.properties = [];
        auction.int_properties = [];

    for (let i = 0; i < data.length; i++) {
        const
            keyValuePair = data[i],
            key = String(keyValuePair[0]),
            value = String(keyValuePair[1]);

        if (key.startsWith('delivery_')) {
            const split = key.split('_');
            auction.deliveries.push({ name: split[1], price: split[2] })
        } if (key.startsWith('property_')) {
            const split = key.split('_');
            auction.properties.push({ name: split[1].replace('%', ''), value });
        } else {
            auction[key] = value;
        }
    }

    return auction;
}

function deliveryInAuction(delivery, auction) {
    const deliveries = (auction.deliveries || []).map(d => d.name + d.price);
    return deliveries.indexOf(delivery.name + delivery.price) !== -1;
}

function deliveryChecked() {
    const deliveries = document.querySelectorAll('.auction-deliveries input:checked');
    return deliveries && deliveries.length > 0;
}

function mapAuctionsUserAndCategoryStateToProps({ auctions, user, categories, last_auction }) {
    return { auctions, user, categories, last_auction };
}

CreateUpdateAuction = connect(mapAuctionsUserAndCategoryStateToProps, {...profileActions, ...auctionActions})(CreateUpdateAuction);
export default CreateUpdateAuction;
