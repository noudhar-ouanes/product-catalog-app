import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const CategoryFilterButton: React.FC<Props> = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive ? styles.active : styles.inactive
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: isActive ? Colors.textSecondary : Colors.sortButtonActive }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  active: {
    backgroundColor: Colors.filterButtonActive
  },
  inactive: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.sortButtonActive
  },
  text: {
    fontSize: 14,
    fontWeight: '500'
  }
});

export default CategoryFilterButton;
