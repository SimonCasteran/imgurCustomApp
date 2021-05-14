import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback } from 'react-native';

const DropDownSort = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortShown, setSortShown] = useState("New")


    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={()=>setIsOpen(!isOpen)}>
                <Text style={styles.sortShown}>{sortShown}</Text>
            </TouchableWithoutFeedback>
            {(isOpen) && (
                <View style={styles.choiceContainer}>
                    <TouchableWithoutFeedback onPress={()=>{props.setSort("time"); setSortShown("New"); setIsOpen(false)}}>
                        <Text style={styles.choiceText}>New</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{props.setSort("viral"); setSortShown("Viral"); setIsOpen(false)}}>
                        <Text style={styles.choiceText}>Viral</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{props.setSort("top"); setSortShown("Top"); setIsOpen(false)}}>
                        <Text style={styles.choiceText}>Top</Text>
                    </TouchableWithoutFeedback>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({

	container:{
		borderStyle:'solid',
		zIndex:999,
		backgroundColor:'black',
		flex:1,
	},
	sortShown: {
		fontWeight:'bold',
		paddingTop:10,
		paddingBottom: 10,
		borderRadius:5,
		backgroundColor:'black',
		color: '#DDDDDD',
		zIndex:999,
	},
	choiceText:{
		paddingTop:10,
		paddingBottom: 10,
		color:'#DDDDDD',
		backgroundColor:'black',
		zIndex:999,


	},
	choiceContainer:{
		zIndex:999,

	}
})

export default DropDownSort