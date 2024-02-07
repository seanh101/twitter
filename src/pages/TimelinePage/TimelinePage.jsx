import React, { useEffect, useState } from 'react';
import { getToken } from '../../utilities/users-service'; // Adjust the import path as necessary

export default function TimelinePage() {
    const [tweets, setTweets] = useState([]);
    const [editTweetId, setEditTweetId] = useState(null); // ID of the tweet being edited
    const [editText, setEditText] = useState(""); // Temporary state for edited text

    useEffect(() => {
        const token = getToken();
        fetch('/api/notes', {
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
            }),
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => setTweets(data))
        .catch(error => console.error('Error fetching tweets:', error));
    }, []);

    const handleEdit = (tweet) => {
        setEditTweetId(tweet._id);
        setEditText(tweet.text);
    };

    const handleDelete = (tweetId) => {
        const token = getToken();
        fetch(`/api/notes/${tweetId}`, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
            }),
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete tweet');
            setTweets(tweets.filter(tweet => tweet._id !== tweetId));
        })
        .catch(error => console.error('Error deleting tweet:', error));
    };

    const handleSaveEdit = () => {
        const token = getToken();
        fetch(`/api/notes/${editTweetId}`, {
            method: 'PATCH',
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ text: editText }),
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update tweet');
            return response.json();
        })
        .then(updatedTweet => {
          const updatedTweets = tweets.map(tweet => tweet._id === updatedTweet._id ? { ...updatedTweet, user: tweet.user } : tweet);
          setTweets(updatedTweets);
          setEditTweetId(null); // Exit edit mode
      })
      
        .catch(error => console.error('Error updating tweet:', error));
    };

    const handleChangeEdit = (event) => {
        setEditText(event.target.value);
    };

    return (
        <div>
            <h1>Timeline</h1>
            <ul>
                {tweets.map(tweet => (
                    <li key={tweet._id}>
                        {editTweetId === tweet._id ? (
                            <>
                                <textarea value={editText} onChange={handleChangeEdit} />
                                <button onClick={handleSaveEdit}>Save</button>
                                <button onClick={() => setEditTweetId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <strong>{tweet.user ? tweet.user.name : 'Anonymous'}</strong>: {tweet.text}
                                <button onClick={() => handleEdit(tweet)}>Edit</button>
                                <button onClick={() => handleDelete(tweet._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
