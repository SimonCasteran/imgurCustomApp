import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DropDownSort from './dropDownSort.js';
import { readDirectoryAsync } from 'expo-file-system';

const CustomHeader = (props) => {
    const [query, setQuery] = useState("")
    const [sort, setSort] = useState("time")

    const fetchAccountImages = () => {
        axios.get('https://api.imgur.com/3/account/me/images',{
            headers: {
              'Authorization': 'Bearer '+props.token
            }
        }).then(res => {
            props.setAlbum({})
            props.setImagesList(res.data)
        })
    }

    const fetchAccountFavorites = () => {
        axios.get('https://api.imgur.com/3/account/'+props.name+'/gallery_favorites/',{
            headers: {
              'Authorization': 'Bearer '+props.token
            }
        }).then(res => {
            console.log(res.data)
            props.setAlbum({})
            props.setImagesList(res.data)
        })
    }

    const searchImages = () => {
        axios.get('https://api.imgur.com/3/gallery/search/'+sort+'/?q='+query,{
            headers: {
              'Authorization': 'Bearer '+props.token
            }
        }).then(res => {
            props.setAlbum({})
            props.setImagesList(res.data)
        })
    }

    const sortBy = (event) => {
        setSort(event.target.name)
    }

    const pickImage = async () => {
        const options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            includeBase64: true,
          };
        launchImageLibrary(options, (res) => {
            uploadImage(res)
        })
    }

    const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append('image', image)
        // formData.append('type', 'base64')

        await fetch('https://api.imgur.com/3/upload/', {
            method: 'post',
            headers: { 'authorization': 'Bearer '+props.token },
            body: formData
        })
        fetchAccountImages()
    }

    const takePicture = async () => {
        // launchCamera(options?, callback);
        const options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            includeBase64: true,
            saveToPhotos: true,
          };
          launchCamera(options, (res) => {
            uploadImage(res)
        })
    }

    return (
        <View  style={styles.header}>
            <Text style={styles.welcomeBanner}>
                Welcome {props.name}!
            </Text>
			<View style={styles.buttonBar}>
            	<TouchableWithoutFeedback onPress={()=>fetchAccountImages()}>
            	    <View style={styles.button}>
            	        <Text>Your images</Text>
            	    </View>
            	</TouchableWithoutFeedback>
				<View style={styles.spacer}></View>
            	<TouchableWithoutFeedback onPress={()=>fetchAccountFavorites()}>
            	    <View style={styles.button}>
            	        <Text>Favs</Text>
            	    </View>
            	</TouchableWithoutFeedback>
				<View style={styles.spacer}></View>

            	<TouchableWithoutFeedback onPress={()=>pickImage()}>
            	    <View style={styles.button}>
            	        <Text>Upload</Text>
            	    </View>
            	</TouchableWithoutFeedback>
				<View style={styles.spacer}></View>
            	<TouchableWithoutFeedback onPress={()=>takePicture()}>
            	    <View style={styles.button}>
            	        <Text>Take a picture</Text>
            	    </View>
            	</TouchableWithoutFeedback>
			</View>
			<View style={styles.searchPackage}>
            	<View style={styles.searchBar}>
            	    <TextInput
						style={styles.searchInput}
            	    	placeholder = "Look for stuff"
            	    	onChangeText={setQuery}
            	    	onSubmitEditing = {searchImages}
					/>
            	    <TouchableWithoutFeedback 
						onPress={()=>searchImages()}>
            	        <View style={styles.searchButton}>
            	            <Text style={styles.arrow}>➮</Text>
            	        </View>
            	    </TouchableWithoutFeedback>
            	</View>
					<View style={styles.sorter}>
                		<DropDownSort
                			sort={sort}
                			setSort={setSort}
                		/>
					</View>
			</View>
        </View>
    )
}

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
        top: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
	welcomeBanner: {
		fontSize:20,
		fontFamily:'monospace',
		color:'grey',
		marginBottom: 5
	},
	buttonBar: {
		flex: 1,
		flexDirection: 'row',
		justifyContent:'space-between',
		paddingBottom:5
	},
    button: {
        alignItems: "center",
		borderRadius: 20,
        backgroundColor: "#DDDDDD",
        padding: 10,
        fontSize: 18,
    },
	searchPackage: {
		flex:1,
		flexDirection:'row',
	},
	searchBar: {
		flex:1,
		flexDirection: 'row',
		backgroundColor:'#808080',
		borderRadius: 40,
		width: '80%',
		height: 50,
		padding:5
	},
	searchInput: {
		flex:1,
		width:'80%'
	},
	sorter: {
		width:'15%',
		justifyContent:'center',
		alignItems:'center',
		borderStyle:'solid',
		borderColor: '#DDDDDD',
		borderWidth: 4,
		paddingTop:0,
		marginLeft:2,
		borderRadius:5,
		backgroundColor: 'black',
		zIndex:999
	},
	spacer:{
		width:3
	},
	searchButton: {
        alignItems: "center",
		borderRadius: 20,
        backgroundColor: "#DDDDDD",
        padding: 5,
        fontSize: 18,
		width:40
	},
	arrow: {
		fontSize:25,
		position: 'absolute',
		top:1
	}
  });

export default CustomHeader