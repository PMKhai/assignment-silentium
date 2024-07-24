import { Example, Startup, Stories } from '@/screens';

import { NavigationContainer } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@/theme';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
	const { variant, navigationTheme } = useTheme();

	return (
		<SafeAreaProvider>
			<NavigationContainer theme={navigationTheme}>
				<Stack.Navigator
					key={variant}
					initialRouteName="Stories"
					screenOptions={{ headerShown: false }}
				>
					<Stack.Screen name="Startup" component={Startup} />
					<Stack.Screen name="Example" component={Example} />
					<Stack.Screen name="Stories" component={Stories} />
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

export default ApplicationNavigator;
