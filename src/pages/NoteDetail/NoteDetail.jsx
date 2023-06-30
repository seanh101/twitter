import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getToken } from '../../utilities/users-service'

export default function NoteDetail() {
    const { noteId } = useParams()
    const [note, setNote] = useState('')
    const [error, setError] = useState(null)
    const token = getToken()
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/api/notes/${noteId}`)
			.then((res) => res.json())
			.then((note) => setNote(note))
			.catch((error) => setError(error.message))
    }, [])

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
        fetch(`/api/notes/${note._id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
            .then(res => res.json())
            .then(note => console.log('note was changed', note))
            .catch(error => setError(error.message))
    }

    function handleDelete() {
        fetch(`/api/notes/${note._id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(() => navigate('/notes/new'))
            .catch(error => setError(error.message))
    }

    return (
			<div>
				<h2>Note Detail Page</h2>
				{note && <p>{note.text}</p>}
                <button onClick={handleDelete}>Remove Note</button>
				{error && <p>{error}</p>}
				<form onSubmit={handleSubmit}>
					<input type='text' name='text' onChange={handleChange} value={note?.text}/>
					<input type='submit' />
				</form>
			</div>
		)
} 