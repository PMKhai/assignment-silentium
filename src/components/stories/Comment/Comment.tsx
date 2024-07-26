import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme';
import { Comment } from '@/types/schemas';
import { useTranslation } from 'react-i18next';

type CommentUIProps = { data: Comment[]; total: number };

function CommentUI({ data, total }: CommentUIProps) {
	const { t } = useTranslation(['common']);
	const { layout, gutters, fonts } = useTheme();

	return (
		<View style={[gutters.marginBottom_16]}>
			<Text
				style={[
					gutters.marginBottom_12,
					gutters.marginTop_16,
					fonts.bold,
					fonts.gray400,
				]}
			>
				{`${t('common:allComments')}:`}
			</Text>
			<FlatList
				data={data ?? []}
				renderItem={({ item: { text } }) => (
					<Text style={[gutters.marginBottom_16, fonts.gray400]}>{text}</Text>
				)}
				keyExtractor={comment => comment.id.toString()}
			/>
			{total > 3 && (
				<TouchableOpacity
					style={[layout.justifyCenter, layout.itemsCenter]}
					onPress={() => Alert.alert('This feature is develop.')}
				>
					<Text style={[fonts.red500, fonts.underline, fonts.gray400]}>
						{t('common:viewAllComments')}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

export default CommentUI;
