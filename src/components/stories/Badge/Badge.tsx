import { Text, TouchableOpacity, ViewStyle } from 'react-native';

import { useMemo } from 'react';
import { useTheme } from '@/theme';

type Props = {
	active?: boolean;
	value: string;
	label: string;
	onPress: () => void;
};

function Badge({ active = false, value, label, onPress }: Props) {
	const { gutters, components, fonts, backgrounds } = useTheme();

	const activeStyle: ViewStyle[] = useMemo(
		() => (active ? [backgrounds.purple500] : []),
		[active],
	);

	const textStyle = useMemo(() => (active ? [fonts.gray50] : []), [active]);

	return (
		<TouchableOpacity
			testID={value}
			style={[components.square, gutters.marginBottom_16, ...activeStyle]}
			onPress={onPress}
		>
			<Text style={textStyle}>{label}</Text>
		</TouchableOpacity>
	);
}

export default Badge;
