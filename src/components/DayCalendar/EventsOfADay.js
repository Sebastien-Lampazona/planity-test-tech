import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Event from '../Event';

const EventsOfADay = ({ events = [], width, height, startAt = 0, endAt = 0 }) => {

    const deepCheckEventOverlap = useCallback((event, previousEvent) => {
        if (!dayjs(event.start, 'HH:mm').isBefore(dayjs(previousEvent.start, 'HH:mm').add(previousEvent.duration, 'minute'))) {
            return null
        }
        if (previousEvent.overlap) {
            return deepCheckEventOverlap(previousEvent, previousEvent.overlap);
        }
        return previousEvent;

    }, []);

    const updatedEvents = useMemo(() => {
        const sortedEvents = [...events].sort((a, b) => {
            const aStart = dayjs(a.start, 'HH:mm');
            const bStart = dayjs(b.start, 'HH:mm');
            return aStart.isBefore(bStart) ? -1 : 1;

        });

        sortedEvents.forEach((event, index) => {
            const minuteHeight = height / ((endAt - startAt + 1) * 60);
            // Calcul de la position de l'événement en pixels
            const top = dayjs(event.start, 'HH:mm').diff(dayjs().startOf('day').add(startAt, 'hours'), 'minute') * minuteHeight;
            const eventHeight = event.duration * minuteHeight;
            const eventWidth = 800;//width / (nbOverlapTotal || 1);
            const left = 0;

            event.top = top;
            event.left = left;
            event.height = eventHeight;
            event.width = eventWidth;

            let previousEvent = null;
            // Check if the event is overlapping with previous event

            if (index > 0) {
                previousEvent = sortedEvents[index - 1];
                // If the event is overlapping with the previous event
               const overlapingEvent = deepCheckEventOverlap(event, previousEvent);
                if (overlapingEvent) {
                    event.overlap = overlapingEvent;
                    event.width = eventWidth / 2;
                    event.left = overlapingEvent.left + eventWidth / 2;
                    event.overlap.width = eventWidth / 2;
                }
            }
        });
        return sortedEvents;
    }, [events, width, height, deepCheckEventOverlap, startAt, endAt]);

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