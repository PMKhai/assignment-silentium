export enum StoryType {
	TopStories = 'topstories',
	NewStories = 'newstories',
	BestStories = 'beststories',
}

export type Post = {
	id: number;
	title: string;
	content: string;
	kids?: number[];
	comments: Comment[];
};

export interface Comment extends Post {
	parent: number;
	text: string;
}
