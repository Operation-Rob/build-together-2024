import { useNavigation } from '@remix-run/react';
import { cn } from '~/lib/utils';

export function GlobalPendingIndicator() {
	const navigation = useNavigation();
	const pending = navigation.state !== 'idle';

	return (
		<div className={cn('fixed left-0 right-0 top-0', { hidden: !pending })}>
			<div className="bg-muted h-0.5 w-full overflow-hidden">
				<div className="animate-progress bg-muted-foreground origin-left-right h-full w-full" />
			</div>
		</div>
	);
}
