import React, { useEffect } from 'react'
import '../styles/feed.scss'
import Post from '../components/Post'
import { usePost } from '../hooks/usePost'
import Nav from '../../shared/components/Nav'

const Feed = () => {
    const { loading, feed, handlegetFeed, handleLikePost, handleUnlikePost } = usePost();

    useEffect(() => {
        handlegetFeed();
    }, []);

    if (loading) {
        return (
            <main>
                <h1>Feed is Loading...</h1>
            </main>
        )
    }

    return (
        <main className='feed-page'>
            <Nav />
            <div className="feed">
                <div className="posts">
                    {
                        feed.map((post) => {
                            return (
                                <Post key={post._id} user={post.user} post={post} loading={loading} handleLikePost={handleLikePost} handleUnlikePost={handleUnlikePost} />
                            )
                        })
                    }
                </div>
            </div>
        </main>
    )
}

export default Feed 