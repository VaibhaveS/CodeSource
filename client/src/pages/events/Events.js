import React from 'react';
import './Events.css';

const Events = () => {
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
                  <button type="button" className="connection" onclick="openModal()">
                    Add event
                  </button>
                  <label>&nbsp;&nbsp;Filter by Event Type:</label>
                  <select id="event-type-filter" class="connection">
                    <option value="all" className="value">
                      All
                    </option>
                    <option value="virtual" className="value">
                      Virtual
                    </option>
                    <option value="onsite" className="value">
                      On-site
                    </option>
                  </select>
                  <label>&nbsp;&nbsp;Search by Name:</label>
                  <input
                    type="text"
                    id="event-search"
                    placeholder="  Enter event name..."
                    className="connection"
                  />
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
            {/* <% for (var i = 0; i < events.length; i += 3) { %> */}
            <div className="row">
              {/* <% for (var j = i; j < i + 3 && j < events.length; j++) { %> */}
              <div className="event-col">
                <div className="event-card">
                  {/* <h3><%= events[j].title %></h3>
                          <p>Date: <%= events[j].date %></p>
                          <p>Location: <%= events[j].location %></p>
                          <p>Description: <%= events[j].description %></p> */}
                </div>
              </div>
              {/* <% } %> */}
            </div>
            {/* <% } %> */}
          </div>
        </section>
      </div>
      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close" onclick="closeModal()">
            &times;
          </span>
          <h2 style={{ textAlign: ' center' }}>Add New Event</h2>
          <form action="/add-events" method="post">
            <label for="title">Title:</label>
            <input className="text" type="text" id="title" name="title" required />
            <br />
            <br />
            <label for="date">Date:</label>
            <input className="text" type="date" id="date" name="date" required />
            <br />
            <br />
            <label for="location">Location:</label>
            <input className="text" type="text" id="location" name="location" required />
            <br />
            <br />
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>
            <br />
            <br />
            <button type="submit" className="connection" style={{ margin: 'auto' }}>
              Add Event
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Events;
