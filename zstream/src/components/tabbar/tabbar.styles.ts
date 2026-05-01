import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  tabbarDark: {
    backgroundColor: '#07150D',
    shadowOpacity: 0.28,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  tabbarItemActive: {
    minHeight: 48,
  },
  activeIconCircle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7438E8',
  },
  activeIconCircleDark: {
    backgroundColor: '#16A34A',
  },
  inactiveContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    color: '#4B4B4B',
    fontWeight: '600',
  },
  labelDark: {
    color: '#B7CDBE',
  },
});
