import { StyleSheet } from 'react-native';

export const lightColors = {
  primary: '#197fe6',
  background: '#f6f7f8',
  textPrimary: '#0f172a',
  text: '#111827',
  textMuted: '#6b7280',
  divider: '#e5e7eb',
  footerBg: 'rgba(246, 247, 248, 0.9)',
};

export const darkColors = {
  primary: '#197fe6',
  background: '#111921',
  textPrimary: '#ffffff',
  text: '#e5e7eb',
  textMuted: '#9ca3af',
  divider: '#374151',
  footerBg: 'rgba(17, 25, 33, 0.9)',
};

export const createStyles = () =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    main: {
      flex: 1,
      paddingHorizontal: 16,
    },
    divider: {
      height: 1,
      opacity: 0.5,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderRadius: 12,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dayBadge: {
      width: 64,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingVertical: 8,
      marginRight: 12,
    },
    dayBadgePrimaryBg: {
      backgroundColor: 'rgba(25,127,230,0.10)',
    },
    dayBadgeNeutralBg: {
      backgroundColor: 'rgba(148,163,184,0.20)'
    },
    dayTextPrimary: {
      fontWeight: '700',
      fontSize: 14,
      color: '#197fe6',
    },
    dayTextNeutral: {
      fontWeight: '700',
      fontSize: 14,
      color: '#64748b',
    },
    dateTextPrimary: {
      fontSize: 12,
      color: 'rgba(25,127,230,0.9)'
    },
    dateTextNeutral: {
      fontSize: 12,
      color: '#94a3b8'
    },
    weatherLabel: {
      fontSize: 18,
      fontWeight: '600',
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    temps: {
      marginRight: 8,
      alignItems: 'flex-end',
    },
    tempHigh: {
      fontSize: 18,
      fontWeight: '600',
    },
    tempLow: {
      fontSize: 14,
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
  });


