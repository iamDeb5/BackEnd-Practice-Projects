import React, { useRef, useState } from 'react'
import "../styles/createPost.scss"
import { usePost } from '../hooks/usePost';
import { useNavigate } from 'react-router';

const CreatePost = () => {

    const [caption, setCaption] = useState("")
    const postImageInputFieldRef = useRef(null)
    const navigate = useNavigate();

    const { handleCreatePost, loading } = usePost();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const file = postImageInputFieldRef.current.files[0]

        await handleCreatePost(file, caption)

        navigate("/")

        postImageInputFieldRef.current.value = ""
        setCaption("")
    }

    if (loading) {
        return (
            <main>
                <h1>Creating Post...</h1>
            </main>
        )
    }

    return (
        <main className='create-post-page'>
            <div className="form-container">
                <h1>Create Post</h1>
                <form onSubmit={handleSubmit} >
                    <label className='post-image-label' htmlFor="postImage">Select Image</label>
                    <input ref={postImageInputFieldRef} type="file" name='postImage' id='postImage' hidden />
                    <input type="text" name='caption' id='caption' placeholder='Enter Caption' value={caption} onChange={(e) => setCaption(e.target.value)} />
                    <button className='button primary-button' type='submit'>Create Post</button>
                </form>
            </div>
        </main>
    )
}

export default CreatePost