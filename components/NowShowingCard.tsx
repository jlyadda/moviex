import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const NowShowingCard = (props:any) => {
  return (
    <TouchableOpacity onPress={() => {}}>
    <View style={[styles.container, 
        props.shouldMarginatedAtEnd 
        ? props.isFirst
        ? {marginLeft:36}
        : props.isLast
        ? {marginRight:36}
        :{}
        :{},
        props.shouldMarginatedAround? {margin:12} : {},
        {maxWidth: props.cardWidth}
        ]}>
        <Image 
        style={[styles.MovieImage,{width:props.cardWidth}]}
        source={{uri:props.movie.image}}/>
        <Text numberOfLines={1} style={styles.MovieTitle}>{props.title}</Text>
    </View>
    </TouchableOpacity>
  )
}

export default NowShowingCard

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flex:1,
        backgroundColor:'#ffff'
    },
    MovieImage:{
        aspectRatio:2/3,
        borderRadius:20,
    },
    MovieTitle:{
        color:'#0000',
        fontSize:14,
        fontFamily:'poppins_regular',
        textAlign:'center',
        paddingVertical:10

    }
});