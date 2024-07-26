import { useTheme } from '@/theme';
import { Skeleton } from '@rneui/themed';

function SkeletonCustom() {
	const { components } = useTheme();
	return <Skeleton height={150} style={[components.skeleton]} />;
}

export default SkeletonCustom;
