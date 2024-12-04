import {React, useEffect} from 'react';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    document.title = 'HobbyHive - Privacy Policy';
  }, []);
  return (
    <div className="page-container">
      <h1>Privacy Policy</h1>
      <p>Your privacy is important to us. This policy outlines how we handle your data...</p>
    </div>
  );
};

export default PrivacyPolicyPage;
