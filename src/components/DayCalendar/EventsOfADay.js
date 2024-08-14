import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Event from '../Event';

const EventsOfADay = ({ events = [], width, height, startAt = 0, endAt = 0 }) => {

    const deepCheckEventOverlap = useCallback((event, previousEvent) => {
        const previousEventStart = dayjs(previousEvent.start, 'HH:mm');
        const previousEventEnd = dayjs(previousEvent.start, 'HH:mm').add(previousEvent.duration, 'minute');
        const eventStart = dayjs(event.start, 'HH:mm');
        const eventEnd = dayjs(event.start, 'HH:mm').add(event.duration, 'minute');
        if (event.start === '19:40'){
            console.log('calcul overlap', {
                previousEventStart: previousEventStart.format('HH:mm'),
                previousEventEnd: previousEventEnd.format('HH:mm'),
                eventStart: eventStart.format('HH:mm'),
                eventEnd: eventEnd.format('HH:mm'),
            });
        }
        // Is overlapping another event
        if (
            eventStart.isBefore(previousEventEnd)
            && eventEnd.isAfter(previousEventStart)
        ) {
            event.overlap = previousEvent;
            if (
                previousEvent.overlap
                && eventStart.isAfter(previousEvent.overlap.start, 'HH:mm')
                && eventEnd.isBefore(previousEventEnd)
            ) {
                return deepCheckEventOverlap(event, previousEvent.overlap);
            }
            else {
                return previousEvent;
            }
        }
        return null;
    }, []);

    const deepCountEventOverlap = useCallback((event) => {
        let count = 0;
        let currentEvent = event;
        while (currentEvent.overlap) {
            count++;
            currentEvent = currentEvent.overlap;
        }
        return count;
    }, []);

    const getBetterOverlapEvent = useCallback((event) => {
        let currentEvent = event;
        const eventStart = dayjs(event.start, 'HH:mm');
        while (currentEvent.overlap) {
            const currentEventOverlapEnd = dayjs(currentEvent.overlap.start, 'HH:mm').add(currentEvent.overlap.duration, 'minute');
            if (eventStart.isAfter(currentEventOverlapEnd)) {
                return currentEvent.overlap;
            }
            currentEvent = currentEvent.overlap;
        }
        return null;
    }, []);

    const updatedEvents = useMemo(() => {
        const sortedEvents = [...events].sort((a, b) => {

            const aStart = dayjs(a.start, 'HH:mm');
            const bStart = dayjs(b.start, 'HH:mm');
            return aStart.isSameOrBefore(bStart) ? -1 : 1;
        });

        sortedEvents.forEach((event, index) => {
            if (index === 0) return;
            // Get last overlaping event
            return deepCheckEventOverlap(event, sortedEvents[index - 1]);
        });

        sortedEvents.forEach((event) => {
            const minuteHeight = height / ((endAt - startAt + 1) * 60);
            // Calcul de la position de l'événement en pixels
            const top = dayjs(event.start, 'HH:mm').diff(dayjs().startOf('day').add(startAt, 'hours'), 'minute') * minuteHeight;
            const eventHeight = event.duration * minuteHeight;
            let eventWidth = width;
            const left = 0;

            event.top = top;
            event.left = left;
            event.height = eventHeight;
            event.width = eventWidth;

            const betterOverlapEvent = getBetterOverlapEvent(event);

            if (event.overlap) {
                if (betterOverlapEvent) {
                    const nbOverlaping = deepCountEventOverlap(event);
                    const divider = nbOverlaping;
                    betterOverlapEvent.width = eventWidth / divider;
                    event.left = betterOverlapEvent.left;
                    event.width = betterOverlapEvent.width;
                    event.overlapCounter = nbOverlaping;
                }

                else {
                    const nbOverlaping = deepCountEventOverlap(event);
                    const divider = 1 + nbOverlaping;
                    eventWidth = eventWidth / divider;

                    let currentEvent = event;
                    let offset = nbOverlaping;
                    while (currentEvent) {
                        currentEvent.width = eventWidth;
                        currentEvent.left = offset * eventWidth;
                        currentEvent = currentEvent.overlap;
                        offset--;
                    }
                }
            }

            if (event.start === '19:40'){
                console.log('calcul overlap', {
                    event
                });
            }
        });
        return sortedEvents;
    }, [events, deepCheckEventOverlap, height, endAt, startAt, width, getBetterOverlapEvent, deepCountEventOverlap]);

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