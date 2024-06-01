/* eslint-disable react-refresh/only-export-components */
import { useTheme } from 'next-themes';
import * as React from 'react';
import Joyride, { CallBackProps, Step } from 'react-joyride';

export type TourType = 'search-mahasiswa' | 'edit-self-mahasiswa' | null;

export type TourState = {
	run: boolean;
	stepIndex: number;
	steps: Step[];
	tourType: TourType;
	tourActive: boolean;
	next?(state: CallBackProps): void;
	previous?(state: CallBackProps): void;
};

export const defaultTourValue: TourState = {
	run: false,
	stepIndex: 0,
	steps: [],
	tourType: null,
	tourActive: false,
	next: undefined,
	previous: undefined,
};

export const TourContext = React.createContext<{
	tourState: TourState;
	setTourState: React.Dispatch<React.SetStateAction<TourState>>;
}>({
	tourState: defaultTourValue,
	setTourState: () => undefined,
});

export function TourContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { resolvedTheme } = useTheme();
	const isDarkMode = resolvedTheme === 'dark';

	const [tourState, setTourState] = React.useState(defaultTourValue);
	const value = React.useMemo(
		() => ({ tourState, setTourState }),
		[tourState, setTourState],
	);

	const handleTourCallback = React.useCallback(
		(state: CallBackProps) => {
			if (
				state.action === 'skip' ||
				state.action === 'close' ||
				state.action === 'stop'
			) {
				setTourState(defaultTourValue);
				return;
			}

			if (state.action === 'next' && state.type === 'step:after') {
				if (tourState.next) {
					tourState.next(state);
					return;
				}

				if (tourState.stepIndex === tourState.steps.length - 1) {
					setTourState(defaultTourValue);
					return;
				}

				setTourState(prev => ({ ...prev, stepIndex: prev.stepIndex + 1 }));
			}

			if (state.action === 'prev' && state.type === 'step:after') {
				if (tourState.previous) {
					tourState.previous(state);
					return;
				}

				setTourState(prev => ({ ...prev, stepIndex: prev.stepIndex - 1 }));
			}
		},
		[setTourState, tourState],
	);

	React.useEffect(() => {
		console.log('Tour State', tourState);
	}, [tourState]);

	return (
		<TourContext.Provider value={value}>
			<Joyride
				continuous
				scrollToFirstStep
				showProgress
				showSkipButton
				stepIndex={tourState.stepIndex}
				callback={handleTourCallback}
				steps={tourState.steps}
				run={tourState.run}
				styles={{
					options: {
						arrowColor: isDarkMode ? 'rgb(38, 38, 38)' : 'rgb(255, 255, 255)',
						backgroundColor: isDarkMode
							? 'rgb(38, 38, 38)'
							: 'rgb(255, 255, 255)',
						overlayColor: isDarkMode
							? 'rgba(38, 38, 38, 0.9)'
							: 'rgba(255, 255, 255, 0.9)',
						primaryColor: 'rgb(2, 132, 199)',
						textColor: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(38, 38, 38)',
						zIndex: 1000,
					},
				}}
			/>
			{children}
		</TourContext.Provider>
	);
}

export const useTourContext = () => React.useContext(TourContext);
