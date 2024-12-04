import {React, useEffect} from 'react';

const AboutPage = () => {

  useEffect(() => {
    document.title = 'HobbyHive - About Us';
  }, []);
  return (
    <div className="page-container">
      <h1>About Us</h1>
      <p>Welcome to HobbyHive! We are a platform dedicated to connecting hobby enthusiasts from around the world...</p>
    </div>
  );
};

export default AboutPage;
