import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const resp = await fetch('/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                setUser(data);
                setEmail(data.email);
            } else {
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const resp = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });
        if (resp.ok) {
            alert('Profile updated successfully');
        } else {
            const error = await resp.json();
            alert(error.msg);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const resp = await fetch('/api/profile', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.ok) {
            localStorage.removeItem('token');
            navigate('/signup');
        } else {
            const error = await resp.json();
            alert(error.msg);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>Profile</h2>
            <p>Email: {user.email}</p>
            <form onSubmit={handleUpdate}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Update Email</button>
            </form>
            <button onClick={handleDelete}>Delete Account</button>
        </div>
    );
};

export default Profile;
