import React, { Component } from 'react';

class RawImage extends Component {
    componentDidMount() {
        setTimeout(() => { if (this.imgRef) this.imgRef.style.opacity = 1; } , 310);
    }

    render() {
        const { data, link, blob } = this.props;

        if (data) {
            return <div ref={(e) => this.imgRef = e} className="absolute-center div-image-block" style={{ borderStyle: 'none', backgroundImage: `url(data:${data.type || 'image/jpeg'};base64,${data.data})` }}></div>;
        } else if (link) {
            return <div ref={(e) => this.imgRef = e} className="absolute-center div-image-block" style={{ borderStyle: 'none', backgroundImage: `url(/auction/${link._id}/photo)` }}></div>;
        } else if (blob) {
            return <img ref={(e) => this.imgRef = e} className="absolute-center img-image-block" src={ blob } />;
        }

        return null;
    }
}

export default RawImage;