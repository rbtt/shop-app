import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const EditProductsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Open up EditProductsScreen.tsx to change content</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EditProductsScreen