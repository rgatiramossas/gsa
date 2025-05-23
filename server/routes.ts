import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { mySQLStorage as storage } from "./mysql-storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertClientSchema, 
  insertVehicleSchema, 
  insertServiceSchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Simple middleware to simulate authentication
const authenticate = async (req: Request, res: Response, next: Function) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const user = await storage.getUser(Number(userId));
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Create authorization middleware to check user roles
const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: Function) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Serve uploaded files
  app.use('/api/uploads', express.static(uploadDir));
  
  // Authentication routes
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // In a real app, we would generate a JWT token here
      // For simplicity, just return user ID with sensitive info removed
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({ 
        user: userWithoutPassword,
        token: 'mock-jwt-token'
      });
      
    } catch (error) {
      return res.status(500).json({ message: 'Login failed' });
    }
  });
  
  // User routes
  app.get('/api/users/me', authenticate, async (req, res) => {
    const user = (req as any).user;
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  });
  
  // Client routes
  app.get('/api/clients', authenticate, async (req, res) => {
    try {
      const clients = await storage.getClients();
      return res.status(200).json(clients);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch clients' });
    }
  });
  
  app.get('/api/clients/:id', authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const client = await storage.getClient(id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      return res.status(200).json(client);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch client' });
    }
  });
  
  app.post('/api/clients', authenticate, async (req, res) => {
    try {
      const clientData = req.body;
      
      // Validate using zod schema
      const validationResult = insertClientSchema.safeParse(clientData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid client data',
          errors: validationResult.error.errors 
        });
      }
      
      const newClient = await storage.createClient(validationResult.data);
      return res.status(201).json(newClient);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create client' });
    }
  });
  
  app.patch('/api/clients/:id', authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updateData = req.body;
      
      // Validate partial data
      const partialSchema = insertClientSchema.partial();
      const validationResult = partialSchema.safeParse(updateData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid update data',
          errors: validationResult.error.errors 
        });
      }
      
      const updatedClient = await storage.updateClient(id, validationResult.data);
      
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      return res.status(200).json(updatedClient);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update client' });
    }
  });
  
  app.delete('/api/clients/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteClient(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete client' });
    }
  });
  
  // Vehicle routes
  app.get('/api/clients/:clientId/vehicles', authenticate, async (req, res) => {
    try {
      const clientId = Number(req.params.clientId);
      const vehicles = await storage.getVehiclesByClient(clientId);
      return res.status(200).json(vehicles);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch vehicles' });
    }
  });
  
  app.post('/api/vehicles', authenticate, async (req, res) => {
    try {
      const vehicleData = req.body;
      
      // Validate using zod schema
      const validationResult = insertVehicleSchema.safeParse(vehicleData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid vehicle data',
          errors: validationResult.error.errors 
        });
      }
      
      const newVehicle = await storage.createVehicle(validationResult.data);
      return res.status(201).json(newVehicle);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create vehicle' });
    }
  });
  
  // Service routes
  app.get('/api/services', authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      let services;
      
      // Filter services based on user role
      if (user.role === 'admin' || user.role === 'manager') {
        services = await storage.getServices();
      } else if (user.role === 'technician') {
        services = await storage.getServicesByTechnician(user.id);
      } else {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch services' });
    }
  });
  
  app.get('/api/services/:id', authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const service = await storage.getService(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      const user = (req as any).user;
      
      // Check if user has permission to view this service
      if (user.role !== 'admin' && user.role !== 'manager' && service.technicianId !== user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      return res.status(200).json(service);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch service' });
    }
  });
  
  app.post('/api/services', authenticate, async (req, res) => {
    try {
      const serviceData = req.body;
      const user = (req as any).user;
      
      // Set the technician ID if not specified (for non-admin users)
      if (user.role !== 'admin' && !serviceData.technicianId) {
        serviceData.technicianId = user.id;
        serviceData.technicianName = user.name;
      }
      
      // Validate using zod schema
      const validationResult = insertServiceSchema.safeParse(serviceData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid service data',
          errors: validationResult.error.errors 
        });
      }
      
      const newService = await storage.createService(validationResult.data);
      return res.status(201).json(newService);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create service' });
    }
  });
  
  app.patch('/api/services/:id', authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updateData = req.body;
      const user = (req as any).user;
      
      // Check if service exists
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      // Check if user has permission to update this service
      if (user.role !== 'admin' && service.technicianId !== user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // Hide administrative value field for non-admin users
      if (user.role !== 'admin' && 'administrativeValue' in updateData) {
        delete updateData.administrativeValue;
      }
      
      // Validate partial data
      const partialSchema = insertServiceSchema.partial();
      const validationResult = partialSchema.safeParse(updateData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid update data',
          errors: validationResult.error.errors 
        });
      }
      
      const updatedService = await storage.updateService(id, validationResult.data);
      
      return res.status(200).json(updatedService);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update service' });
    }
  });
  
  app.delete('/api/services/:id', authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const user = (req as any).user;
      
      // Check if service exists
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      // Check if user has permission to delete this service
      if (user.role !== 'admin' && service.technicianId !== user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const success = await storage.deleteService(id);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete service' });
    }
  });
  
  // Image upload route
  app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Return the file path that can be stored in the service
      const filePath = `/api/uploads/${req.file.filename}`;
      return res.status(200).json({ path: filePath });
    } catch (error) {
      return res.status(500).json({ message: 'File upload failed' });
    }
  });
  
  // Dashboard routes
  app.get('/api/dashboard/stats', authenticate, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });
  
  app.get('/api/dashboard/recent-services', authenticate, async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const services = await storage.getRecentServices(limit);
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch recent services' });
    }
  });
  
  return httpServer;
}
