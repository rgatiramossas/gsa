import { 
  User, InsertUser,
  Client, InsertClient,
  Vehicle, InsertVehicle,
  Service, InsertService,
  Budget, InsertBudget
} from "@shared/schema";
import { mysqlConnection } from "./db-mysql";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { IStorage } from "./storage";

// Implementação do armazenamento usando MySQL
export class MySQLStorage implements IStorage {
  // Operações de usuário
  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return undefined;
    }
    
    const user = rows[0] as any;
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "technician" | "manager"
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return undefined;
    }
    
    const user = rows[0] as any;
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      role: user.role as "admin" | "technician" | "manager"
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)',
      [
        insertUser.username,
        insertUser.password,
        insertUser.name,
        insertUser.email,
        insertUser.role
      ]
    );
    
    return {
      id: result.insertId,
      ...insertUser
    };
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    // Construir query dinâmica com base nos campos fornecidos
    const fields: string[] = [];
    const values: any[] = [];
    
    if (userData.username !== undefined) {
      fields.push('username = ?');
      values.push(userData.username);
    }
    
    if (userData.password !== undefined) {
      fields.push('password = ?');
      values.push(userData.password);
    }
    
    if (userData.name !== undefined) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    
    if (userData.role !== undefined) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    
    if (fields.length === 0) {
      return this.getUser(id); // Nada para atualizar
    }
    
    // Adicionar o ID no final dos valores
    values.push(id);
    
    await mysqlConnection.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getUser(id);
  }

  // Operações de cliente
  async getClient(id: number): Promise<Client | undefined> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM clients WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return undefined;
    }
    
    const client = rows[0] as any;
    return {
      id: client.id,
      name: client.name,
      location: client.location,
      email: client.email,
      phone: client.phone,
      createdAt: new Date(client.created_at)
    };
  }

  async getClients(): Promise<Client[]> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM clients ORDER BY name'
    );
    
    return (rows as any[]).map(client => ({
      id: client.id,
      name: client.name,
      location: client.location,
      email: client.email,
      phone: client.phone,
      createdAt: new Date(client.created_at)
    }));
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO clients (name, location, email, phone) VALUES (?, ?, ?, ?)',
      [
        client.name,
        client.location,
        client.email || null,
        client.phone || null
      ]
    );
    
    const now = new Date();
    
    return {
      id: result.insertId,
      ...client,
      email: client.email || null,
      phone: client.phone || null,
      createdAt: now
    };
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    // Construir query dinâmica com base nos campos fornecidos
    const fields: string[] = [];
    const values: any[] = [];
    
    if (clientData.name !== undefined) {
      fields.push('name = ?');
      values.push(clientData.name);
    }
    
    if (clientData.location !== undefined) {
      fields.push('location = ?');
      values.push(clientData.location);
    }
    
    if (clientData.email !== undefined) {
      fields.push('email = ?');
      values.push(clientData.email);
    }
    
    if (clientData.phone !== undefined) {
      fields.push('phone = ?');
      values.push(clientData.phone);
    }
    
    if (fields.length === 0) {
      return this.getClient(id); // Nada para atualizar
    }
    
    // Adicionar o ID no final dos valores
    values.push(id);
    
    await mysqlConnection.query(
      `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getClient(id);
  }

  async deleteClient(id: number): Promise<boolean> {
    const [result] = await mysqlConnection.query<ResultSetHeader>(
      'DELETE FROM clients WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  // Operações de veículo
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM vehicles WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return undefined;
    }
    
    const vehicle = rows[0] as any;
    return {
      id: vehicle.id,
      clientId: vehicle.client_id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      chassis: vehicle.chassis,
      color: vehicle.color
    };
  }

  async getVehiclesByClient(clientId: number): Promise<Vehicle[]> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM vehicles WHERE client_id = ?',
      [clientId]
    );
    
    return (rows as any[]).map(vehicle => ({
      id: vehicle.id,
      clientId: vehicle.client_id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      chassis: vehicle.chassis,
      color: vehicle.color
    }));
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO vehicles (client_id, brand, model, plate, chassis, color) VALUES (?, ?, ?, ?, ?, ?)',
      [
        vehicle.clientId,
        vehicle.brand,
        vehicle.model,
        vehicle.plate || null,
        vehicle.chassis || null,
        vehicle.color || null
      ]
    );
    
    return {
      id: result.insertId,
      ...vehicle,
      plate: vehicle.plate || null,
      chassis: vehicle.chassis || null,
      color: vehicle.color || null
    };
  }

  async updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    // Construir query dinâmica com base nos campos fornecidos
    const fields: string[] = [];
    const values: any[] = [];
    
    if (vehicleData.clientId !== undefined) {
      fields.push('client_id = ?');
      values.push(vehicleData.clientId);
    }
    
    if (vehicleData.brand !== undefined) {
      fields.push('brand = ?');
      values.push(vehicleData.brand);
    }
    
    if (vehicleData.model !== undefined) {
      fields.push('model = ?');
      values.push(vehicleData.model);
    }
    
    if (vehicleData.plate !== undefined) {
      fields.push('plate = ?');
      values.push(vehicleData.plate);
    }
    
    if (vehicleData.chassis !== undefined) {
      fields.push('chassis = ?');
      values.push(vehicleData.chassis);
    }
    
    if (vehicleData.color !== undefined) {
      fields.push('color = ?');
      values.push(vehicleData.color);
    }
    
    if (fields.length === 0) {
      return this.getVehicle(id); // Nada para atualizar
    }
    
    // Adicionar o ID no final dos valores
    values.push(id);
    
    await mysqlConnection.query(
      `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getVehicle(id);
  }

  async deleteVehicle(id: number): Promise<boolean> {
    const [result] = await mysqlConnection.query<ResultSetHeader>(
      'DELETE FROM vehicles WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  // Operações de serviço
  async getService(id: number): Promise<Service | undefined> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return undefined;
    }
    
    const service = rows[0] as any;
    return {
      id: service.id,
      clientId: service.client_id,
      vehicleId: service.vehicle_id,
      vehicleName: service.vehicle_name,
      vehiclePlate: service.vehicle_plate,
      vehicleChassis: service.vehicle_chassis,
      date: new Date(service.date),
      technicianId: service.technician_id,
      technicianName: service.technician_name,
      serviceType: service.service_type as "street_dent" | "hail" | "other",
      serviceValue: service.service_value,
      administrativeValue: service.administrative_value,
      status: service.status as "pending" | "in_progress" | "completed",
      images: service.images ? JSON.parse(service.images) : [],
      createdAt: new Date(service.created_at)
    };
  }

  async getServices(): Promise<Service[]> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM services ORDER BY date DESC'
    );
    
    return (rows as any[]).map(service => ({
      id: service.id,
      clientId: service.client_id,
      vehicleId: service.vehicle_id,
      vehicleName: service.vehicle_name,
      vehiclePlate: service.vehicle_plate,
      vehicleChassis: service.vehicle_chassis,
      date: new Date(service.date),
      technicianId: service.technician_id,
      technicianName: service.technician_name,
      serviceType: service.service_type as "street_dent" | "hail" | "other",
      serviceValue: service.service_value,
      administrativeValue: service.administrative_value,
      status: service.status as "pending" | "in_progress" | "completed",
      images: service.images ? JSON.parse(service.images) : [],
      createdAt: new Date(service.created_at)
    }));
  }

  async getServicesByClient(clientId: number): Promise<Service[]> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM services WHERE client_id = ? ORDER BY date DESC',
      [clientId]
    );
    
    return (rows as any[]).map(service => ({
      id: service.id,
      clientId: service.client_id,
      vehicleId: service.vehicle_id,
      vehicleName: service.vehicle_name,
      vehiclePlate: service.vehicle_plate,
      vehicleChassis: service.vehicle_chassis,
      date: new Date(service.date),
      technicianId: service.technician_id,
      technicianName: service.technician_name,
      serviceType: service.service_type as "street_dent" | "hail" | "other",
      serviceValue: service.service_value,
      administrativeValue: service.administrative_value,
      status: service.status as "pending" | "in_progress" | "completed",
      images: service.images ? JSON.parse(service.images) : [],
      createdAt: new Date(service.created_at)
    }));
  }

  async getServicesByTechnician(technicianId: number): Promise<Service[]> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM services WHERE technician_id = ? ORDER BY date DESC',
      [technicianId]
    );
    
    return (rows as any[]).map(service => ({
      id: service.id,
      clientId: service.client_id,
      vehicleId: service.vehicle_id,
      vehicleName: service.vehicle_name,
      vehiclePlate: service.vehicle_plate,
      vehicleChassis: service.vehicle_chassis,
      date: new Date(service.date),
      technicianId: service.technician_id,
      technicianName: service.technician_name,
      serviceType: service.service_type as "street_dent" | "hail" | "other",
      serviceValue: service.service_value,
      administrativeValue: service.administrative_value,
      status: service.status as "pending" | "in_progress" | "completed",
      images: service.images ? JSON.parse(service.images) : [],
      createdAt: new Date(service.created_at)
    }));
  }

  async createService(service: InsertService): Promise<Service> {
    const [result] = await mysqlConnection.query<ResultSetHeader>(
      `INSERT INTO services (
        client_id, vehicle_id, vehicle_name, vehicle_plate, vehicle_chassis,
        date, technician_id, technician_name, service_type, service_value,
        administrative_value, status, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        service.clientId,
        service.vehicleId || null,
        service.vehicleName,
        service.vehiclePlate || null,
        service.vehicleChassis || null,
        service.date,
        service.technicianId,
        service.technicianName,
        service.serviceType,
        service.serviceValue,
        service.administrativeValue || null,
        service.status,
        JSON.stringify(service.images || [])
      ]
    );
    
    const now = new Date();
    
    return {
      id: result.insertId,
      ...service,
      vehicleId: service.vehicleId || null,
      vehiclePlate: service.vehiclePlate || null,
      vehicleChassis: service.vehicleChassis || null,
      administrativeValue: service.administrativeValue || null,
      images: service.images || [],
      createdAt: now
    };
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    // Construir query dinâmica com base nos campos fornecidos
    const fields: string[] = [];
    const values: any[] = [];
    
    if (serviceData.clientId !== undefined) {
      fields.push('client_id = ?');
      values.push(serviceData.clientId);
    }
    
    if (serviceData.vehicleId !== undefined) {
      fields.push('vehicle_id = ?');
      values.push(serviceData.vehicleId);
    }
    
    if (serviceData.vehicleName !== undefined) {
      fields.push('vehicle_name = ?');
      values.push(serviceData.vehicleName);
    }
    
    if (serviceData.vehiclePlate !== undefined) {
      fields.push('vehicle_plate = ?');
      values.push(serviceData.vehiclePlate);
    }
    
    if (serviceData.vehicleChassis !== undefined) {
      fields.push('vehicle_chassis = ?');
      values.push(serviceData.vehicleChassis);
    }
    
    if (serviceData.date !== undefined) {
      fields.push('date = ?');
      values.push(serviceData.date);
    }
    
    if (serviceData.technicianId !== undefined) {
      fields.push('technician_id = ?');
      values.push(serviceData.technicianId);
    }
    
    if (serviceData.technicianName !== undefined) {
      fields.push('technician_name = ?');
      values.push(serviceData.technicianName);
    }
    
    if (serviceData.serviceType !== undefined) {
      fields.push('service_type = ?');
      values.push(serviceData.serviceType);
    }
    
    if (serviceData.serviceValue !== undefined) {
      fields.push('service_value = ?');
      values.push(serviceData.serviceValue);
    }
    
    if (serviceData.administrativeValue !== undefined) {
      fields.push('administrative_value = ?');
      values.push(serviceData.administrativeValue);
    }
    
    if (serviceData.status !== undefined) {
      fields.push('status = ?');
      values.push(serviceData.status);
    }
    
    if (serviceData.images !== undefined) {
      fields.push('images = ?');
      values.push(JSON.stringify(serviceData.images));
    }
    
    if (fields.length === 0) {
      return this.getService(id); // Nada para atualizar
    }
    
    // Adicionar o ID no final dos valores
    values.push(id);
    
    await mysqlConnection.query(
      `UPDATE services SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getService(id);
  }

  async deleteService(id: number): Promise<boolean> {
    const [result] = await mysqlConnection.query<ResultSetHeader>(
      'DELETE FROM services WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  // Dados do dashboard
  async getDashboardStats(): Promise<{
    pendingServices: number;
    inProgressServices: number;
    completedServices: number;
    totalRevenue: number;
  }> {
    // Obter contagem de serviços por status
    const [statusCounts] = await mysqlConnection.query<RowDataPacket[]>(`
      SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        SUM(CASE WHEN status = 'completed' THEN service_value ELSE 0 END) as total_revenue
      FROM services
    `);
    
    const stats = statusCounts[0] as any;
    
    return {
      pendingServices: stats.pending_count || 0,
      inProgressServices: stats.in_progress_count || 0,
      completedServices: stats.completed_count || 0,
      totalRevenue: stats.total_revenue || 0
    };
  }

  async getRecentServices(limit: number): Promise<Service[]> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
      'SELECT * FROM services ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    
    return (rows as any[]).map(service => ({
      id: service.id,
      clientId: service.client_id,
      vehicleId: service.vehicle_id,
      vehicleName: service.vehicle_name,
      vehiclePlate: service.vehicle_plate,
      vehicleChassis: service.vehicle_chassis,
      date: new Date(service.date),
      technicianId: service.technician_id,
      technicianName: service.technician_name,
      serviceType: service.service_type as "street_dent" | "hail" | "other",
      serviceValue: service.service_value,
      administrativeValue: service.administrative_value,
      status: service.status as "pending" | "in_progress" | "completed",
      images: service.images ? JSON.parse(service.images) : [],
      createdAt: new Date(service.created_at)
    }));
  }

  // Função para inserir dados de exemplo
  async seedSampleData(): Promise<void> {
    // Verificar se já existem usuários no banco de dados
    const [users] = await mysqlConnection.query<RowDataPacket[]>('SELECT * FROM users');
    
    if (users.length > 0) {
      console.log('Banco de dados já possui dados. Pulando a etapa de criação de dados de exemplo.');
      return;
    }
    
    console.log('Inserindo dados de exemplo no banco de dados MySQL...');
    
    // Criar usuário admin
    const [adminResult] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)',
      ['admin', 'admin123', 'Alessandro Figueiredo', 'admin@example.com', 'admin']
    );
    
    const adminId = adminResult.insertId;
    
    // Criar clientes
    const [client1Result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO clients (name, location, email, phone) VALUES (?, ?, ?, ?)',
      ['FORD - Waldshut', 'Waldshut-Tingen', 'contact@ford-waldshut.com', '+49123456789']
    );
    
    const [client2Result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO clients (name, location, email, phone) VALUES (?, ?, ?, ?)',
      ['Lackierzentrum', 'Lorrach', null, null]
    );
    
    const client1Id = client1Result.insertId;
    const client2Id = client2Result.insertId;
    
    // Criar veículos
    const [vehicle1Result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO vehicles (client_id, brand, model, plate, chassis, color) VALUES (?, ?, ?, ?, ?, ?)',
      [client1Id, 'TESTE', 'TESET', '1111', null, null]
    );
    
    const [vehicle2Result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO vehicles (client_id, brand, model, plate, chassis, color) VALUES (?, ?, ?, ?, ?, ?)',
      [client1Id, 'HONDA', 'Marea', 'ed111111', null, null]
    );
    
    const [vehicle3Result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO vehicles (client_id, brand, model, plate, chassis, color) VALUES (?, ?, ?, ?, ?, ?)',
      [client1Id, 'teste', 'teste', '1111', null, null]
    );
    
    const [vehicle4Result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO vehicles (client_id, brand, model, plate, chassis, color) VALUES (?, ?, ?, ?, ?, ?)',
      [client2Id, 'Exemplo teste', 'Teste', 'Teste', null, null]
    );
    
    const [vehicle5Result] = await mysqlConnection.query<ResultSetHeader>(
      'INSERT INTO vehicles (client_id, brand, model, plate, chassis, color) VALUES (?, ?, ?, ?, ?, ?)',
      [client2Id, 'Kia', 'Kia', 'LÖT711', null, null]
    );
    
    // Criar serviços
    await mysqlConnection.query(
      `INSERT INTO services (
        client_id, vehicle_id, vehicle_name, vehicle_plate, vehicle_chassis,
        date, technician_id, technician_name, service_type, service_value,
        administrative_value, status, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client2Id,
        vehicle5Result.insertId,
        'Kia Kia',
        'LÖT711',
        null,
        new Date('2025-05-05'),
        adminId,
        'Alessandro Figueiredo',
        'street_dent',
        12000,
        9000,
        'completed',
        '[]'
      ]
    );
    
    await mysqlConnection.query(
      `INSERT INTO services (
        client_id, vehicle_id, vehicle_name, vehicle_plate, vehicle_chassis,
        date, technician_id, technician_name, service_type, service_value,
        administrative_value, status, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client1Id,
        vehicle2Result.insertId,
        'HONDA Marea',
        'ed111111',
        null,
        new Date('2025-05-07'),
        adminId,
        'Alessandro Figueiredo',
        'hail',
        18000,
        15000,
        'pending',
        '[]'
      ]
    );
    
    console.log('Dados de exemplo inseridos com sucesso!');
  }
}

// Exportar a classe MySQLStorage
export const mySQLStorage = new MySQLStorage();