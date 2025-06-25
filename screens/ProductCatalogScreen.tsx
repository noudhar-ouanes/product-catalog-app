import ProductCard from '@/components/ProductCard';
import { Product, ProductList } from '@/constants/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const filters = ['All', 'Clothing'];

export default function ProductCatalogScreen() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [productList, setProductList]= useState<ProductList>([])    
    const [loading, setLoading]=useState<boolean>(false)
    // call API
    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const res = await fetch('https://fakestoreapi.com/products');
            const data = await res.json();
            console.log('data: ', data);
            //check if element is selected as favorite
            const storedFavorites = await AsyncStorage.getItem('favoriteProductIds');
            const favoriteProductIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

            const preparedData = data.map((item: Product) => ({
              ...item,
              favorite: favoriteProductIds.includes(item.id),
            }));

            setProductList(preparedData);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
  }, []);
 
  const onFavoritePress = async (id: number) => {
    const updatedProductList = productList.map((product) =>
    product.id === id
      ? { ...product, favorite: !product.favorite }
      : product
    );
    setProductList(updatedProductList);

    const favoriteProductIds = updatedProductList
      .filter((p) => p.favorite)
      .map((p) => p.id);

    await AsyncStorage.setItem('favoriteProductIds', JSON.stringify(favoriteProductIds));
    };

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
                <ProductCard product={item} onFavoritePress={onFavoritePress}/>
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
    marginRight:10
  },
  cardTitle:{
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
