import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../utilities/users-service'

export default function NotesPage({ user }) {
    const [notes, setNotes] = useState(null)
    const [error, setError] = useState(null)
    const [note, setNote] = useState('')
    const token = getToken()
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/notes', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(notesJSON => setNotes(notesJSON))
            .catch(errorResponse => setError(errorResponse))
    }, [])

    const notesJSX = notes?.map((note) => (
			<li key={note._id}>
				<Link to={`/notes/${note._id}`}>{note.text}</Link>
			</li>
		))
    
    function handleChange(event) {
        setNote(prevNote => {
            return {
                ...prevNote,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
            .then(res => res.json())
            .then(note => navigate(`/notes/${note._id}`))
            .catch(error => setError(error.message))
    }

    return (
        <div>
        <h2>Notes Page</h2>
        {error && <p>There was an error: {error.message}</p>}
        {notes && notesJSX}
        <form onSubmit={handleSubmit}>
            <input type='text' name='text' onChange={handleChange}/>
            <input type='submit' />
        </form>
        </div>
    )
}