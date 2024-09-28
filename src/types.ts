export interface TimelineData {
	id: number;
	name: string;
	startYear: number;
	endYear: number;
	events: Event[];
}

export interface Event {
	id: number;
	year: number;
	description: string;
}

export interface CircularNavProps {
	data: TimelineData[];
	activeIndex: number;
	onSelectTimeline: (index: number) => void;
}

export interface EventSliderProps {
	events: Event[];
	activeTimelineIndex: number;
	totalTimelinePoints: number;
	onPreviousTimeline: () => void;
	onNextTimeline: () => void;
}

export interface PointIndicatorProps {
	currentPoint: number;
	totalPoints: number;
}

export interface NavigationButtonsProps {
	onPrevious: () => void;
	onNext: () => void;
	disablePrevious: boolean;
	disableNext: boolean;
}

export interface Years {
	start: number;
	end: number;
}

export interface AnimationValues {
	startYear: number;
	endYear: number;
}

export interface Refs {
	startYearElem: HTMLSpanElement | null;
	endYearElem: HTMLSpanElement | null;
	animationValues: AnimationValues;
	gsapContext: gsap.Context | null;
}
