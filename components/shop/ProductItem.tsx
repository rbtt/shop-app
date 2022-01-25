import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Image, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native'
import Product from '../../models/product'
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const ProductItem: React.FC<{
    product: Product,
    onSelect?: () => void
}> = ({ product, onSelect, children }) => {

    let TouchableComponent = TouchableOpacity as any
    if (Platform.OS === 'android') TouchableComponent = TouchableNativeFeedback
    return (
        <Card style={styles.product}>
            <TouchableComponent onPress={onSelect} useForeground >
                <View>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: product.imageUrl }}
                        />
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.title}>{product.title}</Text>
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.actions}>
                        {children}
                    </View>
                    <StatusBar style='auto' />
                </View>
            </TouchableComponent>
        </Card>
    )
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20,
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        alignItems: 'center',
        height: '15%',
        padding: 5
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 3,
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
        paddingHorizontal: 20
    }
})

export default ProductItem