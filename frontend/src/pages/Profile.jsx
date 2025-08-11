import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        setProfile(data);
  setImageUrl(data.image || '');
  setNameInput(data.name || '');
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, []);


  // Handle name update
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    if (!nameInput.trim()) {
      setError('Name cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: nameInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update name');
      setProfile(data);
      setMessage('Name updated!');
      // Update user in context and localStorage
      setUser && setUser(prev => ({ ...prev, name: data.name }));
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        userData.name = data.name;
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle local image upload
  const handleImageFileChange = async (e) => {
    setMessage(''); setError('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }
    if (file.size > 50 * 1024) {
      setError('Image must be less than 50KB');
      return;
    }
    // Only check file size, not dimensions
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/profile/image`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ imageBase64: reader.result })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update image');
        setProfile(data);
        setImageUrl(data.image);
        setMessage('Profile image updated!');
        // Update user in context and localStorage
        setUser && setUser(prev => ({ ...prev, image: data.image }));
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          userData.image = data.image;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    if (!oldPassword || !newPassword) {
      setError('Both fields required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      setMessage('Password updated!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10 text-slate-800">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">{error}</div>}
      {message && <div className="bg-green-100 text-green-700 p-2 mb-2 rounded">{message}</div>}
      <div className="flex items-center mb-4">
        <img src={imageUrl || 'https://ui-avatars.com/api/?name=' + profile.name} alt="Profile" className="w-20 h-20 rounded-full object-cover mr-4" />
        <div>
          <div className="font-semibold">{profile.name}</div>
          <div className="text-gray-600">{profile.email}</div>
        </div>
      </div>
      <form onSubmit={handleNameUpdate} className="mb-6">
        <label className="block mb-1 font-medium">Change Name</label>
        <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className="border p-2 rounded w-full mb-2" placeholder="Enter new name..." />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Name</button>
      </form>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Upload Profile Image (150x150px, &lt;50KB)</label>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="border p-2 rounded w-full mb-2" />
      </div>
      <form onSubmit={handleChangePassword} className="mb-6">
        <label className="block mb-1 font-medium">Change Password</label>
        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="border p-2 rounded w-full mb-2" placeholder="Old password" />
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="border p-2 rounded w-full mb-2" placeholder="New password" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Change Password</button>
      </form>
      <button onClick={logout} className="bg-gray-400 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default Profile;
