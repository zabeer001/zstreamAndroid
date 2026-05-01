import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useLinkBuilder } from '@react-navigation/native';
import React from 'react';
import { useColorScheme, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '@/src/stores/theme.store';

import { styles } from './tabbar.styles';
import { TabBarItem } from './TabBarItem';
import { getTabLabel } from './tabbar.utils';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const { width } = useWindowDimensions();
  const systemColorScheme = useColorScheme();
  const themeMode = useThemeStore((store) => store.mode);
  const insets = useSafeAreaInsets();
  const resolvedColorScheme = themeMode === 'system' ? systemColorScheme : themeMode;
  const isDark = resolvedColorScheme === 'dark';
  const tabbarWidth = Math.min(360, Math.max(300, width - 48));
  const tabbarBottom = Math.max(12, insets.bottom + 10);

  return (
    <View
      style={[
        styles.tabbar,
        isDark ? styles.tabbarDark : undefined,
        { bottom: tabbarBottom, width: tabbarWidth },
      ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = getTabLabel(options, route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.key}
            href={buildHref(route.name, route.params)}
            isFocused={isFocused}
            isDark={isDark}
            label={label}
            onLongPress={onLongPress}
            onPress={onPress}
            options={options}
            routeName={route.name}
          />
        );
      })}
    </View>
  );
}
