import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

function ListPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axiosInstance.get('/api/posts/list/');
            setPosts(response.data);
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            await axiosInstance.post(`/api/posts/${postId}/like/`);
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, like_count: post.like_count + 1 } : post
            ));
        } catch (error) {
            console.error('Error liking post', error);
        }
    };

    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <p>{post.caption}</p>
                    {post.image && <img src={post.image} alt="Post media" />}
                    {post.video && <video src={post.video} controls />}
                    <button onClick={() => handleLike(post.id)}>
                        Like ({post.like_count})
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ListPosts;
