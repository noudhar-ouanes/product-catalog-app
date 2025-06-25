import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const filters = ['All', 'Clothing'];
const products = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
  { id: '6' },
  { id: '7' },
];

export default function ProductCatalogScreen() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [productList, setProductList]= useState([])    
    const [loading, setLoading]=useState<boolean>(false)
    // call API
    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const res = await fetch('https://fakestoreapi.com/products');
            const data = await res.json();
            console.log('data: ', data);
            // Add to track favorite status
            const prepared = data.map(item => ({ ...item, favorite: false }));
            setProductList(prepared);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
  }, []);
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Catalog</Text>

      <View style={styles.filtersContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilter
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

       {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={productList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                <Image
                    source={{uri: item.image}}
                    style={styles.imagePlaceholder}
                    resizeMode='contain'
                />
                <View style={styles.details}>
                    <View style={styles.textLine}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    </View>
                    <View style={styles.textLine}>
                    <Text numberOfLines={2}>{item.description}</Text>
                    </View>
                    <View style={styles.textLine}>
                    <Text>${item.price}</Text>
                    </View>
                </View>
                <TouchableOpacity
                //  onPress={onFavoritePress}
                 >
                    <AntDesign name="hearto" size={20} color="black" />
                </TouchableOpacity>
                </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10
  },
  activeFilter: {
    backgroundColor: '#CCCCCC'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  details: {
    flex: 1,
    // backgroundColor:'red',
    marginRight:10
  },
  cardTitle:{
    // marginBottom: 6,
    fontSize:14,
    fontWeight:'600'

  },
  textLine: {
    marginBottom: 6,
  },
  textLineShort: {
    height: 10,
    backgroundColor: '#B0B0B0',
    borderRadius: 5,
    marginBottom: 6,
    width: '60%'
  },
  textLineTiny: {
    height: 10,
    backgroundColor: '#B0B0B0',
    borderRadius: 5,
    width: '40%'
  }
});
