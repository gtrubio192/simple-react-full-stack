import React, { Component } from 'react';
import axios from 'axios';
import { Steps, Layout, Row, Col } from 'antd';
import FormPartOne from './components/QuoteForm/formPartOne';
import FormPartTwo from './components/QuoteForm/formPartTwo';
import QuoteModal from './components/quoteModal';
import './app.css';
import 'antd/dist/antd.css';


const { Step } = Steps;
const { Header, Footer, Content } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formOneComplete: false,
      formTwoComplete: false,
      currentStep: 0, 
      showModal: false,
      origins: [],
      hubs: ['78610', '77049', '75216', '80216', '78073', '43207'],
      shortestRoute: {}
    }

    // this.hubs = {
    //   austin: '78610',
    //   houston: '77049',
    //   dallas: '75216',
    //   denver: '80216',
    //   sanAntonio: '78073',
    //   ohio: '43207'
    // };

    this.containers = {
      "20_standard_new": "20' Standard New",
      "20_highCube_new": "20' High Cube New",
      "40_standard_new": "40' Standard New", 
      "40_highCube_new": "40' High Cube New",
      "20_standard_used": "20' Standard Used",
      "20_highCube_used": "20' High Cube Used", 
      "40_standard_used": "40' Standard Used", 
      "40_highCube_used": "40' High Cube Used"
    }

    this.hubPrices = {

    }
  }

  componentDidMount() {

  }

  calculateDistances = () => {
    let { origins, hubs } = this.state;

    axios.get(`/api/distance?origins=${origins}&hubs=${hubs}`)
      .then(res => res.data)
      .then(data => this.handleResponse(data))
      .catch(err => console.log('Unable to get distances: ', err))
  }

  handleResponse = (distances) => {
    console.log(distances);
    let initMax = Number.MAX_VALUE;

    let first = {
      distance: initMax,
      hub: ''
    }

    for (let i=0; i < this.state.origins.length; i++) {
      for (let j = 0; j < this.state.hubs.length; j++) {
          let origin = distances.origin_addresses[i];
          let destination = distances.destination_addresses[j];
          if (distances.rows[0].elements[j].status == 'OK') {
              let distance = distances.rows[i].elements[j].distance.text;
              let formattedDistance = parseInt(distance.replace(/,/g, ''), 10);
              console.log('Distance from ' + origin + ' to ' + destination + ' is ' + formattedDistance);
              
              if(formattedDistance < first.distance) {
                first.distance = formattedDistance
                first.hub = destination
              }

          } else {
              console.log(destination + ' is not reachable by land from ' + origin);
          }
      }
    }

    this.setState({
      shortestRoute: first,
     }, this.calculateTotalCost);
  }

  calculateDeliveryRate = () => {
    let shortestRoute = this.state.shortestRoute.distance;
    if(shortestRoute <= 25) {
      this.setState({
        shippingCost: 0,
      });
      return 0;
    }
    else {
      this.setState({
        shippingCost: (shortestRoute - 25)*3,
      })
      return (shortestRoute - 25)*3
    }
  }

  getContainerCostAtHub = () => {
    const hubPrices = {
      "Creedmoor, TX 78610, USA": {
        "20_standard_new": "3571",
        "20_highCube_new": "4429",
        "40_standard_new": "5601",
        "40_highCube_new": "6000",
        "20_standard_used": "2000",
        "20_highCube_used":  "-1",
        "40_standard_used": "2714",
        "40_highCube_used": "2857",
      },
      "Houston, TX 77049, USA": {
        "20_standard_new": "3571",
        "20_highCube_new": "4429",
        "40_standard_new": "5601",
        "40_highCube_new": "6000",
        "20_standard_used": "1714",
        "20_highCube_used":  "-1",
        "40_standard_used": "2143",
        "40_highCube_used": "2286",
      },
      "Dallas, TX 75216, USA": {

      },
      "Denver, CO 80216, USA": { 

      },
      "Von Ormy, TX 78073, USA": {

      },
      "Obetz, OH 43207, USA": {

      } 
    }

    return hubPrices[this.state.shortestRoute.hub][this.state.container]

  }

  calculateTotalCost = () => {
    let totalPrice = this.calculateDeliveryRate() + this.getContainerCostAtHub()*this.state.quantity
    this.setState({
      totalPrice,
      showModal: true
    })
  }


  formOneComplete = (isComplete, values) => {
    this.setState({
      formOneComplete: isComplete,
      currentStep: 1,
      origins: [values.Zip],
      container: values.Size,
      quantity: values.Quantity,
    }, this.calculateDistances);
  }

  handleModalOk = () => {
    console.log('user closed modal... ')
    this.setState({ showModal: false });
  }

  formTwoComplete = (isComplete, values) => {
    this.setState({ 
      formTwoComplete: isComplete,
      currentStep: 2,
      userInfo: values
    })
  }

  render() {

    let mockDetails = {
      totalPrice: this.state.totalPrice,
      shippingCost: this.state.shippingCost,
      deliveryHub: this.state.shortestRoute.hub,
      container: this.containers[this.state.container]
    };


    

    return (
      <div className="App">
        <Layout>
          <Header>
            <img className="logo" src='https://cdn.shopify.com/s/files/1/0313/5032/5381/files/450x200_-logo-bobs.jpeg?v=1581624152' width="120px"/>
          </Header>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <Steps current={this.state.currentStep}>
                  <Step title="Order Info" />
                  <Step title="User Info" />
                  <Step title="Complete Order" />
                </Steps>
              </Col>
            </Row>
            {
              !this.state.formOneComplete
              ? <FormPartOne formOneComplete={this.formOneComplete} />
              : !this.state.formTwoComplete
              ? <FormPartTwo formTwoComplete={this.formTwoComplete} />
              : <div>COMPLETE</div>
            }
            {
              this.state.showModal
              ? <QuoteModal visible={this.state.showModal} handleOk={this.handleModalOk} details={mockDetails} />
              : null
            }
            {/* <FormPartTwo formTwoComplete={this.formTwoComplete} zip={this.state.zip} /> */}
          </Content>
          <Footer>
            Contact Us
            <p>PHONE NUMBER</p>
            <p>EMAIL</p>
          </Footer>
        </Layout>
      </div>
    );
  }
}
