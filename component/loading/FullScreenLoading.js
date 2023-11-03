import React,{ } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const FullscreenLoading = ({ message }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    message: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default FullscreenLoading;

