import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{token ? (
						<>
							<Link to="/profile" className="btn btn-primary me-2">Profile</Link>
							<button onClick={handleLogout} className="btn btn-primary">Logout</button>
						</>
					) : (
						<>
							<Link to="/signup" className="btn btn-primary me-2">Signup</Link>
							<Link to="/login" className="btn btn-primary me-2">Login</Link>
						</>
					)}
					<Link to="/demo">
						<button className="btn btn-primary ms-2">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};