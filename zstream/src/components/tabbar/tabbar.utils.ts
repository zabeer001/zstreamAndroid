import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function getTabLabel(
  options: BottomTabBarProps['descriptors'][string]['options'],
  routeName: string
) {
  if (typeof options.tabBarLabel === 'string') {
    return options.tabBarLabel;
  }

  if (typeof options.title === 'string') {
    return options.title;
  }

  return routeName;
}

export function getTabIcon(routeName: string) {
  switch (routeName) {
    case 'chat':
      return 'ellipsis.message.fill' as const;
    case 'explore':
      return 'magnifyingglass' as const;
    case 'courses':
      return 'book.closed.fill' as const;
    case 'settings':
      return 'gearshape.fill' as const;
    default:
      return 'house.fill' as const;
  }
}
