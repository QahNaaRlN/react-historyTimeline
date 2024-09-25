import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { TimelineProps, TimelineData } from '../../types';
import CircularTimeline from '../CircularTimeline/CircularTimeline';
import EventSlider from '../EventSlider/EventSlider';
import './Timeline.scss';


const defaultTimelineData: TimelineData[] = [
	{
		id: 1,
		startYear: 1977,
		endYear: 1984,
		events: [
			{ id: 1, year: 2015, description: "Событие 1" },
			{ id: 2, year: 2016, description: "Событие 2" },
			{ id: 3, year: 2017, description: "Событие 3" },
		]
	},
	{
		id: 2,
		startYear: 1985,
		endYear: 1992,
		events: [
			{ id: 4, year: 1986, description: "Событие 4" },
			{ id: 5, year: 1991, description: "Событие 5" },
		]
	},
	{
		id: 3,
		startYear: 1993,
		endYear: 2000,
		events: [
			{ id: 6, year: 1995, description: "Событие 6" },
			{ id: 7, year: 1999, description: "Событие 7" },
		]
	},
	{
		id: 4,
		startYear: 2001,
		endYear: 2008,
		events: [
			{ id: 8, year: 2000, description: "Событие 8" },
			{ id: 9, year: 2007, description: "Событие 9" },
		]
	},
	{
		id: 5,
		startYear: 2009,
		endYear: 2016,
		events: [
			{ id: 10, year: 2010, description: "Событие 10" },
			{ id: 11, year: 2014, description: "Событие 11" },
		]
	},
	{
		id: 6,
		startYear: 2017,
		endYear: 2024,
		events: [
			{ id: 12, year: 2018, description: "Событие 12" },
			{ id: 13, year: 2022, description: "Событие 13" },
		]
	},
];

const Timeline: React.FC<TimelineProps> = ({ initialData }) => {
	const [timelineData, setTimelineData] = useState<TimelineData[]>(initialData || defaultTimelineData);
	const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);
	const [years, setYears] = useState({ start: 0, end: 0 });

	const refs = useRef({
		startYearElem: null as HTMLSpanElement | null,
		endYearElem: null as HTMLSpanElement | null,
		animationValues: { startYear: 0, endYear: 0 },
		gsapContext: null as gsap.Context | null
	});

	const currentTimeline = useMemo(() => timelineData[activeTimelineIndex], [timelineData, activeTimelineIndex]);

	useEffect(() => {
		refs.current.gsapContext = gsap.context(() => { });
		return () => refs.current.gsapContext?.revert();
	}, []);

	useEffect(() => {
		if (!currentTimeline) return;

		const { startYear, endYear } = currentTimeline;
		const { animationValues, gsapContext } = refs.current;

		gsapContext?.add(() => {
			gsap.to(animationValues, {
				duration: 1.5,
				startYear,
				endYear,
				ease: "power3.inOut",
				onUpdate: () => {
					setYears({
						start: Math.floor(animationValues.startYear),
						end: Math.floor(animationValues.endYear)
					});
				}
			});
		});
	}, [currentTimeline]);

	const handleTimelineSelect = (index: number) => {
		setActiveTimelineIndex(index);
	};

	if (timelineData.length === 0) {
		return <div>Нет данных для отображения</div>;
	}

	return (
		<section className="timeline">
			<div className="container">
				<div className="timeline-wrapper">
					<div className="vertical-line vertical-line--left"></div>
					<div className="vertical-line vertical-line--middle"></div>
					<div className="horizontal-line"></div>
					<div className="vertical-line vertical-line--right"></div>
					<h1 className='timeline-title'>Исторические даты</h1>
					<CircularTimeline
						data={timelineData}
						activeIndex={activeTimelineIndex}
						onSelectTimeline={handleTimelineSelect}
					/>
					<div className="timeline-years">
						<span
							ref={el => refs.current.startYearElem = el}
							className="timeline-year timeline-year--start"
						>
							{years.start}
						</span>
						<span
							ref={el => refs.current.endYearElem = el}
							className="timeline-year timeline-year--end"
						>
							{years.end}
						</span>
					</div>
					<EventSlider events={currentTimeline.events} />
				</div>
			</div>
		</section>
	);
};

export default Timeline;