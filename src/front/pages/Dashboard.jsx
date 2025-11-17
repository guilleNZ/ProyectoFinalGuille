import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";

const TaskListItem = ({ task, onToggle, onDelete }) => (
    <li className="list-group-item d-flex justify-content-between align-items-center task-list-item"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
        <span
            className={`task-text ${task.completed ? 'completed' : ''}`}
            onClick={() => onToggle(task.id)}
            style={{ cursor: "pointer", color: task.completed ? '#888' : '#333' }}
        >
            {task.title}
        </span>
        <div>
            <i
                className={`fas ${task.completed ? 'fa-check-square text-success' : 'fa-square'}`}
                onClick={() => onToggle(task.id)}
                style={{ cursor: "pointer" }}
            ></i>
            <i
                className="fas fa-trash text-danger ms-2"
                onClick={() => onDelete(task.id)}
                style={{ cursor: "pointer" }}
            ></i>
        </div>
    </li>
);

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskType, setTaskType] = useState("user");
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Tareas personales = tasks sin clanId
    const pendingUserTasks = store.tasks.filter(t => !t.clanId && !t.completed);

    // Clan activo
    const activeClan = store.clans.find(c => c.id === store.activeClanId);

    // Tareas de clan activas
    const activeClanTasks = store.tasks.filter(
        t => t.clanId === store.activeClanId && !t.completed
    );

    // Total completadas
    const completedTaskCount = store.tasks.filter(t => t.completed).length;

    // Finanzas placeholder
    const totalExpenses = 0;

    const openTaskModal = (type) => {
        setTaskType(type);
        setShowTaskModal(true);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        if (taskType === "user") {
            dispatch({ type: 'add_task', payload: { title: newTaskTitle } });
        } else {
            dispatch({ type: 'ADD_TASK_TO_CLAN', payload: { title: newTaskTitle } });
        }

        setNewTaskTitle("");
        setShowTaskModal(false);
    };

    const toggleUserTask = (taskId) =>
        dispatch({ type: 'add_task', payload: { id: taskId, color: "#ccc" } });

    const deleteUserTask = (taskId) =>
        dispatch({ type: 'DELETE_CLAN_TASK', payload: { taskId } });

    const toggleClanTask = (taskId) =>
        dispatch({ type: 'TOGGLE_CLAN_TASK', payload: { taskId } });

    const deleteClanTask = (taskId) =>
        dispatch({ type: 'DELETE_CLAN_TASK', payload: { taskId } });

    const [inviteEmail, setInviteEmail] = useState("");
    const [projectLink] = useState("https://taskflowapp.com/project/12345");

    return (
        <div className="dashboard-container">
            {(showInviteModal || showTaskModal) && (
                <div className="modal-backdrop fade show"></div>
            )}

            {/* SIDEBAR */}
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="logo">TASKFLOW</Link>
                </div>
                <div className="user-profile-summary"
                    onClick={() => navigate("/profile")}
                    style={{ cursor: 'pointer' }}>
                    <img src={store.profile.avatar} alt="User Avatar" className="user-avatar" />
                    <span className="username">{store.profile.name}</span>
                    <span className="user-email">{store.profile.email}</span>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/dashboard" className="active"><i className="fas fa-desktop me-2"></i>Escritorio</Link></li>
                        <li><Link to="/tasks"><i className="fas fa-tasks me-2"></i>Tus Tareas</Link></li>
                        <li><Link to="/groups"><i className="fas fa-users me-2"></i>Tus Clanes</Link></li>
                        <li><Link to="/shared-tasks"><i className="fas fa-share-alt me-2"></i>Tareas Compartidas</Link></li>
                        <li><Link to="/finances"><i className="fas fa-wallet me-2"></i>Finanzas</Link></li>
                        <li><Link to="/profile"><i className="fas fa-user-circle me-2"></i>Tu Perfil</Link></li>
                        <li><Link to="/config"><i className="fas fa-cog me-2"></i>Configuración</Link></li>
                    </ul>
                </nav>
            </div>

            {/* MAIN CONTENT */}
            <div className="dashboard-main-content">
                <header className="dashboard-navbar">
                    <div className="search-bar">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Buscar entre lista de tareas..." />
                    </div>
                </header>

                <div className="dashboard-content-area page-container">
                    <div className="welcome-section">
                        <h2>Bienvenido de nuevo '{store.profile.name}'</h2>
                        <button className="btn btn-invite-user" onClick={() => setShowInviteModal(true)}>
                            <i className="fas fa-user-plus me-2"></i>Invitar
                        </button>
                    </div>

                    <div className="row g-4 dashboard-cards">

                        {/* TAREAS PERSONALES */}
                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tus Tareas Pendientes</h3>
                                    <button className="btn btn-sm btn-icon-only"
                                        onClick={() => openTaskModal('user')}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                <ul className="list-group list-group-flush task-list">
                                    {pendingUserTasks.length > 0 ? (
                                        pendingUserTasks.map(task => (
                                            <TaskListItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleUserTask}
                                                onDelete={deleteUserTask}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">No hay tareas pendientes.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* FINANZAS */}
                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <h3 className="mb-0">Resumen Financiero</h3>
                                <div className="row">
                                    <div className="col-md-6 text-center border-end">
                                        <h4 className="text-muted">Saldo del Bote</h4>
                                        <div className="my-3">
                                            <i className="fas fa-coins fa-3x mb-2" style={{ color: '#FFD700' }}></i>
                                            <h2 className="display-4 fw-bold text-info">
                                                {store.personalBote.toFixed(2)}€
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="col-md-6 text-center">
                                        <h4 className="text-muted">Gastos del Mes</h4>
                                        <div className="my-3">
                                            <i className="fas fa-chart-line fa-3x mb-2 text-danger"></i>
                                            <h2 className="display-4 fw-bold text-danger">
                                                {totalExpenses.toFixed(2)}€
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAREAS CLAN */}
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tareas de Clanes</h3>
                                    <button className="btn btn-sm btn-icon-only"
                                        onClick={() => openTaskModal('clan')}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                {activeClan &&
                                    <p className="text-muted" style={{ marginTop: '-10px' }}>
                                        Para: <strong>{activeClan.name}</strong>
                                    </p>}

                                <ul className="list-group list-group-flush task-list">
                                    {activeClanTasks.length > 0 ? (
                                        activeClanTasks.map(task => (
                                            <TaskListItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleClanTask}
                                                onDelete={deleteClanTask}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">
                                            No hay tareas de clan.
                                        </p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* RESUMEN COMPLETADAS */}
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <h3>Tareas Completadas (Total)</h3>
                                <div className="text-center my-4">
                                    <h1 className="display-3"
                                        style={{ color: '#28a745', fontWeight: 'bold' }}>
                                        {completedTaskCount}
                                    </h1>
                                    <p className="text-muted">¡Sigue así!</p>
                                </div>
                            </div>
                        </div>

                        {/* MENSAJES */}
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card text-center">
                                <h3>Mensajes</h3>
                                <h1 className="display-1 my-4 text-info">
                                    <i className="fas fa-comment-dots"></i>
                                </h1>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
