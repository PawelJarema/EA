import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ image, i, removeImage, editPhoto }) => (
    <li className="container">
        <img className="image-preview absolute-center" src={ image.preview } />
        <span className="options">
            <span><i className="material-icons" onClick={ () => editPhoto(i) }>edit</i></span>
            <span><i className="material-icons" onClick={ () => removeImage(i) }>close</i></span>
        </span>
    </li>
));

const SortableList = SortableContainer(({ images, removeImage, editPhoto }) => (
    <ul className="thumbnails">
        { 
            images.map((image, index) => (
                <SortableItem key={'item_' + index} image={ image } index={ index } i={ index } removeImage={ removeImage } editPhoto={ editPhoto } />
            ))
        }
    </ul>
));

class ThumbnailPreview extends Component {
    render() {
        const { images, removeImage, editPhoto, onSortEnd } = this.props;

        if (!images) return;

        return (
            <SortableList images={ images } removeImage={ removeImage } editPhoto={ editPhoto } onSortEnd={ onSortEnd } pressDelay={200} axis="xy" helperClass="sortable-helper" />
        );
    }
}


export default ThumbnailPreview;