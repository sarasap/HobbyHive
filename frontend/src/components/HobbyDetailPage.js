import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import "./HobbyDetailPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./Layout";

function HobbyDetailPage({ setIsAuth }) {
  const { hobbyName } = useParams();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHobbyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/hobbies/${hobbyName}/`);
        setPosts(response.data.posts);
        setUsers(response.data.users);
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching hobby details:", error);
      }
    };
    fetchHobbyDetails();
  }, [hobbyName]);

  return (
    <Layout setIsAuth={setIsAuth}>
      {/* Main Container */}
      <div className="container hobby-detail-page mt-3">
        {/* Heading Section */}
        <div className="row mb-3">
          <div className="col-12 text-center">
            <h1 className="display-4">{hobbyName.charAt(0).toUpperCase() + hobbyName.slice(1)}</h1>
          </div>
        </div>

        {/* Headers on the Same Line */}
        <div className="row align-items-center mb-3">
          <div className="col-md-3 text-start">
            <h2 className="h5 mb-0">Upcoming Events for {hobbyName}</h2>
          </div>
          <div className="col-md-6 text-center">
            <h2 className="h5 mb-0">Posts</h2>
          </div>
          <div className="col-md-3 text-start users-heading">
            <h2 className="h5 mb-0">Users in {hobbyName}</h2>
          </div>
        </div>

        {/* Content Sections */}
        <div className="row">
          {/* Events Section */}
          <div className="col-md-3 events-section border-end">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="card mb-3" onClick={() => navigate(`/events`)}>
                  <div className="card-body">
                    <h3 className="card-title">{event.title}</h3>
                    <p className="card-text">
                      <strong>Date:</strong> {event.date}
                      <br />
                      <strong>Time:</strong> {event.time}
                      <br />
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p className="card-text">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No events available.</p>
            )}
          </div>

          {/* Posts Section */}
          {/* Posts Section */}
          <div className="col-md-6 posts-section border-end border-start">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="card mb-3">
                  {post.media_url && (
                    <img src={post.media_url} alt="Post" className="card-img-top" />
                  )}
                  <div className="card-body">
                    <p className="card-text">{post.caption}</p>
                    <p className="text-muted">
                      <strong>By:</strong> {post.user ? post.user : "Unknown"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">No posts available.</p>
            )}
          </div>


          {/* Users Section */}
          <div className="col-md-3 users-section">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="card mb-2">
                  <div className="card-body text-center">
                    <p className="card-text">{user.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">No users available.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HobbyDetailPage;
