import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { TimelineData } from '../../types';
import './CircularTimeline.scss';

interface CircularTimelineProps {
	data: TimelineData[];
	activeIndex: number;
	onSelectTimeline: (index: number) => void;
}

const CircularTimeline: React.FC<CircularTimelineProps> = ({ data, activeIndex, onSelectTimeline }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [rotation, setRotation] = useState(0);
	const animationRef = useRef<gsap.core.Tween | null>(null);
	const totalPoints = data.length;
	const svgSize = 100;
	const centerX = svgSize / 2;
	const centerY = svgSize / 2;
	const radius = 45;
	const activeAngle = -Math.PI / 6; // -30 градусов (правая верхняя четверть)

	const calculatePointPosition = useCallback((index: number) => {
		const angle = -2 * Math.PI * (index / totalPoints) + activeAngle - rotation;
		const x = centerX + radius * Math.cos(angle);
		const y = centerY + radius * Math.sin(angle);
		return { x, y };
	}, [totalPoints, rotation]);

	const updatePointsPosition = useCallback(() => {
		if (containerRef.current) {
			const pointElements = containerRef.current.querySelectorAll('.timeline-point');
			pointElements.forEach((point, index) => {
				const { x, y } = calculatePointPosition(index);
				gsap.set(point, {
					left: `${x}%`,
					top: `${y}%`,
					xPercent: -50,
					yPercent: -50
				});
			});
		}
	}, [calculatePointPosition]);

	useEffect(() => {
		updatePointsPosition();
	}, [rotation, updatePointsPosition]);

	useEffect(() => {
		const currentIndex = Math.round((rotation / (2 * Math.PI)) * totalPoints) % totalPoints;
		let targetRotation = ((activeIndex - currentIndex + totalPoints) % totalPoints) * (2 * Math.PI / totalPoints);

		if (targetRotation === 0 && currentIndex !== activeIndex) {
			targetRotation = 2 * Math.PI;
		}

		// Отменяем предыдущую анимацию, если она есть
		if (animationRef.current) {
			animationRef.current.kill();
		}

		// Создаем новую анимацию
		animationRef.current = gsap.to({}, {
			duration: targetRotation / (2 * Math.PI) * 2, // Длительность зависит от расстояния
			onUpdate: () => {
				setRotation(prevRotation => {
					const newRotation = prevRotation + 0.02;
					return newRotation >= 2 * Math.PI ? newRotation - 2 * Math.PI : newRotation;
				});
			},
			ease: "none", // Линейная анимация без ускорений и замедлений
			onComplete: () => {
				setRotation(targetRotation % (2 * Math.PI));
			}
		});

		return () => {
			if (animationRef.current) {
				animationRef.current.kill();
			}
		};
	}, [activeIndex, totalPoints]);

	return (
		<div className="circular-timeline" ref={containerRef}>
			<svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="timeline-circle">
				<circle cx={centerX} cy={centerY} r={radius} stroke="#f4f5f9" strokeWidth="1" fill="none" />
			</svg>
			{data.map((item, index) => {
				const isActive = index === activeIndex;
				return (
					<div
						key={item.id}
						className={`timeline-point ${isActive ? 'active' : ''}`}
						onClick={() => onSelectTimeline(index)}
					>
						<div className="point"></div>
						{isActive && (
							<div className="point-info">
								<div className="year">{item.startYear}</div>
								<div className="title">{item.title}</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default CircularTimeline;