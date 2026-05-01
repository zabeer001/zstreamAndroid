import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable, Text } from '@react-navigation/elements';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, LayoutAnimation, Platform, UIManager } from 'react-native';

import { IconSymbol } from '@/src/components/ui/icon-symbol';

import { styles } from './tabbar.styles';
import { getTabIcon } from './tabbar.utils';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TabBarItemProps = {
  href?: string;
  isDark: boolean;
  isFocused: boolean;
  label: string;
  onLongPress: () => void;
  onPress: () => void;
  options: BottomTabBarProps['descriptors'][string]['options'];
  routeName: string;
};

export function TabBarItem({
  href,
  isDark,
  isFocused,
  label,
  onLongPress,
  onPress,
  options,
  routeName,
}: TabBarItemProps) {
  const progress = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 360,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
    });

    Animated.timing(progress, {
      toValue: isFocused ? 1 : 0,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isFocused, progress]);

  const activeScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.78, 1],
  });

  const inactiveScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.82],
  });

  const inactiveOpacity = progress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0.25, 0],
  });

  return (
    <PlatformPressable
      href={href}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.tabbarItem, isFocused ? styles.tabbarItemActive : undefined]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeIconCircle,
          isDark ? styles.activeIconCircleDark : undefined,
          {
            opacity: progress,
            transform: [{ scale: activeScale }],
          },
        ]}>
        <IconSymbol size={22} name={getTabIcon(routeName)} color="#fff" />
      </Animated.View>
      {!isFocused ? (
        <Animated.View
          style={[
            styles.inactiveContent,
            {
              opacity: inactiveOpacity,
              transform: [{ scale: inactiveScale }],
            },
          ]}>
          <IconSymbol size={20} name={getTabIcon(routeName)} color={isDark ? '#B7CDBE' : '#4B4B4B'} />
          <Text style={[styles.label, isDark ? styles.labelDark : undefined]}>{label}</Text>
        </Animated.View>
      ) : null}
    </PlatformPressable>
  );
}
