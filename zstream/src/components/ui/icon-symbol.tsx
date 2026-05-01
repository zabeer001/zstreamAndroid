// Fallback for using MaterialIcons on Android and web.

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = keyof typeof MAPPING;
type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'book.closed.fill': { family: 'material', name: 'menu-book' },
  'ellipsis.message.fill': { family: 'material-community', name: 'message-processing-outline' },
  'gearshape.fill': { family: 'material', name: 'settings' },
  'house.fill': { family: 'material', name: 'home' },
  'magnifyingglass': { family: 'material', name: 'search' },
  'message.fill': { family: 'material', name: 'chat-bubble' },
  'paperplane.fill': { family: 'material', name: 'send' },
  'chevron.left.forwardslash.chevron.right': { family: 'material', name: 'code' },
  'chevron.right': { family: 'material', name: 'chevron-right' },
} as const satisfies Partial<Record<
  SymbolViewProps['name'],
  | { family: 'material'; name: MaterialIconName }
  | { family: 'material-community'; name: MaterialCommunityIconName }
>>;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const icon = MAPPING[name];

  if (icon.family === 'material-community') {
    return <MaterialCommunityIcons color={color} size={size} name={icon.name} style={style} />;
  }

  return <MaterialIcons color={color} size={size} name={icon.name} style={style} />;
}
