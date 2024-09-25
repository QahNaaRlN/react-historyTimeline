export interface TimelineProps {
	// Здесь можно добавить пропсы, если они понадобятся
  }
  
  export interface TimelineData {
	id: number;
	startYear: number;
	endYear: number;
	events: Event[];
  }
  
  export interface Event {
	id: number;
	year: number;
	description: string;
  }
  