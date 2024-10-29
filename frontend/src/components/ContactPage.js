import {React, useEffect} from 'react';

const ContactPage = () => {
  useEffect(() => {
    document.title = 'HobbyHive - Contact';
  }, []);
  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>If you have any questions, suggestions, or feedback, please reach out to us at support@hobbyhive.com...</p>
    </div>
  );
};

export default ContactPage;
