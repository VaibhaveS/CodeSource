import React, { useState } from 'react';
import './AddEventForm.css';

const AddEventForm = ({ outsideModalRef, modalRef, closeModal, fetchEvents }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });

  const handleForm = async (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/events/addEvent', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.title,
        date: formData.date,
        location: formData.location,
        description: formData.description,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error('authentication has been failed!');
      })
      .then((resObject) => {
        setTimeout(() => {
          fetchEvents();
          closeModal();
          setFormData({ title: '', date: '', location: '', description: '' });
        }, 100);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div id="myModal" className="modal" ref={outsideModalRef}>
      <div className="modal-content" ref={modalRef}>
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2 style={{ textAlign: ' center' }}>Add New Event</h2>
        <form onSubmit={handleForm}>
          <label htmlFor="title">Title:</label>
          <input
            className="text"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <br />
          <br />
          <label htmlFor="date">Date:</label>
          <input
            className="text"
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <br />
          <br />
          <label htmlFor="location">Location:</label>
          <input
            className="text"
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <br />
          <br />
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          ></textarea>
          <br />
          <br />
          <button type="submit" className="connection" style={{ margin: 'auto' }}>
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
