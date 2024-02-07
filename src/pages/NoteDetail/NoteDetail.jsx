// NoteDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from '../../utilities/users-service';

export default function NoteDetail() {
    const [tweet, setTweet] = useState(null);
    const { noteId } = useParams();
    const token = getToken(); // Get the token from wherever it's stored
  
    useEffect(() => {
      fetch(`/api/notes/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then(setTweet)
      .catch(error => console.error('Error fetching tweet details:', error));
    }, [noteId, token]); // Add token as a dependency if its value can change
  
    if (!tweet) return <div>Loading...</div>;
  

  return (
    <div>
      <h1>Tweet Details</h1>
      <p>{tweet.text}</p>
      {/* Here you could display and add comments */}
    </div>
  );
}
