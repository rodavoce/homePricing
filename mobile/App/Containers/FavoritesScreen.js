import React, { Component } from 'react'
import { Image, View, AppRegistry, ListView, StyleSheet, TouchableOpacity } from 'react-native'
import { Images } from '../Themes'
import { connect } from 'react-redux';
import { baseURL, createFavoriteAPI, deleteFavoriteAPI } from "../Services/Api";

// Native Base
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Body, Title, Content, Text, Button, Fab, Icon, ActionSheet } from 'native-base'

// Styles
import styles from './Styles/FavoriteStyle'

// Row comparison function
const rowHasChanged = (r1, r2) => r1.id !== r2.id

// DataSource template object
const ds = new ListView.DataSource({ rowHasChanged })

class FavoritesScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Favoritos',
  });

  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      dataSource: ds.cloneWithRows([])
    }
  }

  async getFavorites(id, token) {
    var auth = 'Bearer ' + token;
    try {
      let response = await fetch(baseURL + "/v1/favorites", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': auth
        },
        body: JSON.stringify({
          userId: id
        }),
      });
      let responseJson = await response.json();
      this.getParseFavorites(responseJson);
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async getParseFavorites(param) {
    var favs = [];
    var auxId = 0;
    for (let i = 0; i < param.length; i++) {
      try {
        let response = await fetch(baseURL + "/v1/houses/" + param[i].houseId);
        let responseJson = await response.json();
        if (responseJson.code !== 404) {
          let aux = responseJson.tipology.concat(" ", responseJson.condition);
          favs.push({
            id: auxId,
            idHouse: param[i].houseId,
            text: aux,
            location: responseJson.zone,
            price: responseJson.price,
            icon: Images.houseImage,
            active: true
          });
        } else {
          auxId--;
        }
      } catch (error) {
        console.error(error);
      }
      auxId++;
    }
    this.setState({ rows: favs });
    this.setState({ dataSource: ds.cloneWithRows(favs) });
    return favs;
  }

  componentDidMount() {
    this.getFavorites(this.props.user.user, this.props.user.token);
  }

  changeFavorite = (id) => {
    if (this.state.rows[id].active === true) {
      this.state.rows[id].active = false;
      deleteFavoriteAPI(this.props.user.user, this.state.rows[id].idHouse, this.props.user.token);
    } else {
      this.state.rows[id].active = true;
      createFavoriteAPI(this.props.user.user, this.state.rows[id].idHouse, this.props.user.token);
    }
    this.setState({ rows: this.state.rows });
    this.setState({ dataSource: ds.cloneWithRows(this.state.rows) });
  }

  renderRow = (rowData) => {
    return (
      <TouchableOpacity key={rowData.id} onPress={() => this.props.navigation.navigate('HouseInfScreen', { id: rowData.idHouse })}>
        <View style={styles.listItem}>
          <Image source={rowData.icon} style={styles.image} />
          <View style={styles.data}>
            <Text style={styles.title} >
              {rowData.text}
            </Text>
            <Text style={styles.info}>
              {rowData.location}
            </Text>
            <View style={styles.price}>
              <Text style={styles.info}>
                Preço: {rowData.price}
              </Text>
            </View>
          </View>
          <TouchableOpacity key={rowData.id} onPress={() => this.changeFavorite(rowData.id)}>
            <Image source={rowData.active === true ? Images.fullStarIcon : Images.starLines} style={styles.star} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

    )
  }

  render() {
    const list = <ListView enableEmptySections={true}
      dataSource={this.state.dataSource}
      renderRow={this.renderRow}
    />;
    const message = <Text style={styles.noFav}> Ainda não tem favoritos</Text>;
    return (
      <Container>
        {this.state.rows.length > 0 ? list : message}
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.login
  };
}

const connectedRegister = connect(mapStateToProps)(FavoritesScreen);
export { connectedRegister as FavoritesScreen };