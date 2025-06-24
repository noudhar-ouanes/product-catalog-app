import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const [activeFilter, setActiveFilter] = React.useState('All');

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

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={() => (
          <View style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.details}>
              <View style={styles.textLine} />
              <View style={styles.textLineShort} />
              <View style={styles.textLineTiny} />
            </View>
            <AntDesign name="hearto" size={20} color="black" />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
    marginRight: 12
  },
  details: {
    flex: 1
  },
  textLine: {
    height: 10,
    backgroundColor: '#B0B0B0',
    borderRadius: 5,
    marginBottom: 6,
    width: '80%'
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
