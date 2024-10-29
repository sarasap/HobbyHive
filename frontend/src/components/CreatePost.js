import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

function CreatePost() {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('caption', caption);
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);

        try {
            await axiosInstance.post('/api/posts/create/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Post created successfully');
        } catch (error) {
            console.error(error);
            alert('Error creating post');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
            <button type="submit">Post</button>
        </form>
    );
}

export default CreatePost;
