import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import EventsOfADay from './EventsOfADay';

import './styles.scss';

const hourStart = 9;
const hourEnd = 21;

const DayCalendar = ({ events = [] }) => {
  const eventListRef = React.createRef();
  const [eventListSizes, setEventListSizes] = useState({ width: 0, height: 0 });

  const hourlyDivs = useMemo(() => {
    // On commence à minuit aujourd'hui
    const startTime = dayjs().startOf('day').add(hourStart, 'hour');

    const diffHour = hourEnd - hourStart + 1;
    // Crée un tableau de 24 heures
    const hoursArray = Array.from({ length: diffHour }, (_, i) => startTime.add(i, 'hour'));
    return hoursArray.map((hour, index) => (
      <div
        className='hourly-div'
        key={index}
        style={{
          height: `${(100 / diffHour)}%`,
        }}
      >
        {hour.format('HH:mm')} {/* Affiche l'heure au format HH:mm */}
      </div>
    ))
  }, []);

  const checkEventsListSize = useCallback(() => {
    if (!eventListRef.current) return;
    setEventListSizes({
      width: eventListRef.current.clientWidth,
      height: eventListRef.current.clientHeight,
    });
  }, [eventListRef]);

  useEffect(() => {
    window.addEventListener('resize', checkEventsListSize);
    return () => {
      window.addEventListener('resize', checkEventsListSize);
    }
  }, [checkEventsListSize]);

  useEffect(() => {
    checkEventsListSize()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='hourly-divs'>
      <div className='hours'>
        {hourlyDivs}
      </div>
      <div className='events'
        ref={eventListRef}
      >
        <EventsOfADay
          events={events}
          startAt={hourStart}
          endAt={hourEnd}
          width={eventListSizes.width}
          height={eventListSizes.height}
        />
      </div>
    </div>
  )
}

DayCalendar.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    start: PropTypes.string,
    duration: PropTypes.number,
  }))
}

export default DayCalendar;