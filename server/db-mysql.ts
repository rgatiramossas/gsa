import mysql from 'mysql2/promise';

// Configurar as credenciais do banco de dados MySQL
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const mysqlConnection = connection;

// Função para verificar a conexão com o banco de dados
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const [rows] = await connection.query('SELECT 1 as connected');
    console.log('MySQL connection is successful!');
    return true;
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    return false;
  }
}

// Função para criar as tabelas necessárias no banco de dados MySQL
export async function setupDatabase(): Promise<void> {
  try {
    // Verificar se as tabelas já existem
    const [tables] = await connection.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'users'
    `, [process.env.MYSQL_DATABASE]);
    
    // @ts-ignore
    if (tables.length > 0) {
      console.log('Database tables already exist. Skipping setup.');
      return;
    }
    
    // Criar tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role ENUM('admin', 'technician', 'manager') NOT NULL
      )
    `);
    
    // Criar tabela de clientes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criar tabela de veículos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        plate VARCHAR(50),
        chassis VARCHAR(100),
        color VARCHAR(50),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
    
    // Criar tabela de serviços
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        vehicle_id INT,
        vehicle_name VARCHAR(255) NOT NULL,
        vehicle_plate VARCHAR(50),
        vehicle_chassis VARCHAR(100),
        date DATETIME NOT NULL,
        technician_id INT NOT NULL,
        technician_name VARCHAR(255) NOT NULL,
        service_type ENUM('street_dent', 'hail', 'other') NOT NULL,
        service_value INT NOT NULL,
        administrative_value INT,
        status ENUM('pending', 'in_progress', 'completed') NOT NULL,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
      )
    `);
    
    // Criar tabela de orçamentos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        vehicle_id INT,
        vehicle_name VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        estimated_value INT NOT NULL,
        description TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}