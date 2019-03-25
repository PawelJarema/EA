import React, { Component } from 'react';
import md5 from 'md5';

class TestWebApi extends Component {
    state = { res: '' };

    // /api/webapi              - test connection
    // /api/user_exists         - check if account exists with particular email
    // * /api/webapi/user         - get user data
    // /api/webapi/post_auction - check if user account exists and creates post if provided data is sufficient

    test() {
        const
        appAuthSecret = 'Polmarket_12WsdfRghjnlPqwWefdsgeqwerIjh34%6%2dgdhsSl1_',
        date = Date.now(),
        email = 'pawel.jarema@dd1studio.com',
        password = 'boguspassword',
        token = md5(`${ date }|${ appAuthSecret }|${ email }|${ password }`),
        bogusData = {
            date_milliseconds: date,
            user_email: email,
            user_password: password,
            token,
            deliveries: [ { name: 'bogus delivery', price: 1234 } ],

            // post_user:
            // firstname: 'Pawelec',
            // lastname: 'Jarema',
            // birthdate: Date.now() - 18 * 365 * 24 * 60 * 60 * 1000,
            // address_street: 'Hoża',
            // address_postal: '80-628',
            // address_city: 'Gdańsk',
            // account_number: '12345678901234567890123456',

            // post_auction:
            title: 'Test Api auction',
            // shortdescription: 'ok',
            // description: '',
            // start_price: 333,
            // duration: 30,
            // quantity: 2,
            //
            // min_price: null,
            // buy_now_price: null,
            // hide_min_price: null,
            //
            // category_main: 'Moda',
            // category_sub: 'Męska',
            // category_subsub: 'Odzież',
            //
            // properties: [{ name: 'prop', value: 'some string' }],
            // int_properties: [ { name: 'int prop', value: 123 }]
        };

        // post_photos
        const
          url = '/api/webapi/' + 'get_auction_id',
          photoFormData = new FormData();
        photoFormData.append('_id', '5c98b4d52701ad063450be7e');
        photoFormData.append('date_milliseconds', date);
        photoFormData.append('user_email', email);
        photoFormData.append('user_password', password);
        photoFormData.append('token', token);

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, //'application/json' },
            body: JSON.stringify(bogusData) //photoFormData
        })
        .then(res => res.text())
        .then(res => this.setState({ res }));
    }

    render() {
        return (
            <div>
                <button onClick={ this.test.bind(this) }>Test</button>
                { this.state.res }
                <div dangerouslySetInnerHTML={{ __html: this.state.res }} />
            </div>
        );
    }
}

export default TestWebApi;
