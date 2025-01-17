import React from 'react';
import ReactDOM from 'react-dom/client';
import Timeline from './components/HistoricalTimeline/HistoricalTimeline';
import './styles/main.scss';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<Timeline />
	</React.StrictMode>
);
