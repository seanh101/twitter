import React, { useEffect, useState } from 'react';
import { getToken, getUser } from '../../utilities/users-service';
import './TimelinePage.css';

export default function TimelinePage() {
    const [tweets, setTweets] = useState([]);
    const [editTweetId, setEditTweetId] = useState(null);
    const [editText, setEditText] = useState('');
    const [commentTexts, setCommentTexts] = useState({}); // State to track comment text for each tweet
    const currentUser = getUser();

    const handleCommentChange = (event, tweetId) => {
        setCommentTexts(prevCommentTexts => ({
            ...prevCommentTexts,
            [tweetId]: event.target.value
        }));
    };

    const handleCommentSubmit = (tweetId) => {
        const token = getToken();
        const commentText = commentTexts[tweetId];

        fetch(`/api/notes/${tweetId}/comments`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }),
            body: JSON.stringify({ text: commentText }),
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to submit comment');
            return response.json();
        })
        .then(updatedTweet => {
            const updatedTweets = tweets.map(tweet =>
                tweet._id === updatedTweet._id ? updatedTweet : tweet
            );
            setTweets(updatedTweets);
            setCommentTexts(prevCommentTexts => ({
                ...prevCommentTexts,
                [tweetId]: '' // Clear the comment text for this tweet after successful submit
            }));
        })
        .catch(error => console.error('Error submitting comment:', error));
    };

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
            const updatedTweets = tweets.map(tweet =>
                tweet._id === updatedTweet._id ? { ...tweet, text: updatedTweet.text } : tweet
            );
            setTweets(updatedTweets);
            setEditTweetId(null);
            setEditText('');
        })
        .catch(error => console.error('Error updating tweet:', error));
    };

    const handleChangeEdit = (event) => {
        setEditText(event.target.value);
    };

    return (
        <div className="timeline-container">
            <h1>Timeline</h1>
            {tweets.map(tweet => (
                <div key={tweet._id} className="tweet-container">
                    {editTweetId === tweet._id ? (
                        <div className="edit-tweet">
                            <textarea className="edit-textarea" value={editText} onChange={handleChangeEdit} />
                            <div className="edit-buttons">
                                <button className="save-btn" onClick={handleSaveEdit}>Save</button>
                                <button className="cancel-btn" onClick={() => setEditTweetId(null)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="tweet-content">
                                <strong>{tweet.user ? tweet.user.name : 'Anonymous'}</strong>: {tweet.text}
                                {currentUser && tweet.user && currentUser._id === tweet.user._id && (
                                    <div className="tweet-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(tweet)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(tweet._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                            <div className="comment-section">
                                <div className="comments-list">
                                    {tweet.comments && tweet.comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <div className="comment-header">
                                                <span className="comment-username">@{comment.user.username}</span>
                                                <span className="comment-date">{/* format date here */}</span>
                                            </div>
                                            <div className="comment-body">{comment.text}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="comment-input">
                                    <input
                                        type="text"
                                        placeholder="Tweet your reply"
                                        value={commentTexts[tweet._id] || ''}
                                        onChange={(event) => handleCommentChange(event, tweet._id)}
                                    />
                                    <button onClick={() => handleCommentSubmit(tweet._id)}>Reply</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
