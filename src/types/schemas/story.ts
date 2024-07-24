export enum StoryType {
	TopStories = 'topstories',
	NewStories = 'newstories',
	BestStories = 'beststories',
}

export type Post = {
	id: number;
	title: string;
	content: string;
};
