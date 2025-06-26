import { LogBox } from 'react-native';
import ProductCatalogScreen from '../screens/ProductCatalogScreen';

export default function Home() {
  LogBox.ignoreAllLogs(true);

  return <ProductCatalogScreen />;
}
