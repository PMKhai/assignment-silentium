import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ComponentTheme } from '@/types/theme/theme';

interface AllStyle
	extends Record<string, AllStyle | ImageStyle | TextStyle | ViewStyle> {}

export default ({ layout, backgrounds, fonts }: ComponentTheme) => {
	return {
		buttonCircle: {
			...layout.justifyCenter,
			...layout.itemsCenter,
			...backgrounds.purple100,
			...fonts.gray400,
			height: 70,
			width: 70,
			borderRadius: 35,
		},
		circle250: {
			borderRadius: 140,
			height: 250,
			width: 250,
		},
		square: {
			...layout.justifyCenter,
			...layout.itemsCenter,
			...backgrounds.purple100,
			...fonts.gray800,
			borderRadius: 50,
			height: 50,
			width: 100,
		},
		card: {
			...backgrounds.gray100,
			...layout.justifyCenter,
			borderRadius: 10,
			padding: 16,
			marginBottom: 16,
		},
		skeleton: {
			width: '100%',
			borderRadius: 10,
			marginBottom: 16,
		},
	} as const satisfies AllStyle;
};
