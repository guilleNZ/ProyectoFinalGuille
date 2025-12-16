// src/front/pages/Catalog.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
    productsData,
    getUniqueBrands,
    getUniqueCategories,
    getCatalogStats,
    searchProducts
} from "../data/products";

export const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [priceRange, setPriceRange] = useState(100000);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");

    // Obtener estadísticas
    const stats = getCatalogStats();

    useEffect(() => {
        // Inicializar con todos los productos
        setProducts(productsData);
        setFilteredProducts(productsData);
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [searchTerm, selectedBrand, priceRange, selectedCategory, sortBy]);

    const filterAndSortProducts = () => {
        let filtered = [...productsData];

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = searchProducts(searchTerm);
        }

        // Filtrar por marca
        if (selectedBrand !== "all") {
            filtered = filtered.filter(product => product.brand === selectedBrand);
        }

        // Filtrar por categoría
        if (selectedCategory !== "all") {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filtrar por precio
        filtered = filtered.filter(product => product.price <= priceRange);

        // Ordenar
        filtered = sortProducts(filtered, sortBy);

        setFilteredProducts(filtered);
    };

    const sortProducts = (productsToSort, sortOption) => {
        const sorted = [...productsToSort];

        switch (sortOption) {
            case "price-asc":
                return sorted.sort((a, b) => a.price - b.price);
            case "price-desc":
                return sorted.sort((a, b) => b.price - a.price);
            case "name-asc":
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case "stock-desc":
                return sorted.sort((a, b) => b.stock - a.stock);
            case "brand-asc":
                return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
            default:
                return sorted; // Orden por defecto (como están en el array)
        }
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedBrand("all");
        setSelectedCategory("all");
        setPriceRange(100000);
        setSortBy("default");
    };

    // Obtener opciones de filtro
    const brands = getUniqueBrands();
    const categories = getUniqueCategories();

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando catálogo...</p>
            </div>
        );
    }

    return (
        <div className="catalog-page">
            {/* Hero Section */}
            <div className="bg-dark text-white py-5 mb-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold mb-3">
                                Catálogo Exclusivo de Relojes de Lujo
                            </h1>
                            <p className="lead mb-4">
                                {stats.totalProducts} relojes únicos de {stats.totalBrands} marcas premium.
                                Desde ${stats.priceRange.min.toLocaleString()} hasta ${stats.priceRange.max.toLocaleString()}.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge bg-light text-dark">{stats.totalProducts} relojes</span>
                                <span className="badge bg-light text-dark">{stats.totalBrands} marcas</span>
                                <span className="badge bg-light text-dark">{categories.length - 1} categorías</span>
                                <span className="badge bg-light text-dark">{stats.totalStock} en stock</span>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="text-center">
                                <img
                                    src="https://i.pinimg.com/736x/19/30/e0/1930e019b89bd76f380673dc6573c34c.jpg"
                                    alt="Relojes de lujo"
                                    className="img-fluid rounded shadow"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Filtros */}
                <div className="card shadow-sm mb-5">
                    <div className="card-body">
                        <div className="row g-3">
                            {/* Búsqueda */}
                            <div className="col-md-12 mb-3">
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-dark text-white">
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar relojes por nombre, marca o modelo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filtros rápidos */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Marca</label>
                                <select
                                    className="form-select"
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                >
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>
                                            {brand === "all" ? "Todas las marcas" : brand}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Categoría</label>
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === "all" ? "Todas las categorías" : category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Ordenar por</label>
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="default">Por defecto</option>
                                    <option value="price-asc">Precio: Menor a Mayor</option>
                                    <option value="price-desc">Precio: Mayor a Menor</option>
                                    <option value="name-asc">Nombre A-Z</option>
                                    <option value="stock-desc">Más stock primero</option>
                                    <option value="brand-asc">Marca A-Z</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">
                                    Precio máximo: <span className="text-primary">${priceRange.toLocaleString()}</span>
                                </label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="1000"
                                    max="100000"
                                    step="1000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                />
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>$1,000</span>
                                    <span>$50,000</span>
                                    <span>$100,000</span>
                                </div>
                            </div>
                        </div>

                        {/* Botones de filtro rápido por marca */}
                        <div className="mt-4">
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <span className="fw-bold me-2">Marcas:</span>
                                {brands.filter(b => b !== "all").map(brand => (
                                    <button
                                        key={brand}
                                        className={`btn btn-sm ${selectedBrand === brand ? 'btn-dark' : 'btn-outline-dark'}`}
                                        onClick={() => setSelectedBrand(brand)}
                                    >
                                        {brand}
                                    </button>
                                ))}
                                <button
                                    className="btn btn-sm btn-outline-danger ms-auto"
                                    onClick={handleClearFilters}
                                >
                                    <i className="fas fa-times me-1"></i>
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="mb-0" style={{ color: '#1a1a1a' }}>
                            {filteredProducts.length} relojes encontrados
                        </h3>
                        <p className="text-muted mb-0">
                            {filteredProducts.length === productsData.length
                                ? "Mostrando todos los productos"
                                : `Filtros aplicados: ${selectedBrand !== "all" ? `${selectedBrand} • ` : ""}${selectedCategory !== "all" ? `${selectedCategory} • ` : ""}${priceRange < 100000 ? `Hasta $${priceRange.toLocaleString()} • ` : ""}${searchTerm ? `"${searchTerm}" • ` : ""}`
                            }
                        </p>
                    </div>

                    <div className="text-end">
                        <small className="text-muted">
                            Mostrando {Math.min(filteredProducts.length, 18)} de {filteredProducts.length} productos
                        </small>
                    </div>
                </div>

                {/* Productos */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-search fa-3x text-muted mb-3"></i>
                        <h3>No se encontraron productos</h3>
                        <p className="text-muted mb-4">Intenta con otros filtros o términos de búsqueda</p>
                        <button
                            className="btn btn-dark"
                            onClick={handleClearFilters}
                        >
                            <i className="fas fa-redo me-2"></i>
                            Mostrar todos los productos
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="col">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Paginación (simple) */}
                        {filteredProducts.length > 18 && (
                            <div className="mt-5 text-center">
                                <button className="btn btn-outline-dark">
                                    <i className="fas fa-arrow-down me-2"></i>
                                    Cargar más productos
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Información del catálogo */}
                <div className="mt-5 pt-5 border-top">
                    <div className="row">
                        <div className="col-md-6 mb-5">
                            <h4 className="mb-4">Sobre nuestra colección</h4>
                            <p className="text-muted">
                                Nuestro catálogo presenta una selección cuidadosamente curada de los relojes más icónicos y deseados del mundo.
                                Cada pieza es auténtica y viene con su certificado correspondiente.
                            </p>
                            <div className="row mt-4">
                                {brands.filter(b => b !== "all").map(brand => {
                                    const brandCount = productsData.filter(p => p.brand === brand).length;
                                    return (
                                        <div key={brand} className="col-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{ width: '40px', height: '40px' }}>
                                                    {brand.charAt(0)}
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">{brand}</h6>
                                                    <small className="text-muted">{brandCount} modelos</small>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-6 mb-5">
                            <h4 className="mb-4">Categorías disponibles</h4>
                            <div className="row">
                                {categories.filter(c => c !== "all").map(category => {
                                    const categoryCount = productsData.filter(p => p.category === category).length;
                                    const categoryProducts = productsData.filter(p => p.category === category);
                                    const avgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryCount;

                                    return (
                                        <div key={category} className="col-6 mb-3">
                                            <div className="card border h-100">
                                                <div className="card-body">
                                                    <h6 className="card-title">{category}</h6>
                                                    <p className="card-text text-muted small">
                                                        {categoryCount} modelo{categoryCount !== 1 ? 's' : ''}
                                                    </p>
                                                    <p className="card-text small">
                                                        Desde ${Math.min(...categoryProducts.map(p => p.price)).toLocaleString()}
                                                    </p>
                                                    <button
                                                        className="btn btn-sm btn-outline-dark w-100"
                                                        onClick={() => setSelectedCategory(category)}
                                                    >
                                                        Ver categoría
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};