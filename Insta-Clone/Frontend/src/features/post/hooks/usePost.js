import { useContext, useEffect } from "react";
import { PostContext } from "../post.context";
import { getFeed, likePost, unlikePost } from "../services/post.api";
import { createPost } from "../services/post.api";

export const usePost = () => {
    const context = useContext(PostContext);

    const { loading, setLoading, post, setPost, feed, setFeed } = context;

    const handlegetFeed = async () => {
        setLoading(true);
        const data = await getFeed();
        setFeed(data.posts.reverse());
        setLoading(false);
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true);
        const data = await createPost(imageFile, caption);
        setFeed([data.post, ...feed]);
        setLoading(false);
    }

    const handleLikePost = async (postId) => {

        const data = await likePost(postId);
        await handlegetFeed();

    }

    const handleUnlikePost = async (postId) => {

        const data = await unlikePost(postId);
        await handlegetFeed();

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