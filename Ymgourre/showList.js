import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
const fetch = require('node-fetch');

const ShowList = (props) => {
  const [refresh, setRefresh] = useState(false) 
    // va chercher l'url de la première image s'il s'agit d'un album
    const getImage = (item) => {
      if('images' in item){
        return item.images[0].link; 
      }
      if(!('image' in item)){
        return item.link;
      }
        let arr = [];
        arr[3] = ''
        arr = item.link.split('.');
        try{
          if(arr[3] !== ''){
            return item.images[0].link
          }
        } catch (error){
            console.log(error.response)
        }
        return item.link
    }

    const getType = (item) => {
      if('images' in item){
        return item.images[0].type; 
      } else {
        return item.type;
      }
    }

    const setFavorites = async (item) => {
      let id = item.id
      let url = 'https://api.imgur.com/3/image/'
      if('images' in item){
        url = 'https://api.imgur.com/3/album/'
      }
      try{
        const res = await fetch(url+id+'/favorite',{
        method: 'post',
        headers: { 'authorization': 'Bearer '+props.token },
        })
        item.favorite = true
        setRefresh(!refresh)
      } catch (e) {
        console.log(e.response)
      }
    }

    const voteOnItem = async (item, vote) => {
      let id = item.id
      if(vote == item.vote){
        vote = "veto";
      }
      try {
        const res = await fetch('https://api.imgur.com/3/gallery/'+id+'/vote/'+vote,{
          method: 'post',
          headers: { 'authorization': 'Bearer '+props.token },
        })
        item.vote = vote
        setRefresh(!refresh)
      } catch (e) {
        console.log(e.response)
      }
    }

    const triggerAlbumView = async (item) => {
      props.setAlbum(item)
    }

    if(props.list !== undefined && Object.keys(props.list).length == 3 && props.list.data.length == 0){
      return(
        <View>
          <Text style={styles.noFindsMessage}>No image found.</Text>
        </View>
      )
    } else if(props.list !== undefined && Object.keys(props.list).length == 3  && props.list.data.length > 0){
      try {
        return (
            <FlatList
            containerContentStyle={styles.showList}
            data={props.list.data}
            extraData={refresh}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                    <View>

                    {(getType(item) == 'video/mp4') && (
                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>triggerAlbumView(item)}>
                      <Video
                      style = {styles.image}
                      source = {{ uri: getImage(item)}}
                      rate={1.0}
                      volume={0.0}
                      isMuted={true}
                      resizeMode="cover"
                      shouldPlay
                      isLooping
                      />
                      </TouchableOpacity>
                      )}
                    {(getType(item) !== 'video/mp4') && (
                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>triggerAlbumView(item)}>
                      <Image
                      style = {styles.image}
                      source = {{ uri: getImage(item)}}
                      />
                      </TouchableOpacity>
                      )}
                      </View>
				<View style={styles.spacer}></View>
				<View style={styles.iconContainer}>
                  {(item.favorite == true) && (
                    <TouchableOpacity activeOpacity = { .5 } onPress={()=>setFavorites(item)}>
                      <Image
                        style = {styles.icon}
                        source = {require('./Assets/baseline_favorite_black_18dp.png')}
                      />
                      </TouchableOpacity>
                  )}
                  {(item.favorite == false) && (
                    <TouchableOpacity activeOpacity = { .5 } onPress={()=>setFavorites(item)}>
                      <Image
                        style = {styles.icon}
                        source = { require('./Assets/baseline_favorite_border_black_18dp.png')}
                      />
                    </TouchableOpacity>
                  )}

                  {(item.vote == null || item.vote == "veto") && (
                    <View>
                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>voteOnItem(item, 'up')}>
                        <Image
                          style = {styles.icon}
                          source = { require('./Assets/ic_arrow_up_bold_outline_black_48dp.png')}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>voteOnItem(item, 'down')}>
                        <Image
                          style = {styles.icon}
                          source = { require('./Assets/ic_arrow_down_bold_outline_black_48dp.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {(item.vote == 'up') && (
                    <View>
                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>voteOnItem(item, 'up')}>
                        <Image
                          style = {styles.icon}
                          source = { require('./Assets/ic_arrow_up_bold_black_48dp.png')}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>voteOnItem(item, 'down')}>
                        <Image
                          style = {styles.icon}
                          source = { require('./Assets/ic_arrow_down_bold_outline_black_48dp.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {(item.vote == 'down') && (
                    <View>
                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>voteOnItem(item, 'up')}>
                        <Image
                          style = {styles.icon}
                          source = { require('./Assets/ic_arrow_up_bold_outline_black_48dp.png')}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity activeOpacity = { .5 } onPress={()=>voteOnItem(item, 'down')}>
                        <Image
                          style = {styles.icon}
                          source = { require('./Assets/ic_arrow_down_bold_black_48dp.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
				  </View>
				

                <Text>{'\n'}</Text>
              </View>
              )}     
              // Performance settings
              removeClippedSubviews={true} // Unmount components when outside of window 
              initialNumToRender={5} // Reduce initial render amount
              maxToRenderPerBatch={5} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              // windowSize={7} // Reduce the window size
              />
        )
      } catch (e) {
        return <View/>
      }
    }
    else {
        return <View/>
    }
}

const styles = StyleSheet.create({
	itemContainer:{
		flex:1,
		flexDirection: 'row',
		padding:10,
		justifyContent:'flex-end'
	},
    showList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 3/2,
        width: 350,
        height: undefined
	},
	spacer:{
		width:10
	},
	iconContainer: {
		justifyContent:'center',
		alignItems:'center',
		borderRadius:40,
		height:100,
		top:40,
		backgroundColor:'green'
	},
    image: {
		width: 300,
		height: 200,
		flex:1,
    },
    icon: {
      width: 30,
      height: 30,
    },
	noFindsMessage: {
		color:'grey'
	}
  });

export default ShowList