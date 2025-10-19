import { StyleSheet } from 'react-native';

export const lightColors = {
  primary: '#197fe6',
  background: '#f6f7f8',
  textPrimary: '#0f172a',
  textMuted: '#475569',
  border: 'rgba(226, 232, 240, 0.5)',
  footerBg: 'rgba(246, 247, 248, 0.8)',
};

export const darkColors = {
  primary: '#197fe6',
  background: '#111921',
  textPrimary: '#ffffff',
  textMuted: '#cbd5e1',
  border: 'rgba(71, 85, 105, 0.5)',
  footerBg: 'rgba(17, 25, 33, 0.8)',
};

export const createStyles = () =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    main: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    centerBlock: {
      alignItems: 'center',
    },
    city: {
      fontSize: 22,
      fontWeight: '700',
    },
    iconRow: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16 as unknown as number,
    },
    temp: {
      fontSize: 72,
      fontWeight: '800',
    },
    desc: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '600',
    },
    details: {
      marginTop: 12,
      alignItems: 'center',
    },
    detailText: {
      fontSize: 18,
    },
    footer: {
      borderTopWidth: 1,
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
    },
    nav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
      flex: 1,
    },
    navLabel: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: '600',
    },
    hourlyContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 16,
    },
    hourlyTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      textAlign: 'center',
    },
    hourlyScrollContent: {
      paddingHorizontal: 8,
    },
    hourlyItem: {
      alignItems: 'center',
      minWidth: 80,
      marginHorizontal: 8,
    },
    hourlyTime: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 4,
    },
    hourlyTemp: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 4,
    },
    hourlyPrecip: {
      fontSize: 10,
      marginTop: 2,
    },
  });
