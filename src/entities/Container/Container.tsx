import React from 'react'
import { View, StyleSheet } from 'react-native'

interface ContainerProps {
  children: React.ReactNode
  justifyContent?: 'space-between' | 'flex-start' | 'flex-end' | 'center'
  flexWrap?: 'wrap' | 'nowrap'
}

export const Container: React.FC<ContainerProps> = ({
  children,
  justifyContent = 'space-between',
  flexWrap = 'wrap',
}) => {
  return <View style={[styles.container, { justifyContent, flexWrap }]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    height: '100%',
    backgroundColor: '#000',
  },
})
