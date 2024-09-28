import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { EventSliderProps } from '../../types';
import PointIndicator from '../PointIndicator/PointIndicator';
import 'swiper/swiper-bundle.css';
import './EventSlider.scss';

const EventSlider: React.FC<EventSliderProps> = ({
	events,
	activeTimelineIndex,
	totalTimelinePoints,
	onPreviousTimeline,
	onNextTimeline
}) => {
	const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

	const updateNavState = useCallback(() => {
		if (swiperInstance) {
			const { isBeginning, isEnd } = swiperInstance;
			setIsBeginning(isBeginning);
			setIsEnd(isEnd);
		}
	}, [swiperInstance]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 991);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (swiperInstance) {
			swiperInstance.on('slideChange', updateNavState);
			swiperInstance.on('resize', updateNavState);
			updateNavState();
		}
		return () => {
			if (swiperInstance) {
				swiperInstance.off('slideChange', updateNavState);
				swiperInstance.off('resize', updateNavState);
			}
		};
	}, [swiperInstance, updateNavState]);

	useEffect(() => {
		if (swiperInstance) {
			swiperInstance.slideTo(0, 0);
			updateNavState();
		}
	}, [activeTimelineIndex, swiperInstance, updateNavState]);

	const handleSwiper = (swiper: SwiperType) => {
		setSwiperInstance(swiper);
	};

	const handlePrev = useCallback(() => {
		swiperInstance?.slidePrev();
	}, [swiperInstance]);

	const handleNext = useCallback(() => {
		swiperInstance?.slideNext();
	}, [swiperInstance]);

	return (
		<div className="event-slider-container">
			<div className="event-slider">
				<Swiper
					modules={[Navigation, Pagination]}
					spaceBetween={20}
					slidesPerView="auto"
					onSwiper={handleSwiper}
					pagination={isMobile ? { clickable: true } : false}
					breakpoints={{
						320: {
							slidesPerView: 1.1,
						},
						768: {
							slidesPerView: 2.1,
						},
						992: {
							slidesPerView: 3.1,
						}
					}}
				>
					{events.map((event) => (
						<SwiperSlide key={event.id}>
							<div className="event-slide">
								<h3>{event.year}</h3>
								<p>{event.description}</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			{!isMobile && events.length > 1 && (
				<div className="custom-navigation">
					<button
						className={`nav-button prev ${isBeginning ? 'hidden' : ''}`}
						onClick={handlePrev}>
						<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 1L1 6L6 11" stroke="#3877EE" strokeWidth="2" />
						</svg>
					</button>
					<button
						className={`nav-button next ${isEnd ? 'hidden' : ''}`}
						onClick={handleNext}>
						<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M1 1L6 6L1 11" stroke="#3877EE" strokeWidth="2" />
						</svg>
					</button>
				</div>
			)}
			<div className={`timeline-controls ${isMobile ? 'mobile' : ''}`}>
				<PointIndicator
					currentPoint={activeTimelineIndex + 1}
					totalPoints={totalTimelinePoints}
				/>
				{isMobile && (
					<div className="timeline-nav-buttons">
						<button
							className="timeline-nav-button prev"
							onClick={onPreviousTimeline}
							disabled={activeTimelineIndex === 0}
						>
							<svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4.7489 1.04178L1.6239 4.16678L4.7489 7.29178" stroke="#42567A" strokeWidth="2" />
							</svg>
						</button>
						<button
							className="timeline-nav-button next"
							onClick={onNextTimeline}
							disabled={activeTimelineIndex === totalTimelinePoints - 1}
						>
							<svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1.58386 1.04178L4.70886 4.16678L1.58386 7.29178" stroke="#42567A" strokeWidth="2" />
							</svg>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EventSlider;