import React from 'react';
import { NavigationButtonsProps } from '../../types';
import './NavigationButtons.scss';

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
	onPrevious,
	onNext,
	disablePrevious,
	disableNext
}) => {
	return (
		<div className="navigation-buttons">
			<button
				className="navigation-button navigation-button--previous"
				onClick={onPrevious}
				disabled={disablePrevious}
				aria-label="Предыдущий"
			>
				<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke="#42567A" strokeWidth="2" />
				</svg>
			</button>
			<button
				className="navigation-button navigation-button--next"
				onClick={onNext}
				disabled={disableNext}
				aria-label="Следующий"
			>
				<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke="#42567A" strokeWidth="2" />
				</svg>
			</button>
		</div>
	);
};

export default React.memo(NavigationButtons);