import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";

export const Finances = () => {
    const { store } = useGlobalReducer();
    const activeClanId = store.activeClanId;

    // Bote Personal
    const personalBote = store.personalBote ?? 0.00;

    // Por ahora NO tenemos estos en el store — ponemos placeholder seguro
    const personalExpenses = [];
    const activeExpenses = [];
    const activeBalances = [];
    const currentBote = 0.00;

    // Estados formularios
    const [personalConcept, setPersonalConcept] = useState("");
    const [personalAmount, setPersonalAmount] = useState("");

    const [clanConcept, setClanConcept] = useState("");
    const [clanAmount, setClanAmount] = useState("");

    const [showBoteModal, setShowBoteModal] = useState(false);
    const [boteAmount, setBoteAmount] = useState("");

    return (
        <div className="container page-container">

            {/* MODAL PARA BOTE DEL CLAN */}
            {showBoteModal && (
                <>
                    <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal-content-dark">
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Añadir fondos al Bote Común</h5>
                                        <button type="button" className="btn-close btn-close-white"
                                            onClick={() => setShowBoteModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Importe (€)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                className="form-control"
                                                value={boteAmount}
                                                onChange={(e) => setBoteAmount(e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowBoteModal(false)}>
                                            Cerrar
                                        </button>
                                        <button type="submit"
                                            className="btn btn-custom-blue" disabled>
                                            Próximamente
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {/* FINANZAS PERSONALES */}
            <div className="main-box mb-4">
                <h2 className="mb-4">Tus Finanzas Personales</h2>

                <div className="row g-4">
                    <div className="col-lg-5">
                        <div className="detail-box text-center">
                            <h4>Bote Personal</h4>
                            <h1 className="display-3 fw-bold my-3 text-info">
                                {personalBote.toFixed(2)} €
                            </h1>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="detail-box">
                            <h4><i className="fas fa-receipt me-2"></i> Añadir Gasto Personal</h4>

                            <form onSubmit={(e) => e.preventDefault()} className="mt-3">
                                <div className="mb-3">
                                    <label className="form-label">Concepto</label>
                                    <input type="text" className="form-control"
                                        value={personalConcept}
                                        onChange={(e) => setPersonalConcept(e.target.value)}
                                        placeholder="Ej: Café" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Importe (€)</label>
                                    <input type="number" className="form-control" step="1"
                                        value={personalAmount}
                                        onChange={(e) => setPersonalAmount(e.target.value)}
                                        placeholder="0" />
                                </div>

                                <button type="submit" className="btn btn-custom-purple w-100" disabled>
                                    Próximamente
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="detail-box">
                            <h4>Historial de Gastos Personales</h4>
                            <p className="text-muted text-center mt-3">
                                Función pendiente de restaurar 🔧
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FINANZAS CLAN — SOLO SI HAY CLAN SELECCIONADO */}
            {!activeClanId ? (
                <div className="main-box text-center">
                    <p className="lead text-muted mt-4">
                        Selecciona un clan en <strong>Grupos</strong> para ver sus finanzas 💰
                    </p>
                </div>
            ) : (
                <div className="main-box">
                    <h2 className="mb-4">Finanzas: {store.clans.find(c => c.id === activeClanId)?.name}</h2>

                    <div className="row g-4">

                        <div className="col-lg-5">
                            <div className="detail-box text-center">
                                <h4>Bote Común</h4>
                                <h1 className="display-3 fw-bold my-3 text-info">
                                    {currentBote.toFixed(2)} €
                                </h1>
                                <button className="btn btn-custom-blue"
                                    onClick={() => setShowBoteModal(true)}>
                                    <i className="fas fa-plus me-2"></i> Añadir fondos
                                </button>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="detail-box">
                                <h4><i className="fas fa-shopping-cart me-2"></i> Añadir Gasto del Clan</h4>

                                <form onSubmit={(e) => e.preventDefault()} className="mt-3">
                                    <div className="mb-3">
                                        <label className="form-label">Concepto</label>
                                        <input type="text" className="form-control"
                                            value={clanConcept} onChange={(e) => setClanConcept(e.target.value)}
                                            placeholder="Ej: Pizzas" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Importe (€)</label>
                                        <input type="number" className="form-control" step="1"
                                            value={clanAmount} onChange={(e) => setClanAmount(e.target.value)}
                                            placeholder="0" />
                                    </div>

                                    <button type="submit" className="btn btn-custom-purple w-100" disabled>
                                        Próximamente
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="detail-box">
                                <h4>Historial del Clan</h4>
                                <p className="text-muted text-center mt-3">
                                    Función pendiente de restaurar 🔧
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="detail-box">
                                <h4>Balance entre miembros</h4>
                                <p className="text-muted text-center mt-3">
                                    Función pendiente de restaurar 🔧
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
