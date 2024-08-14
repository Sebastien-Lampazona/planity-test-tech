import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Event = ({
    id = null,
    start = '00h00',
    duration = 60,
    top = 0,
    left = 0,
    width = '100%',
    height = 100,
    overlapCounter = 0,
}) => {
    const startTime = useMemo(() => dayjs(start, 'HH:mm'), [start]);
    const fontSize = useMemo(() => Math.min(Math.max(height / 2, 10), 30), [height]);
    return (
        <div className='event' style={{
            top,
            left,
            width,
            height,
            fontSize,
        }}>
            <div className='event-content'>
                <div className='event-time'>{startTime.format('HH:mm')} - { startTime.add(duration, 'minutes').format('HH:mm')} - {`Event ${id}`}</div>
            </div>
        </div>
    );
};

Event.propTypes = {
    id: PropTypes.number,
    start: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,

    top: PropTypes.number,
    left: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,

    overlapCounter: PropTypes.number,
}

export default Event;