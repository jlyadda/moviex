import React from 'react'
import { StyleSheet, Text } from 'react-native'

const MovieCategoryHeader = (props:any) => {
  return (
    <>
      <Text style={styles.sectionTitle}>{props.title}</Text>
    </>
  )
}



export default MovieCategoryHeader

const styles = StyleSheet.create({
    sectionTitle: {
    fontSize: 20,
    color: '#181818',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
})