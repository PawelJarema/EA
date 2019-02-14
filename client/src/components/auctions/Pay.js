import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as przelewy24Actions from '../../actions/przelewy24Actions';
import * as otherUserActions from '../../actions/otherUserActions';
import Modal from '../Modal';
import { userName } from './functions';

class Pay extends Component {
    constructor(props) {
        super(props);

        this.getPriceAndQty = this.getPriceAndQty.bind(this);
        this.pay = this.pay.bind(this);

        // paySimple: when no P24 Passage methods
        this.state = { ...(this.getPriceAndQty()), delivery_price: 0, delivery_method: '', paySimple: true }; 
    }

    getPriceAndQty() {
        const { auction, user } = this.props;
        const bought_now = auction.buynowpayees && auction.buynowpayees.indexOf(user._id) !== -1;
        const qty = bought_now ? auction.buynowpayees.filter(id => id === user._id).length : 1;
        const price = bought_now ? auction.price.buy_now_price * qty : auction.price.current_price;

        return { price, qty };
    }

    componentDidMount() {
        const { _user } = this.props.auction;
        this.props.fetchOtherUser(_user);
    }

    pay() {
        const { auction, user } = this.props;
        const { paySimple, price, qty, delivery_price, delivery_method } = this.state;

        if (!delivery_method) {
            alert('Wybierz metodę dostawy');
            return;
        }

        const data = {
            paySimple, 
            title: auction.title,
            price,
            shipping_price: delivery_price,
            shipping_method: delivery_method,
            qty,
            owner_id: auction._user,
            auction_id: auction._id
        };

        this.props.registerP24Transaction(data);
    }


    render() {
        const paySimple = this.state; // no P24 Passage account

        const { price, delivery_price, qty } = this.state;
        const { user, other_user, auction, callback } = this.props;

        if (other_user) {
            return (
                <div className="Pay">
                    <Modal
                        open={true}
                        title={<span><span className="thin"><i className="material-icons">payment</i></span><div className="title-text"><span className="thin">Zapłać za: </span> {auction.title} </div></span>}
                        actions={<button className="standard-button" onClick={this.pay}><i className="material-icons">payment</i>{ (paySimple ? 'Oznacz jako opłacone' : 'Zapłać') }</button>}
                        close={callback}
                    >
                        <form ref={ (e) => this.payformRef = e }>
                            <b>Zakupiłeś { qty } szt.</b> Wybierz metodę dostawy:
                            <table>
                            <tbody>
                            {
                                auction.deliveries.map((delivery, index) => (
                                    <tr>
                                        <td>
                                            <input key={'delivery_' + index} name="delivery" type="radio" value={1} onChange={() => this.setState({ delivery_price: delivery.price, delivery_method: delivery.name })} />
                                        </td>
                                        <td>
                                            {delivery.name}
                                        </td>
                                        <td>
                                            {delivery.price} zł
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                            </table>
                        </form>

                        <h1>Do zapłaty: { price + delivery_price } zł</h1>
                        {
                            paySimple && (<p>
                                <br/>Wykonaj teraz przelew na konto Sprzedawcy: 
                                <br/><br/>
                                <b>{ userName(other_user) } { other_user.firm ? other_user.firm.firm_name : '' }</b>
                                <br/>
                                <b>{ other_user.balance.account_number }</b>
                                <br/><br/>
                                Następnie oznacz aukcję jako opłaconą.
                            </p>)
                        }
                    </Modal>
                </div>
            );
        } else {
            return null;
        }
    }
}

function mapOtherUserStateToProps({ other_user }) {
    return { other_user };
}

Pay = connect(mapOtherUserStateToProps, {...otherUserActions, ...przelewy24Actions})(Pay);
export default Pay;