import { Alert, Text, TouchableOpacity, View, ViewToken } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/stories';
import ColorsWatchImage from '@/theme/assets/images/colorswatch.png';
import { ImageVariant } from '@/components/atoms';
import { SafeScreen } from '@/components/template';
import SendImage from '@/theme/assets/images/send.png';
import { Comment, Post, StoryType } from '@/types/schemas';
import TranslateImage from '@/theme/assets/images/translate.png';
import { fetchItem, fetchStories } from '@/services/stories';
import i18next from 'i18next';
import { isImageSourcePropType } from '@/types/guards/image';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/theme';
import PostUI from '@/components/stories/Post/Post';

import { useTranslation } from 'react-i18next';

function Stories() {
	const { t } = useTranslation(['common']);

	const { components, colors, layout, gutters, variant, changeTheme } =
		useTheme();

	const [type, setType] = useState<StoryType>(StoryType.NewStories);
	const [postIds, setPostIds] = useState<number[]>([]);
	const [post, setPost] = useState<Post[]>([]);
	const [isLoadingNewStories, setIsLoadingNewStories] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [offset, setOffset] = useState(0);

	const types = [
		{ label: t('common:newStories'), value: StoryType.NewStories },
		{ label: t('common:topStories'), value: StoryType.TopStories },
		{ label: t('common:bestStories'), value: StoryType.BestStories },
	];

	const { isSuccess, data, isFetching } = useQuery({
		queryKey: ['Stories', type],
		queryFn: () => {
			return fetchStories(type);
		},
	});

	// Todo: optimize post data fetching
	const fetchPosts = useCallback(async () => {
		if (offset === 0) {
			setIsLoading(true);
		} else {
			setIsLoadingNewStories(true);
		}
		try {
			const newPosts = await Promise.all(
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

			const postsWithComments = await Promise.all(
				newPosts.map(async item => {
					if (!item) return null;

					let comments: Comment[] = [];

					if (item.kids) {
						comments = await Promise.all(
							item.kids.slice(0, 3).map(async id => {
								try {
									return await fetchItem(id);
								} catch (error) {
									if (error instanceof Error) {
										Alert.alert('Error', error.message);
									}
									return null as unknown as Comment;
								}
							}),
						);
						comments = comments.filter(
							(comment): comment is Comment => comment !== null,
						);
					}

					return { ...item, comments };
				}),
			);
			setPost(prev => [...prev, ...postsWithComments] as Post[]);
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert('Error', error.message);
			}
		} finally {
			setIsLoading(false);
			setIsLoadingNewStories(false);
		}
	}, [postIds]);

	useEffect(() => {
		if (isSuccess) {
			setPostIds(data.slice(offset * 10, offset * 10 + 10));
		}
	}, [data, offset]);

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
	const onViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: ViewToken<Post>[] }) => {
			const endReach =
				viewableItems[viewableItems.length - 1].index === post.length - 1;
			if (endReach) {
				setOffset(prev => prev + 1);
			}
		},
		[post],
	);

	const onChangeType = useCallback(
		(value: StoryType) => {
			if (type === value || isLoadingNewStories) {
				return;
			}
			setPostIds([]);
			setPost([]);
			setOffset(0);
			setType(value);
		},
		[isLoadingNewStories, type],
	);

	const onChangeLanguage = useCallback(
		(lang: 'fr' | 'en') => {
			void i18next.changeLanguage(lang);
		},
		[i18next],
	);

	const onChangeTheme = useCallback(() => {
		changeTheme(variant === 'default' ? 'dark' : 'default');
	}, [variant]);

	return (
		<SafeScreen>
			<View style={[gutters.paddingHorizontal_32, gutters.marginTop_40]}>
				<View style={[layout.row, layout.justifyBetween, layout.fullWidth]}>
					<TouchableOpacity
						testID="change-theme-button"
						style={[components.buttonCircle, gutters.marginBottom_12]}
						onPress={() => onChangeTheme()}
					>
						<ImageVariant
							source={ColorsWatchImage}
							style={{ tintColor: colors.purple500 }}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						testID="change-language-button"
						style={[components.buttonCircle, gutters.marginBottom_12]}
						onPress={() =>
							onChangeLanguage(i18next.language === 'fr' ? 'en' : 'fr')
						}
					>
						<ImageVariant
							source={TranslateImage}
							style={{ tintColor: colors.purple500 }}
						/>
					</TouchableOpacity>
				</View>
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
							onPress={() => onChangeType(item.value)}
						/>
					))}
				</View>
				<View
					style={[
						layout.row,
						layout.justifyBetween,
						layout.fullWidth,
						layout.height80,
						gutters.marginTop_16,
					]}
				>
					{isFetching || isLoading ? (
						<Text>Loading...</Text>
					) : (
						<PostUI
							data={post}
							onViewableItemsChanged={onViewableItemsChanged}
						/>
					)}
				</View>
			</View>
		</SafeScreen>
	);
}

export default Stories;
