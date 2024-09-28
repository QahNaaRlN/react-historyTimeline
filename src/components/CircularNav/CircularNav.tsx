import React, { useState, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { TimelineData, CircularNavProps } from '../../types';
import './CircularNav.scss';

const MAX_POINTS = 100;
const ANIMATION_DURATION = 300; // ms

const CircularNav: React.FC<CircularNavProps> = ({ data, activeIndex, onSelectTimeline }) => {
	const [rotation, setRotation] = useState(0);
	const [isAnimationComplete, setIsAnimationComplete] = useState(true);
	const totalPoints = Math.min(data.length, MAX_POINTS);
	const activeAngle = 30;
	const circleRef = useRef<HTMLDivElement>(null);
	const isInitialRenderRef = useRef(true);

	const calculateRotation = useCallback((index: number) => {
		if (totalPoints === 0) return 0;
		const anglePerPoint = 360 / totalPoints;
		return (activeAngle - index * anglePerPoint + 360) % 360;
	}, [totalPoints]);

	const pointPositions = useMemo(() => {
		if (totalPoints === 0) return [];
		return data.slice(0, MAX_POINTS).map((_, index) => {
			const angle = (2 * Math.PI * index) / totalPoints - Math.PI / 2;
			const radius = 50;
			const x = 50 + radius * Math.cos(angle);
			const y = 50 + radius * Math.sin(angle);
			return { x, y };
		});
	}, [data, totalPoints]);

	const handlePointClick = useCallback((index: number) => {
		if (index === activeIndex) return;
		isInitialRenderRef.current = false;
		setIsAnimationComplete(false);
		onSelectTimeline(index);
	}, [onSelectTimeline, activeIndex]);

	useLayoutEffect(() => {
		if (isInitialRenderRef.current) {
			setRotation(calculateRotation(activeIndex));
			isInitialRenderRef.current = false;
			return;
		}

		const startRotation = rotation;
		const targetRotation = calculateRotation(activeIndex);
		let newRotation = targetRotation - startRotation;

		if (Math.abs(newRotation) > 180) {
			newRotation = newRotation > 0 ? newRotation - 360 : newRotation + 360;
		}

		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsedTime = currentTime - startTime;
			const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);
			const currentRotation = startRotation + newRotation * progress;

			if (circleRef.current) {
				circleRef.current.style.setProperty('--rotation', `${currentRotation}deg`);
			}

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setRotation(currentRotation);
				setIsAnimationComplete(true);
			}
		};

		requestAnimationFrame(animate);
	}, [activeIndex, calculateRotation, rotation]);

	if (totalPoints === 0) {
		return null;
	}

	return (
		<div className="circular-nav">
			<div className="circular-nav__wrapper">
				<div
					ref={circleRef}
					className={`circular-nav__circle ${isInitialRenderRef.current ? 'circular-nav__circle--no-transition' : ''}`}
				>
					{data.slice(0, MAX_POINTS).map((item: TimelineData, index: number) => {
						const { x, y } = pointPositions[index];
						const isActive = index === activeIndex;
						return (
							<div
								key={item.id}
								className={`circular-nav__point ${isActive ? 'circular-nav__point--active' : ''}`}
								style={{
									'--x': `${x}%`,
									'--y': `${y}%`,
								} as React.CSSProperties}
								onClick={() => handlePointClick(index)}
							>
								<div className="circular-nav__point-marker">
									<span className="circular-nav__point-index">{index + 1}</span>
								</div>
								{isActive && isAnimationComplete && (
									<div className="circular-nav__point-info">
										<div className="circular-nav__point-name">{item.name}</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default React.memo(CircularNav);