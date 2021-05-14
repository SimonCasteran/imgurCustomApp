import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
const fetch = require('node-fetch');

const ShowAlbum = (props) => {
    const [refresh, setRefresh] = useState(false)
    const [comments, setComments] = useState({})

    useEffect(() => {
        getComments();
    }, [props.album])

    const getComments = async () => {
        if(props.album.comment_count !== 0 && props.album.comment_count !== null){
            axios.get('https://api.imgur.com/3/gallery/'+props.album.id+'/comments/top',{
                headers: {
                  'Authorization': 'Bearer '+props.token
                }
            }).then(res => {
                setComments(res.data.data)
                console.log('comments updated')
            })
        }
    }

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
  

    return (
		// if there is only one picture in the album
        <View>
            {(props.album.images == undefined) && (
                <View style={styles.item}>
                {(props.album.type == 'video/mp4') && (
                    <TouchableOpacity activeOpacity = { .5 }>
                    <Video
                    style = {{width:400, height:300}}
                    source = {{ uri: props.album.link}}
                    rate={1.0}
                    volume={0.0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    />
                    </TouchableOpacity>
                    )}
                  {(props.album.type !== 'video/mp4') && (
                    <TouchableOpacity activeOpacity = { .5 }>
                    <Image
                    style = {styles.image}
                    source = {{ uri: props.album.link}}
                    />
                    </TouchableOpacity>
                )}
                </View>
            )}
        <FlatList
        	containerContentStyle={styles.showList}
        	data={props.album.images}
        	extraData={refresh}
        	renderItem={({ item }) => (
          	<View>
                <View>

                {(item.type == 'video/mp4') && (
                  <TouchableOpacity activeOpacity = { .5 }>
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
                {(item.type !== 'video/mp4') && (
                  <TouchableOpacity activeOpacity = { .5 }>
                  <Image
                  style = {styles.image}
                  source = {{ uri: getImage(item)}}
                  />
                  </TouchableOpacity>
                  )}
                  </View>
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

          </View>
          )}     
          // Performance settings
          removeClippedSubviews={true} // Unmount components when outside of window 
          initialNumToRender={5} // Reduce initial render amount
          maxToRenderPerBatch={5} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          // windowSize={7} // Reduce the window size
          />

          <FlatList
        containerContentStyle={styles.commentList}
        data={comments}
        extraData={refresh}
        renderItem={({ item }) => (
            <View style={styles.comment}>
                <Text style={styles.commentAuthor}>{item.author}</Text>
				<Text style={styles.commentContent}>{item.comment}</Text>
            </View>
            )}     
          // Performance settings
          removeClippedSubviews={true} // Unmount components when outside of window 
          initialNumToRender={5} // Reduce initial render amount
          maxToRenderPerBatch={10} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          // windowSize={7} // Reduce the window size
          />
        </View>
    )
}

const styles = StyleSheet.create({
    showList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
		height:undefined
	},
    image: {
		width:'100%',
		height:200
    },
    icon: {
      	width: 20,
      	height: 20,
    },
	commentList:{
	},
	comment: {
		borderStyle:'solid',
		borderColor:'#333333',
		borderWidth: 1,
		padding:4,
		width: '100%',
		height:100,
	},
	commentAuthor: {
		fontWeight: 'bold',
		color:'white'
	},
	commentContent:{
		color:'white'
	}
});

export default ShowAlbum  