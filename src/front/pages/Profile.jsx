import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const Profile = () => {
    const { store } = useGlobalReducer();
    const user = store.profile;

    // Tareas del usuario → filtramos tareas SIN clanId
    const personalTasks = store.tasks?.filter(t => !t.clanId) ?? [];

    // Gastos personales (placeholder hasta que los restauremos)
    const personalExpenses = store.personalExpenses ?? [];

    const totalPersonalExpenses = personalExpenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="container page-container">
            <div className="profile-container">
                
                {/* PERFIL */}
                <div className="profile-header text-center">
                    <img src={user.avatar} className="profile-avatar" alt="avatar" />
                    <h2 className="mt-3">{user.name}</h2>
                    <p className="text-muted">{user.email}</p>
                </div>

                {/* FINANZAS PERSONALES */}
                <div className="profile-section">
                    <h4>Bote Personal</h4>
                    <div className="balance-box text-center my-3">
                        <h1 className="display-5 text-info">{store.personalBote.toFixed(2)} €</h1>
                        <small className="text-muted">
                            Gastos: -{totalPersonalExpenses.toFixed(2)} €
                        </small>
                    </div>
                </div>

                {/* TAREAS PERSONALES */}
                <div className="profile-section">
                    <h4>Mis Tareas</h4>
                    <ul className="list-group list-group-flush mt-3">
                        {personalTasks.length > 0 ? (
                            personalTasks.map(task => (
                                <li key={task.id} className="list-group-item d-flex justify-content-between">
                                    <span>{task.title}</span>
                                    <span className={task.completed ? "text-success" : "text-warning"}>
                                        {task.completed ? "Completada" : "Pendiente"}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p className="text-muted text-center mt-2">
                                Aún no tienes tareas asignadas.
                            </p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};
