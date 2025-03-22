import React from 'react';

const Ad = ({ text, imageUrl, videoRef }) => {
    
  const statusMessages = {
    'not_attention': 'Pay attention!',
    'no face detected': 'Position face properly.',
    'attention': 'All good!',
  };

  const userFriendlyMessage = statusMessages[text] || 'Unknown Status';

  let badgeColor;
  switch (text) {
    case 'not_attention':
      badgeColor = '#dc3545'; 
      break;
    case 'no face detected':
      badgeColor = '#ffc107'; 
      break;
    case 'attention':
      badgeColor = '#28a745';
      break;
    default:
      badgeColor = '#007bff';
  }

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1000', width: '10vw' }}>
      <div style={{ textAlign: 'right' }}>
        {/*<img src={imageUrl} alt="Ad Image" style={{ maxWidth: '100%', height: 'auto' }} />*/} 
        <video ref={videoRef} autoPlay playsInline style={{ maxWidth: '100%', height: 'auto' }} />
        <p className="mt-5">
          <span style={{ backgroundColor: badgeColor, color: '#fff', padding: '0.5rem', borderRadius: '0.25rem', display: 'block', width: '100%', textAlign: 'center', textTransform: 'uppercase' }}>
            {userFriendlyMessage}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Ad;
