import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { TimelineData, Years, Refs } from '../../types';
import CircularNav from '../CircularNav/CircularNav';
import NavigationButtons from '../NavigationButtons/NavigationButtons';
import EventSlider from '../EventSlider/EventSlider';
import './HistoricalTimeline.scss';
import PointIndicator from '../PointIndicator/PointIndicator';


const defaultTimelineData: TimelineData[] = [
	{
		id: 1,
		name: "Наука",
		startYear: 1977,
		endYear: 1984,
		events: [
			{ id: 1, year: 2015, description: "13 сентября — частичное солнечное затмение, видимое в Южной Африке и части Антарктиды" },
			{ id: 2, year: 2016, description: "Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11" },
			{ id: 3, year: 2017, description: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi" },
			{ id: 14, year: 2018, description: "Запуск космического телескопа TESS для поиска экзопланет" },
			{ id: 15, year: 2019, description: "Первое в истории фото черной дыры, полученное с помощью телескопа Event Horizon" }
		]
	},
	{
		id: 2,
		name: "Кино",
		startYear: 1985,
		endYear: 1992,
		events: [
			{ id: 4, year: 1986, description: "Выход фильма «Чужие» режиссёра Джеймса Кэмерона, который стал культовым в жанре научной фантастики" },
			{ id: 5, year: 1991, description: "Премьера фильма «Терминатор 2: Судный день», который стал одним из самых успешных фильмов своего времени" },
			{ id: 16, year: 1988, description: "Выход анимационного фильма «Акира», ставшего классикой японской анимации" },
			{ id: 17, year: 1990, description: "Премьера фильма «Крепкий орешек 2», закрепившего за Брюсом Уиллисом статус звезды боевиков" }
		]
	},
	{
		id: 3,
		name: "Литература",
		startYear: 1993,
		endYear: 2000,
		events: [
			{ id: 6, year: 1995, description: "Выход романа «Полёт над гнездом кукушки» Кена Кизи, который стал классикой современной литературы" },
			{ id: 7, year: 1999, description: "Публикация романа «Гарри Поттер и узник Азкабана» Джоан Роулинг, который завоевал мировую популярность" },
			{ id: 18, year: 1996, description: "Выход романа «Бойцовский клуб» Чака Паланика, позже экранизированного Дэвидом Финчером" },
			{ id: 19, year: 1998, description: "Публикация книги «Код да Винчи» Дэна Брауна, ставшей международным бестселлером" }
		]
	},
	{
		id: 4,
		name: "Музыка",
		startYear: 2001,
		endYear: 2008,
		events: [
			{ id: 8, year: 2000, description: "Выход альбома «Hybrid Theory» группы Linkin Park, ставшего одним из самых продаваемых альбомов 21 века" },
			{ id: 9, year: 2007, description: "Релиз альбома «Back to Black» Эми Уайнхаус, который принес ей мировую известность" },
			{ id: 20, year: 2003, description: "Выпуск альбома «Elephant» группы The White Stripes, содержащего хит «Seven Nation Army»" },
			{ id: 21, year: 2006, description: "Релиз альбома «Stadium Arcadium» Red Hot Chili Peppers, получившего множество наград" }
		]
	},
	{
		id: 5,
		name: "Технологии",
		startYear: 2009,
		endYear: 2016,
		events: [
			{ id: 10, year: 2010, description: "Запуск iPad — первого планшета от Apple, который открыл новую эру мобильных устройств" },
			{ id: 11, year: 2014, description: "Выпуск первого смарт-часов Apple Watch, сделавших революцию на рынке носимых устройств" },
			{ id: 22, year: 2012, description: "Представление технологии Google Glass — очков дополненной реальности" },
			{ id: 23, year: 2015, description: "Запуск сервиса Tesla Powerwall для домашнего хранения электроэнергии" }
		]
	},
	{
		id: 6,
		name: "Искусство",
		startYear: 2017,
		endYear: 2024,
		events: [
			{ id: 12, year: 2018, description: "Выставка работ Бэнкси в Париже, вызвавшая общественный резонанс благодаря политическим и социальным темам" },
			{ id: 13, year: 2022, description: "Продажа картины Энди Уорхола за рекордную сумму на аукционе в Нью-Йорке" },
			{ id: 24, year: 2019, description: "Установка инсталляции «Венецианский апокалипсис» Лоренцо Куинна на биеннале в Венеции" },
			{ id: 25, year: 2021, description: "Первая крупная выставка цифрового искусства NFT в Музее современного искусства в Нью-Йорке" }
		]
	}
];


const HistoricalTimeline: React.FC = () => {
	const [timelineData, setTimelineData] = useState<TimelineData[]>(defaultTimelineData);
	const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);
	const [years, setYears] = useState<Years>({ start: 0, end: 0 });
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

	const refs = useRef<Refs>({
		startYearElem: null,
		endYearElem: null,
		animationValues: { startYear: 0, endYear: 0 },
		gsapContext: null
	});

	const currentTimeline = timelineData[activeTimelineIndex];

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

	const handlePrevious = useCallback(() => {
		setActiveTimelineIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
	}, []);

	const handleNext = useCallback(() => {
		setActiveTimelineIndex((prevIndex) => (prevIndex < timelineData.length - 1 ? prevIndex + 1 : prevIndex));
	}, [timelineData.length]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 991);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className="historical-timeline">
			<div className="container">
				<div className="historical-timeline__content">
					<div className="historical-timeline__circular">
						<h1 className="historical-timeline__title">Исторические даты</h1>
						<div className="historical-timeline__dates">
							<span
								ref={el => refs.current.startYearElem = el}
								className="historical-timeline__date historical-timeline__date--start"
							>
								{years.start}
							</span>
							<span
								ref={el => refs.current.endYearElem = el}
								className="historical-timeline__date historical-timeline__date--end"
							>
								{years.end}
							</span>
						</div>
						{!isMobile && (
							<>
								<CircularNav
									data={timelineData}
									activeIndex={activeTimelineIndex}
									onSelectTimeline={handleTimelineSelect}
								/>
								<div className="historical-timeline__controls">
									<PointIndicator
										currentPoint={activeTimelineIndex + 1}
										totalPoints={timelineData.length}
									/>
									<NavigationButtons
										onPrevious={handlePrevious}
										onNext={handleNext}
										disablePrevious={activeTimelineIndex === 0}
										disableNext={activeTimelineIndex === timelineData.length - 1}
									/>
								</div>
							</>
						)}
					</div>
					<div className="historical-timeline__events">
						<EventSlider
							events={currentTimeline.events}
							activeTimelineIndex={activeTimelineIndex}
							totalTimelinePoints={timelineData.length}
							onPreviousTimeline={handlePrevious}
							onNextTimeline={handleNext}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HistoricalTimeline;