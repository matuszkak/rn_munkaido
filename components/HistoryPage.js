import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, YellowBox, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import trashIcon from '../assets/Trash_font_awesome.js';
import { deleteHistoryById, getHistory } from '../database';


export default function HistoryPage(props) {
  const [history, setHistory] = useState([]);

  // Process history item deletion request
  const twoButtonAlert = () =>
    Alert.alert('Biztos töröljem?', 'Ez esetben nyomj OK-t!', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'OK', onPress: () => {
          console.log(props.userData.email, history[0].id),
            deleteHistoryById(props.userData.email, history[0].id),
            setHistory(history.previousState),
            props.toggleUserState()
          props.navigation.navigate('Munkaidő Nyilvántartó')
        }
      },
    ]);

  const renderItem = ({ item, index }) => (

    <View
      style={[
        styles.historyItemContainer,
        styles.shadow,
        item.state === 'in' ? styles.containerIn : styles.containerOut,
      ]}>
      <View style={styles.historyTextContainer}>

        <View>
          < Text style={styles.currentStateText}>{item.date.toDate().toLocaleString('hu-HU')}</Text>
          <Text
            style={[
              styles.currentStateText,
              item.state === 'in' ? styles.currentStateTextIn : styles.currentStateTextOut,
            ]}>
            {item.state === 'in' ? 'bejött' : 'távozott'}
          </Text>
        </View>

        {/* Delete button */}
        <View style={styles.kuka}>
          {index == 0 && (<TouchableOpacity >
            <SvgXml width="30" height="30" xml={trashIcon} onPress={twoButtonAlert} />
          </TouchableOpacity>)}
        </View>

      </View>

    </View >
  );

  useEffect(() => {
    (async () => {
      console.log(props.userData.email);
      const historyFromFirebase = await getHistory(props.userData.email);
      setHistory(historyFromFirebase);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList data={history} renderItem={renderItem} keyExtractor={item => item.id} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'stretch',
    // https://stackoverflow.com/a/59183680/9004180
    // fixing the scrolling of the FlatList
    // flex: 1 just means "take up the entire space" (whatever "entire" that may be).
    flex: 1,
  },
  historyItemContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    margin: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTextContainer: {
    flexDirection: 'row',

  },
  currentStateText: {
    fontSize: 17,
    color: 'white',
  },
  containerIn: {
    backgroundColor: 'green',
  },
  containerOut: {
    backgroundColor: 'red',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  kuka: {
    marginLeft: 150,
    marginTop: 5,
  },
});
