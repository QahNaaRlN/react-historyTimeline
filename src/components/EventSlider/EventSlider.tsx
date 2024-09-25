import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Event } from '../../types';
import 'swiper/swiper-bundle.css';
import './EventSlider.scss';

interface EventSliderProps {
	events: Event[];
}

const EventSlider: React.FC<EventSliderProps> = ({ events }) => {
	return (
		<div className="event-slider">
			<Swiper
				modules={[Navigation, Pagination]}
				spaceBetween={30}
				slidesPerView={1}
				navigation
				pagination={{ clickable: true }}
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
	);
};

export default EventSlider;