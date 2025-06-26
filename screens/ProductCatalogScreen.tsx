import ProductCard from '@/components/ProductCard';
import { Colors } from '@/constants/Colors';
import { sortOptions } from '@/constants/Constants';
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

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data: ProductList = await res.json();

        const storedFavorites = await AsyncStorage.getItem('favoriteProductIds');
        const favoriteProductIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

        const newProductList = data.map((item) => ({
          ...item,
          favorite: favoriteProductIds.includes(item.id),
        }));

        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );

        setCategories(['All', ...uniqueCategories]);
        setProductList(newProductList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // choose favorite product

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


  const filteredAndSortedProducts = useMemo(() => {
    let products = [...productList];

    // filter by category
    if (activeCategory !== 'All') {
      products = products.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      products = products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // sort by price
    if (sortOption === 'Price: Low to High') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Price: High to Low') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [productList, activeCategory, searchQuery, sortOption]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Catalog</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {/* shiow horizontal filter for product category */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeCategory === item && styles.activeFilter
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={styles.filterText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* sort by price */}
     <View style={styles.sortContainer}>
      <FlatList
        horizontal
        data={sortOptions}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOption === item && styles.activeSort
            ]}
            onPress={() => setSortOption(item)}
          >
            <Text style={styles.sortText}>{item}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>

      {/* show product list */}

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredAndSortedProducts}
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
    backgroundColor: Colors.inputBackground
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.filterButtonBackground,
    marginRight: 10
  },
  activeFilter: {
    backgroundColor: Colors.filterButtonActive
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.sortButtonBackground,
    marginRight: 10,
    marginTop: 6
  },
  activeSort: {
    backgroundColor: Colors.sortButtonActive
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary
  }
});

