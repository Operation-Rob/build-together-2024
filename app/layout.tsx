import { useEffect, useLayoutEffect } from 'react';

export interface Menu {
	title: string;
	links: Array<{
		title: string;
		to: string;
	}>;
}

export const useSafeLayoutEffect =
	typeof document === 'undefined' ? useEffect : useLayoutEffect;

export function MainNavigation({ menus }: { menus: Menu[] }) {
	return <div className="flex flex-col lg:h-screen"></div>;
}

export function Layout({
	children,
	menus,
}: {
	children?: React.ReactNode;
	menus: Menu[];
}) {
	return (
		<div className="mx-auto lg:container">
			<div className="flex flex-col-reverse lg:flex-row">
				<section className="sticky bottom-0 flex-1 lg:relative lg:bottom-auto">
					<div className="lg:sticky lg:top-0">
						<MainNavigation menus={menus} />
					</div>
				</section>
				<main className="flex-1">
					<div className="px-5 py-5 lg:py-10">{children}</div>
				</main>
			</div>
		</div>
	);
}

export function ErrorLayout({
	title,
	description,
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div className="flex h-screen items-center">
			<div className="mx-auto p-5">
				<h2 className="text-xl">{title}</h2>
				<p className="py-2">{description}</p>
			</div>
		</div>
	);
}
