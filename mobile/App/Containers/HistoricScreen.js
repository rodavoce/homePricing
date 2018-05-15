import { Images } from '../Themes'
import React, { Component } from 'react'
import { View, Image, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import Grid from 'react-native-grid-list'
import { connect } from 'react-redux';

// Native Base
import { Container, Header, Left, Right, Body, Title, Content, Button, Text, Icon, Item, Input, Segment, Card, CardItem } from 'native-base'

// Styles
import styles from './Styles/HistoricScreenStyles'
import { baseURL } from "../Services/Api";
// Component
class HistoricScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Histórico',
  });

  // This component's constructor
  constructor(props) {

    super(props)
    this.state = {
      houses: []
    }
  }

  // Fetch data here
  componentDidMount() {
    fetch(baseURL + "/v1/history/" + this.props.user.user.id)
      .then(function (response) {
        return response.json();
      })
      .then(responseJson => {
        this.setState({ houses: responseJson });
      })
    .catch(function (json) {
      console.error(json)
    })
  }

  // Clear data here
  componentWillUnmount() {
    this.setState({ houses: [] })
  }

  // Parse date
  parseDate(toParse) {
    var parsed = {};
    var date = time = "";

    for (var i = 0; i < 16; i++) {
      if (i >= 0 && i < 10) {
        date += toParse[i];
      }
      if (i > 10) {
        time += toParse[i];
      }
    }
    parsed.date = date;
    parsed.time = time;
    return parsed;
  }

  // Render the screen
  render() {

    const { navigate } = this.props.navigation;


    return (
      <Container>

        <Content padder>
          <View style={{ marginBottom: 20 }}>
            {
              this.state.houses.map((item, index) => {
                let image = (item.house.images.length != 0) ? item.house.images[0] : "https://www.glassyconnections.com/images/no-image-available-lrg.jpg";
                return (
                  <View style={styles.box1} key={index} >
                    <View style={{ flex: 0.35, width: '10%', height: 50 }} >
                      {<Image style={{ height: 100, width: null, flex: 1 }} source={{ uri: image }} />}
                    </View>

                    <View style={{ flex: 0.65 }}>


                      <Button transparent onPress={() => navigate('HouseInformation', { house: item.house })}>
                        <Text style={styles.address}>
                          <Icon ios={'ios-pin'} android={'md-pin'} style={styles.address} /> {item.house.address.town}
                        </Text>
                      </Button>

                      <Text style={styles.date}>
                        {"Seen on: " + this.parseDate(item.createdAt).date + " " + this.parseDate(item.createdAt).time}
                      </Text>
                    </View>
                  </View>
                )
              })
            }
          </View>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.login
  };
}

const connectedRegister = connect(mapStateToProps)(HistoricScreen);
export { connectedRegister as HistoricScreen };