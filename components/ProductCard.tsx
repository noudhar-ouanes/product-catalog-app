import { Product } from '@/constants/Types';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ProductCategoryCardProps = {
  product: Product;
  onFavoritePress: (id: number) => void;
};

 const  ProductCard: React.FC<ProductCategoryCardProps>= ({product,onFavoritePress })=> {
  return (
    <View style={styles.card}>
        <Image
            source={{uri: product.image}}
            style={styles.imagePlaceholder}
            resizeMode='contain'
        />
        <View style={styles.details}>
            <View style={styles.textLine}>
                <Text style={styles.cardTitle} numberOfLines={1}>{product.title}</Text>
            </View>
            <View style={styles.textLine}>
                <Text numberOfLines={2}>{product.description}</Text>
            </View>
            <View style={styles.textLine}>
                <Text>${product.price}</Text>
            </View>
        </View>
        <TouchableOpacity
            onPress={()=>onFavoritePress(product.id)}
        >
        <AntDesign
            name={product.favorite ? 'heart' : 'hearto'}
            size={20}
            color={product.favorite ? 'red' : 'black'}
        />        
        </TouchableOpacity>
    </View>
  )
}
export default ProductCard

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#E4E7ED",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 10
    }, imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12
    },
    details: {
        flex: 1,
        marginRight:10
    },
    cardTitle:{
        fontSize:14,
        fontWeight:'600'
    },
    textLine: {
        marginBottom: 6,
    },
  
})