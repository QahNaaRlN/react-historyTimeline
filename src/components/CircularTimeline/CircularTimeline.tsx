import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TimelineData } from '../../types';
import './CircularTimeline.scss';

interface CircularTimelineProps {
	data: TimelineData[];
	activeIndex: number;
	onSelectTimeline: (index: number) => void;
}

const CircularTimeline: React.FC<CircularTimelineProps> = ({ data, activeIndex, onSelectTimeline }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const totalPoints = data.length;
	const radius = 150; // Радиус круга

	useEffect(() => {
		// Удаляем ненужную анимацию вращения всего круга
	}, []);

	return (
		<div className="circular-timeline">
			<svg ref={svgRef} width={radius * 2} height={radius * 2}>
				<circle cx={radius} cy={radius} r={radius - 5} stroke="#ccc" strokeWidth="2" fill="none" />

				{data.map((item, index) => {
					const angle = (index / totalPoints) * 2 * Math.PI - Math.PI / 2;
					const x = radius + (radius - 5) * Math.cos(angle);
					const y = radius + (radius - 5) * Math.sin(angle);

					return (
						<g
							key={item.id}
							className="timeline-point"
							onClick={() => onSelectTimeline(index)}
						>
							<circle
								cx={x}
								cy={y}
								r={8}
								fill={index === activeIndex ? "#000" : "#fff"}
								stroke="#000"
								strokeWidth="2"
							/>
							{index === activeIndex && (
								<text x={x} y={y - 15} textAnchor="middle">
									{item.startYear}
								</text>
							)}
						</g>
					);
				})}
			</svg>
		</div>
	);
};

export default CircularTimeline;
