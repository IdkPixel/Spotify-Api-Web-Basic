Aplicación web para gestionar música, construida con React y Node.js, con backend en MySQL y soporte para usuarios y canciones.



Base de datos:


CREATE DATABASE IF NOT EXISTS task_app;

USE task_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
