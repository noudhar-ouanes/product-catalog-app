import ProductCard from '@/components/ProductCard';
import { Colors } from '@/constants/Colors';
import { PAGE_SIZE, sortOptions } from '@/constants/Constants';
import { ProductList } from '@/constants/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


export default function ProductCatalogScreen() {
  const [productList, setProductList] = useState<ProductList>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [sortOption, setSortOption] = useState<string>('Default');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Fetch product data with offline cache
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const cached = await AsyncStorage.getItem('cachedProducts');
        let cachedProducts: ProductList = [];

        if (cached) {
          cachedProducts = JSON.parse(cached);
        }

        const res = await fetch('https://fakestoreapi.com/products');
        const data: ProductList = await res.json();
        await AsyncStorage.setItem('cachedProducts', JSON.stringify(data));
        cachedProducts = data;

        const storedFavorites = await AsyncStorage.getItem('favoriteProductIds');
        const favoriteProductIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

        const newProductList = cachedProducts.map((item) => ({
          ...item,
          favorite: favoriteProductIds.includes(item.id),
        }));

        const uniqueCategories = Array.from(new Set(cachedProducts.map((item) => item.category)));

        setCategories(['All', ...uniqueCategories]);
        setProductList(newProductList);
      } catch (error) {
        console.error('Error fetching:', error);
        const fallback = await AsyncStorage.getItem('cachedProducts');
        if (fallback) {
          const fallbackProducts: ProductList = JSON.parse(fallback);
          const storedFavorites = await AsyncStorage.getItem('favoriteProductIds');
          const favoriteProductIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

          const newProductList = fallbackProducts.map((item) => ({
            ...item,
            favorite: favoriteProductIds.includes(item.id),
          }));

          const uniqueCategories = Array.from(new Set(fallbackProducts.map((item) => item.category)));
          setCategories(['All', ...uniqueCategories]);
          setProductList(newProductList);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onFavoritePress = async (id: number) => {
    const updatedList = productList.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    setProductList(updatedList);

    const favoriteProductIds = updatedList.filter(p => p.favorite).map(p => p.id);
    await AsyncStorage.setItem('favoriteProductIds', JSON.stringify(favoriteProductIds));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...productList];

    if (activeCategory !== 'All') {
      products = products.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      products = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === 'Price: Low to High') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Price: High to Low') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [productList, activeCategory, searchQuery, sortOption]);

  const visibleProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(0, visibleCount);
  }, [filteredAndSortedProducts, visibleCount]);

  const handleLoadMore = () => {
    if (visibleCount < filteredAndSortedProducts.length) {
      setVisibleCount(prev => prev + PAGE_SIZE);
    }
  };

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, activeCategory, sortOption]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Catalog</Text>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search products"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Filter */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeCategory === item ? styles.activeFilter : styles.inactiveFilter
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.filterText,{color:activeCategory === item ? Colors.textSecondary : Colors.sortButtonActive}]}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <FlatList
          horizontal
          data={sortOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortOption === item ?styles.activeSort: styles.inactiveSort
              ]}
              onPress={() => setSortOption(item)}
            >
              <Text style={[styles.sortText,{color:sortOption === item ? Colors.textSecondary : Colors.sortButtonActive}]}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Product List */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={visibleProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard product={item} onFavoritePress={onFavoritePress} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            visibleProducts.length < filteredAndSortedProducts.length ? (
              <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} />
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.textPrimary
  },
  searchInput: {
    height: 40,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
      shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.filterButtonBackground,
    marginRight: 10,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginBottom:10
  },
  activeFilter: {
    backgroundColor: Colors.filterButtonActive
  },
  inactiveFilter: {
    backgroundColor: Colors.background,
    borderWidth:1,
    borderColor:Colors.sortButtonActive,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.sortButtonBackground,
    marginRight: 10,
     shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginBottom:10

  },
  activeSort: {
    backgroundColor: Colors.sortButtonActive,
  
  },
   inactiveSort: {
    backgroundColor:Colors.background,
    borderWidth:1,
    borderColor:Colors.sortButtonActive
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary
  }
});
