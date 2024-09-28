import React from 'react';
import { PointIndicatorProps } from '../../types';
import './PointIndicator.scss';

const PointIndicator: React.FC<PointIndicatorProps> = ({ currentPoint, totalPoints }) => {
	const formattedCurrentPoint = currentPoint.toString().padStart(2, '0');
	const formattedTotalPoints = totalPoints.toString().padStart(2, '0');

	return (
		<div className="point-indicator">
			<span className="point-indicator__current">{formattedCurrentPoint}</span>
			<span className="point-indicator__separator">/</span>
			<span className="point-indicator__total">{formattedTotalPoints}</span>
		</div>
	);
};

export default React.memo(PointIndicator);