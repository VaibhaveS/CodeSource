import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import './Timeline.scss';

const Timeline = ({ issue, dueDate }) => {
  useEffect(() => {
    console.log('due date is ', dueDate);
  }, [dueDate, issue]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formatDateDetails = (date) => {
    // Define the month names as an array
    console.log('date', date);
    // Get the day, month and year from the Date object
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Get the day name from the Date object
    const dayName = dayNames[date.getDay()];
    console.log(day, month, year, dayName);
    return { day, month, year, dayName };
  };

  return (
    <div class="timeline-container">
      <div class="timeline-navbar">
        <span>Timeline</span>
      </div>

      {dueDate && (
        <div class="timeline-header">
          <div class="timeline-color-overlay">
            Due date &nbsp;
            <div class="timeline-day-number">{dueDate.day}</div>
            <div class="timeline-date-right">
              <div class="timeline-day-name">{formatDateDetails(dueDate).dayName}</div>
              <div class="timeline-month">
                {formatDateDetails(dueDate).month} {formatDateDetails(dueDate).year}
              </div>
            </div>
          </div>
        </div>
      )}

      <div class="timeline-timeline">
        <ul>
          <li>
            <div class="timeline-bullet green"></div>
            <div class="timeline-time">
              {issue.details && formatDateDetails(new Date(issue.details.created_at)).day}{' '}
              {issue.details && formatDateDetails(new Date(issue.details.created_at)).month}
            </div>
            <div class="timeline-desc">
              <h3>Created</h3>
            </div>
          </li>
          <li>
            <div class={issue.bookedBy ? 'timeline-bullet green' : 'timeline-bullet orange'}></div>

            {issue.bookedBy && (
              <div class="timeline-time">
                {formatDateDetails(new Date(issue.bookedBy.time)).day}{' '}
                {monthNames[formatDateDetails(new Date(issue.bookedBy.time)).month]}
              </div>
            )}
            <div class="timeline-desc">
              <h3>Assigned</h3>
              {issue.bookedBy && (
                <>
                  <h4>VaibhaveS</h4>
                  <div class="timeline-people">
                    <img src="https://avatars.githubusercontent.com/u/56480355?v=4" alt="" />
                  </div>
                </>
              )}
            </div>
          </li>
          <li>
            <div class="timeline-bullet green"></div>
            <div class="timeline-time">9 - 11am</div>
            <div class="timeline-desc">
              <h3>PR raised</h3>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
