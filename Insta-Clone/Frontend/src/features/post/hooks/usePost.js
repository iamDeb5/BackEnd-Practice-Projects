import { useContext, useEffect } from "react";
import { PostContext } from "../post.context";
import { getFeed, likePost, unlikePost } from "../services/post.api";
import { createPost } from "../services/post.api";

export const usePost = () => {
    const context = useContext(PostContext);

    const { loading, setLoading, post, setPost, feed, setFeed } = context;

    const handlegetFeed = async () => {
        try {
            setLoading(true);
            const data = await getFeed();
            setFeed(data.posts.reverse());
        } catch (error) {
            console.error("Failed to fetch feed:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreatePost = async (imageFile, caption) => {
        try {
            setLoading(true);
            const data = await createPost(imageFile, caption);
            setFeed([data.post, ...feed]);
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleLikePost = async (postId) => {
        try {
            const data = await likePost(postId);
            await handlegetFeed();
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    }

    const handleUnlikePost = async (postId) => {
        try {
            const data = await unlikePost(postId);
            await handlegetFeed();
        } catch (error) {
            console.error("Failed to unlike post:", error);
        }
    }

    useEffect(() => {
        handlegetFeed();
    }, [])

    return {
        loading,
        post,
        feed,
        handlegetFeed,
        handleCreatePost,
        handleLikePost,
        handleUnlikePost,
    }
}