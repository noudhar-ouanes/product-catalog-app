import ProductCard from '@/components/ProductCard';
import { Product, ProductList } from '@/constants/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const filters = ['All', 'Clothing'];

export default function ProductCatalogScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [productList, setProductList] = useState<ProductList>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();

        const storedFavorites = await AsyncStorage.getItem('favoriteProductIds');
        const favoriteProductIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

        const newProductList = data.map((item: Product) => ({
          ...item,
          favorite: favoriteProductIds.includes(item.id),
        }));

        setProductList(newProductList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Toggle favorite status
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

  // Filtered products by search
  const filteredProducts = productList.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Catalog</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
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
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard product={item} onFavoritePress={onFavoritePress} />
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
  searchInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff'
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
  }
});
