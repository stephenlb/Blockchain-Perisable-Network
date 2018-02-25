import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
// import { Navbar, Jumbotron, Button } from 'react-bootstrap';

class App extends Component {
  constructor(){
    super();
    this.state = {
      store: {
        name: "Joe's",
        location: "Berkeley, California"
      },
      buyer: {
        name: "Ford's Store",
        location: "Chicago, Illinois",
      },
      product: {
        name: "Organic apple",
        quantity: 3000,
      },
      shipmentStatus: "not ordered yet",
    };
    this.renderTempReading = this.renderTempReading.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleTempReading = this.handleTempReading.bind(this);
  }
  handleReset(e){
    axios.get("https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-98eb5f08-0ab6-11e8-9ee9-aeafdaeaa581/reset-db")
      .then(res => {
        console.log("Response from Reset Button",res);
        this.setState(prevState => {
          return {
            "store": prevState.store,
            "buyer": prevState.buyer,
            "product": prevState.product,
            "blockchain": res.data,
            "shipmentStatus": "not ordered yet",
            "shipmentTemp": prevState.shipmentTemp,
          }
        })
      })
  }
  handleClick(e){
    if (this.state.shipmentStatus === "not ordered yet"){
      axios.post("https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-98eb5f08-0ab6-11e8-9ee9-aeafdaeaa581/new-transaction", 
        {
          "from": this.state.store.name,
          "to": this.state.buyer.name,
          "productName": this.state.product.name,
          "quantity": this.state.product.quantity,
          "action": "submitting order",
        })
      .then(res => {
        console.log("response from POST req", res);
        this.setState(prevState => {
          return {
            "store": prevState.store,
            "buyer": prevState.buyer,
            "product": prevState.product,
            "blockchain": res.data,
            "shipmentStatus": "ordered",
            "shipmentTemp": prevState.shipmentTemp,
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
    }
    if (this.state.shipmentStatus === "ordered"){
      axios.post("https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-98eb5f08-0ab6-11e8-9ee9-aeafdaeaa581/new-transaction",
        {
          "from": this.state.store.name,
          "to": this.state.buyer.name,
          "productName": this.state.product.name,
          "quantity": this.state.product.quantity,
          "action": "shipping",
        })
        .then(res => {
          console.log("response from POST req", res);
          this.setState(prevState => {
            return {
              "store": prevState.store,
              "buyer": prevState.buyer,
              "product": prevState.product,
              "blockchain": res.data,
              "shipmentStatus": "shipped",
              "shipmentTemp": prevState.shipmentTemp,
            }
          })
        })
    }
    if (this.state.shipmentStatus === "shipped") {
      axios.post("https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-98eb5f08-0ab6-11e8-9ee9-aeafdaeaa581/new-transaction",
        {
          "from": this.state.store.name,
          "to": this.state.buyer.name,
          "productName": this.state.product.name,
          "quantity": this.state.product.quantity,
          "action": "picking up the shipment",
        })
        .then(res => {
          console.log("response from POST req", res);
          this.setState(prevState => {
            return {
              "store": prevState.store,
              "buyer": prevState.buyer,
              "product": prevState.product,
              "blockchain": res.data,
              "shipmentStatus": "delivered",
              "shipmentTemp": prevState.shipmentTemp,
            }
          })
        })
    }
  }
  componentWillMount(){
    axios.get('https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-98eb5f08-0ab6-11e8-9ee9-aeafdaeaa581/transaction')
      .then( res => {
        console.log(res);
        this.setState((prevState) => {
          return {
            "store": prevState.store,
            "buyer": prevState.buyer,
            "product": prevState.product,
            "shipmentStatus": prevState.shipmentStatus,
            "blockchain": res.data,
            "shipmentTemp": prevState.shipmentTemp,
          }
        })
      })
  }
  handleTempReading(){
    axios.post("https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-98eb5f08-0ab6-11e8-9ee9-aeafdaeaa581/new-transaction",
      {
        "productName": this.state.product.name,
        "quantity": this.state.product.quantity,
        "action": "temp reading",
        "temperature of shipment": 56,
      })
      .then(res => {
        console.log("response from POST req", res);
        this.setState(prevState => {
          return {
            "store": prevState.store,
            "buyer": prevState.buyer,
            "product": prevState.product,
            "blockchain": res.data,
            "shipmentStatus": prevState.shipmentStatus,
            "shipmentTemp": 56,
          }
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
  renderTempReading(){
    if (this.state.shipmentStatus === "shipped")
    return (
      <button onClick={this.handleTempReading} className="btn btn-primary">Temperature Reading from IoT</button>
    )
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Blockchain Transaction</h1>
        </header>
        <div className="row">
          <div className="col-md-4">
            <h5> Shipper </h5>
            <h1> {this.state.store.name} </h1>
            <p> location {this.state.store.location} </p>
          </div>
          <div className="col-md-4">
            <h5> Buyer </h5>
            <h1> {this.state.buyer.name} </h1>
            <p> location {this.state.buyer.location} </p>
          </div>
          <div className="col-md-4">
            <h5> Product Info </h5>
            <h1> {this.state.product.name} </h1>
            <p> quantity {this.state.product.quantity} </p>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <h5> shipment information </h5>
            <p> Shipment Status: {this.state.shipmentStatus} </p>
            <p> Shipment Temperature: {this.state.shipmentTemp} </p>
          </div>
          <div className="col-md-6">
            {this.renderTempReading()}
            <button onClick={this.handleClick} className="btn btn-primary">Next Shipment Step</button>
            <button onClick={this.handleReset} className="btn btn-primary">Reset</button>
          </div>
        </div>
        <div>
          <pre className = 'blockchain'>{JSON.stringify(this.state.blockchain, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default App;
