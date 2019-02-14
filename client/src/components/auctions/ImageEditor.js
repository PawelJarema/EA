import React, { Component } from 'react';
import b64toBlob from 'b64-to-blob';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { IMAGE_ASPECT_RATIO } from './constants';

class ImageEditor extends Component {
    constructor(props) {
        super(props);

        this.state = { rotation: 0 };

        this.rotateLeft = this.rotateLeft.bind(this);
        this.rotateRight = this.rotateRight.bind(this);
        this.apply = this.apply.bind(this);
        this.crop = this.crop.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    rotateLeft() {
        this.setState(({ rotation }) => ({ rotation: rotation - 45 }), this.apply);
    }

    rotateRight() {
        this.setState(({ rotation }) => ({ rotation: rotation + 45 }), this.apply);
    }

    apply() {
        this.refs.cropper.rotateTo(this.state.rotation);
    }

    crop() {
        const 
            { callback } = this.props,
            base64  = this.refs.cropper.getCroppedCanvas().toDataURL(),
            type    = base64.slice(5, base64.indexOf(';')),
            blob    = b64toBlob(base64.split('base64,')[1], type);

        if (callback) {
            callback(blob);
        }
    }

    cancel() {
        const { callback } = this.props;
        if (callback) {
            callback(null);
        }
    }

    render() {
        const { src } = this.props;
        return (
            <div className="cropper">
                <div className="title">Przetwórz zdjęcie</div>
                <Cropper ref="cropper" src={ src } aspectRatio={ IMAGE_ASPECT_RATIO } zoomOnWheel={false} />
                <div className="options">
                    <div onClick={ this.rotateLeft }><i className="material-icons">rotate_left</i></div>
                    <div onClick={ this.rotateRight }><i className="material-icons">rotate_right</i></div>
                    <div onClick={ this.cancel }><i className="material-icons">close</i></div>
                    <div onClick={ this.crop }><i className="material-icons">done</i></div>
                </div>
            </div>
        );
    }
}

export default ImageEditor;