import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utilities/users-service';
import './NoteCreationPage.css'; 

export default function NoteCreationPage() {
    const [noteText, setNoteText] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = getToken();

    function handleSubmit(event) {
        event.preventDefault();
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text: noteText })
        })
        .then(response => {
            if (!response.ok) throw new Error('Response not OK');
            return response.json();
        })
        .then(data => {
            console.log('Created note:', data);
            navigate(`/notes/${data._id}`);
          })
          
        .catch(setError);
    }

    return (
        <div className="note-creation-container">
            <h1>Create a Note</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="What's happening?"
                    required
                />
                <button type="submit">Post</button>
            </form>
            {error && <p className="error">{error.toString()}</p>}
        </div>
    );
}