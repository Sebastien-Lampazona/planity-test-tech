import './App.scss';
import DayCalendar from './components/DayCalendar';
import events from './assets/input.json';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

function App() {
  return (
    <div className="main-app">
      <DayCalendar events={events}/>
    </div>
  );
}

export default App;
