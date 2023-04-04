import React, { useEffect, useRef, useState } from 'react';
import './Events.css';
import AddEventForm from '../../Components/addEventForm/AddEventForm';

const Events = () => {
  const [events, setEvents] = useState([]);
  const modalRef = useRef(null);
  const outsideModalRef = useRef(null);

  useEffect(() => {
    outsideModalRef.current.addEventListener('click', handleOutsideClick, true);
    fetchEvents();
    return () => {
      if (outsideModalRef.current) {
        outsideModalRef.current.removeEventListener('click', handleOutsideClick, true);
      }
    };
  }, []);

  const handleOutsideClick = (e) => {
    if (!modalRef.current.contains(e.target)) {
      // clicked outside modal
      closeModal();
    }
  };

  const openModal = () => {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
  };

  const closeModal = () => {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/events/events', {
        method: 'GET',
      });
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const responseData = await response.json();
      setEvents(responseData[0]);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div id="cf-in-store-events">
        <section id="cf-in-store-events-hero">
          <div className="container-fluid cf-store-events-hero-wrap">
            <div className="row">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="cf-hero-message">
                      <h1>
                        <span>
                          Participate in exciting events that will help you develop your skills and
                          contribute to open-source projects!
                        </span>
                      </h1>
                    </div>
                    {/* <!--cf-hero-message ends--> */}
                  </div>
                  {/* <!--col-md-12 ends--> */}
                </div>
                {/* <!--bes-row ends--> */}
                <div className="filters">
                  {/* <!-- <button onclick="openModal()" id = "fourth" className="fourth">Add Event</button> --> */}
                  <button type="button" className="connection filter-btn" onClick={openModal}>
                    Add event
                  </button>
                </div>
              </div>
              {/* <!--container ends--> */}
            </div>
            {/* <!--row ends--> */}
          </div>
          {/* <!--container-fluid ends--> */}
        </section>

        <section id="events-list">
          <div className="event-container" id="event-container">
            <div className="row">
              {events.map((event) => {
                return (
                  <div className="event-col">
                    <div className="event-card" key={event._id}>
                      <h3>{event.title}</h3>
                      <p>Date: {event.date}</p>
                      <p>Location: {event.location}</p>
                      <p>Description: {event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <AddEventForm
        outsideModalRef={outsideModalRef}
        modalRef={modalRef}
        closeModal={closeModal}
        fetchEvents={fetchEvents}
      />
    </>
  );
};

export default Events;
