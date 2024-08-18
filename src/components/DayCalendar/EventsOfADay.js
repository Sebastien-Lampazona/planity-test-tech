import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Event from '../Event';
import GetEventsWithPosition from '../../hooks/getEventsWithPosition';

const EventsOfADay = ({ events = [], width, height, startAt = 0, endAt = 0 }) => {
    const updatedEvents = GetEventsWithPosition({
        events,
        width,
        height,
        startAt,
        endAt,
    });
    const EventLists = useMemo(() => updatedEvents.map((event) => (
        <Event
            key={event.id}
            {...event}
        />
    )), [updatedEvents])

    return EventLists;
};

EventsOfADay.propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
    })),
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    startAt: PropTypes.number,
    endAt: PropTypes.number,
}

export default React.memo(EventsOfADay);