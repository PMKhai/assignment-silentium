import { Post } from '@/types/schemas';
import { FlatList, Text, View, ViewToken } from 'react-native';
import { useTheme } from '@/theme';
import { Skeleton } from '@/components/common';
import CommentUI from '../Comment/Comment';

type PostUIProps = {
	data: Post[];
	onViewableItemsChanged: (info: { viewableItems: ViewToken<Post>[] }) => void;
};

function PostUI({ data, onViewableItemsChanged }: PostUIProps) {
	const { gutters, fonts, components, layout } = useTheme();

	return (
		<FlatList
			data={data}
			ListEmptyComponent={<Text>No data</Text>}
			renderItem={({ item }) => (
				<View style={[gutters.marginBottom_16, components.card]}>
					<Text style={[fonts.bold, fonts.size_16, fonts.gray400]}>
						{item.title}
					</Text>
					{item?.comments.length > 0 && (
						<CommentUI data={item.comments} total={item.kids?.length || 0} />
					)}
				</View>
			)}
			keyExtractor={item => item.id.toString()}
			onViewableItemsChanged={onViewableItemsChanged}
			ListFooterComponent={
				<View style={[layout.fullWidth]}>
					<Skeleton />
				</View>
			}
		/>
	);
}

export default PostUI;
