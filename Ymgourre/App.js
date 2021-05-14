import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { CLIENT_ID } from "@env";
import CustomHeader from './header.js'
import ShowList from './showList.js'
import ShowAlbum from './showAlbum.js'

export default function App() {
  const [oauth, setOauth] = useState({});
  const [imagesList, setImagesList] = useState({});
  const [album, setAlbum] = useState({});

  useEffect(() => {
    console.log("imagesList updated")
  }, [imagesList])

  useEffect(() => {
    console.log("album updated")
  }, [album])

  const setParams = (navEvent) => {
    if(navEvent.url != undefined){
      try{
        const arr = navEvent.url.split('#');
        const arr2 = arr[1].split('&');
        const response = {};
        for(let i = 0; i<arr2.length; i++){
          const temparr = arr2[i].split('=');
          const index = temparr[0];
          response[index] = temparr[1];
        }
        setOauth(response)
      } catch (error){
      }
    }
  }


  if(Object.keys(oauth).length == 0){
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <WebView
          source={{ uri: 'https://api.imgur.com/oauth2/authorize?client_id='+CLIENT_ID+'&response_type=token' }}
          onNavigationStateChange={setParams}
        />
    </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.container}>

        <CustomHeader 
        setOauth={setOauth}
        token = {oauth.access_token}
        name = {oauth.account_username}
        imagesList = {imagesList}
        setImagesList = {setImagesList}
        setAlbum = {setAlbum}
		style={styles.header}
        />

      {(album.id == undefined) &&
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.listContainer}>
          <ShowList
          oauth = {oauth}
          token = {oauth.access_token}
          style = {styles.showList}
          list = {imagesList}
          setImagesList = {setImagesList}
          setAlbum = {setAlbum}
          />
          </View>
        </SafeAreaView>
      }
      {(album.id != undefined) &&
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.listContainer}>
          <ShowAlbum
          oauth = {oauth}
          token = {oauth.access_token}
          style = {styles.showList}
          album = {album}
          />
          </View>
        </SafeAreaView>
      }
      </View>
    )
  }
}

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
  	center: {
		justifyContent: 'center',
	  	alignItems: 'center',
	  	position: 'absolute',
	  	top: 500,
  	},
  	showList: {
    	marginTop:100,
  	},
  	listContainer: {
		marginTop: 150,
	},
});
