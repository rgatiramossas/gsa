import { 
  users, User, InsertUser,
  clients, Client, InsertClient,
  vehicles, Vehicle, InsertVehicle,
  services, Service, InsertService,
  budgets, Budget, InsertBudget
} from "@shared/schema";

// Storage interface with all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Vehicle operations
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehiclesByClient(clientId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Service operations
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getServicesByClient(clientId: number): Promise<Service[]>;
  getServicesByTechnician(technicianId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Dashboard data
  getDashboardStats(): Promise<{
    pendingServices: number;
    inProgressServices: number;
    completedServices: number;
    totalRevenue: number;
  }>;
  getRecentServices(limit: number): Promise<Service[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private vehicles: Map<number, Vehicle>;
  private services: Map<number, Service>;
  private budgets: Map<number, Budget>;
  
  private userCurrentId: number;
  private clientCurrentId: number;
  private vehicleCurrentId: number;
  private serviceCurrentId: number;
  private budgetCurrentId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.vehicles = new Map();
    this.services = new Map();
    this.budgets = new Map();
    
    this.userCurrentId = 1;
    this.clientCurrentId = 1;
    this.vehicleCurrentId = 1;
    this.serviceCurrentId = 1;
    this.budgetCurrentId = 1;
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      name: "Alessandro Figueiredo",
      email: "admin@example.com",
      role: "admin"
    });
    
    // Create sample data for testing
    this.seedSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientCurrentId++;
    const now = new Date();
    const newClient: Client = { ...client, id, createdAt: now };
    this.clients.set(id, newClient);
    return newClient;
  }
  
  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientData };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }
  
  // Vehicle operations
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }
  
  async getVehiclesByClient(clientId: number): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(
      (vehicle) => vehicle.clientId === clientId
    );
  }
  
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.vehicleCurrentId++;
    const newVehicle: Vehicle = { ...vehicle, id };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }
  
  async updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    
    const updatedVehicle = { ...vehicle, ...vehicleData };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }
  
  async deleteVehicle(id: number): Promise<boolean> {
    return this.vehicles.delete(id);
  }
  
  // Service operations
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getServicesByClient(clientId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.clientId === clientId
    );
  }
  
  async getServicesByTechnician(technicianId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.technicianId === technicianId
    );
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceCurrentId++;
    const now = new Date();
    const newService: Service = { ...service, id, createdAt: now };
    this.services.set(id, newService);
    return newService;
  }
  
  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Dashboard data
  async getDashboardStats(): Promise<{
    pendingServices: number;
    inProgressServices: number;
    completedServices: number;
    totalRevenue: number;
  }> {
    const services = Array.from(this.services.values());
    
    const pendingServices = services.filter(s => s.status === 'pending').length;
    const inProgressServices = services.filter(s => s.status === 'in_progress').length;
    const completedServices = services.filter(s => s.status === 'completed').length;
    
    // Calculate total revenue from completed services in cents, then convert to euros
    const totalRevenue = services
      .filter(s => s.status === 'completed')
      .reduce((total, service) => total + service.serviceValue, 0);
    
    return {
      pendingServices,
      inProgressServices,
      completedServices,
      totalRevenue
    };
  }
  
  async getRecentServices(limit: number): Promise<Service[]> {
    const services = Array.from(this.services.values());
    
    // Sort by creation date (newest first) and limit
    return services
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  // Helper method to seed sample data
  private async seedSampleData() {
    // Create sample clients
    const client1 = await this.createClient({
      name: "FORD - Waldshut",
      location: "Waldshut-Tingen",
      email: "contact@ford-waldshut.com",
      phone: "+49123456789"
    });
    
    const client2 = await this.createClient({
      name: "Lackierzentrum",
      location: "Lorrach",
      email: "",
      phone: ""
    });
    
    // Create sample vehicles
    const vehicle1 = await this.createVehicle({
      clientId: client1.id,
      brand: "TESTE",
      model: "TESET",
      plate: "1111",
      chassis: "",
      color: ""
    });
    
    const vehicle2 = await this.createVehicle({
      clientId: client1.id,
      brand: "HONDA",
      model: "Marea",
      plate: "ed111111",
      chassis: "",
      color: ""
    });
    
    const vehicle3 = await this.createVehicle({
      clientId: client1.id,
      brand: "teste",
      model: "teste",
      plate: "1111",
      chassis: "",
      color: ""
    });
    
    const vehicle4 = await this.createVehicle({
      clientId: client2.id,
      brand: "Exemplo teste",
      model: "Teste",
      plate: "Teste",
      chassis: "",
      color: ""
    });
    
    const vehicle5 = await this.createVehicle({
      clientId: client2.id,
      brand: "Kia",
      model: "Kia",
      plate: "LÖT711",
      chassis: "",
      color: ""
    });
    
    // Create sample services
    await this.createService({
      clientId: client2.id,
      vehicleId: vehicle5.id,
      vehicleName: "Kia Kia",
      vehiclePlate: "LÖT711",
      vehicleChassis: "",
      date: new Date('2025-05-05'),
      technicianId: 1,
      technicianName: "Alessandro Figueiredo",
      serviceType: "street_dent",
      serviceValue: 12000, // 120.00 €
      administrativeValue: 9000, // 90.00 €
      status: "completed",
      images: []
    });
    
    await this.createService({
      clientId: client1.id,
      vehicleId: vehicle2.id,
      vehicleName: "HONDA Marea",
      vehiclePlate: "ed111111",
      vehicleChassis: "",
      date: new Date('2025-05-07'),
      technicianId: 1,
      technicianName: "Alessandro Figueiredo",
      serviceType: "hail",
      serviceValue: 18000, // 180.00 €
      administrativeValue: 15000, // 150.00 €
      status: "pending",
      images: []
    });
  }
}

export const storage = new MemStorage();
