import {
	Alert,
	FlatList,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/stories';
import ColorsWatchImage from '@/theme/assets/images/colorswatch.png';
// import { ImageVariant } from '@/components/atoms';
import { SafeScreen } from '@/components/template';
import SendImage from '@/theme/assets/images/send.png';
import { Post, StoryType } from '@/types/schemas';
import TranslateImage from '@/theme/assets/images/translate.png';
import { fetchItem, fetchStories } from '@/services/stories';
// import i18next from 'i18next';
import { isImageSourcePropType } from '@/types/guards/image';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/theme';

// import { useTranslation } from 'react-i18next';

const types = [
	{ label: 'New Stories', value: StoryType.NewStories },
	{ label: 'Top Stories', value: StoryType.TopStories },
	{ label: 'Best Stories', value: StoryType.BestStories },
];

function Stories() {
	// const { t } = useTranslation(['common', 'welcome']);

	const {
		// colors,
		// variant,
		// changeTheme,
		layout,
		gutters,
		// fonts,
		// components,
		// backgrounds,
	} = useTheme();

	const [type, setType] = useState<StoryType>(StoryType.NewStories);
	const [postIds, setPostIds] = useState<number[]>([]);
	const [post, setPost] = useState<Post[]>([]);
	const [isLoadingNewStories, setIsLoadingNewStories] = useState(false);

	const { isSuccess, data, isFetching } = useQuery({
		queryKey: ['Stories', type],
		queryFn: () => {
			return fetchStories(type);
		},
	});

	const fetchPosts = async () => {
		setIsLoadingNewStories(true);
		const newPost = await Promise.all(
			postIds.map(async id => {
				try {
					return await fetchItem(id);
				} catch (error) {
					if (error instanceof Error) {
						Alert.alert('Error', error.message);
					}
					return null as unknown as Post;
				}
			}),
		);
		setPost(prev => [...prev, ...newPost]);
		setIsLoadingNewStories(false);
	};

	useEffect(() => {
		if (isSuccess) {
			setPostIds(data.slice(0, 5));
		}
	}, [isSuccess, data]);

	useEffect(() => {
		if (postIds.length > 0) {
			void fetchPosts();
		}
	}, [postIds]);

	if (
		!isImageSourcePropType(SendImage) ||
		!isImageSourcePropType(ColorsWatchImage) ||
		!isImageSourcePropType(TranslateImage)
	) {
		throw new Error('Image source is not valid');
	}

	return (
		<SafeScreen>
			<View style={[gutters.paddingHorizontal_32, gutters.marginTop_40]}>
				<View
					style={[
						layout.row,
						layout.justifyBetween,
						layout.fullWidth,
						gutters.marginTop_16,
					]}
				>
					{types.map(item => (
						<Badge
							active={type === item.value}
							key={item.value}
							label={item.label}
							value={item.value}
							onPress={() => {
								if (type === item.value || isLoadingNewStories) {
									return;
								}

								setType(item.value);
								setPost([]);
							}}
						/>
					))}
				</View>
				<View
					style={[
						layout.row,
						layout.justifyBetween,
						layout.fullWidth,
						gutters.marginTop_16,
					]}
				>
					{isFetching ? (
						<Text>Loading...</Text>
					) : (
						<FlatList
							data={post}
							renderItem={({ item }) => (
								<View style={[gutters.marginBottom_16]}>
									<TouchableOpacity>
										<Text>{item.title}</Text>
									</TouchableOpacity>
								</View>
							)}
							keyExtractor={item => item.id.toString()}
						/>
					)}
				</View>
			</View>
		</SafeScreen>
	);
}

export default Stories;
