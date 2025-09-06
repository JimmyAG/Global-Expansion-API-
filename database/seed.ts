import * as bcrypt from 'bcrypt';
import {
  Project,
  ProjectStatus,
  Service,
  User,
  UserRole,
  Vendor,
} from './mysql/entities';
import { MySQLDataSource } from './mysql/datasource';
import { DataSource, EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { parseSeedArgs } from 'cli/yargs';
import { MongoClient, Db } from 'mongodb';
import {
  ResearchDocument,
  ResearchDocumentDocument,
  ResearchDocumentSchema,
} from './mongodb/schemas/research-document.schema';
import mongoose, { Connection } from 'mongoose';
import { documentTags, industries, services } from '@app/constants';
import { mongodbConfig } from '@app/core/config/database.config';

// MongoDB
export const generateResearchDocument = async (
  mongoConnection: Connection,
  projectId: string,
): Promise<ResearchDocumentDocument> => {
  const ResearchDocumentModel = mongoConnection.model<ResearchDocument>(
    ResearchDocument.name,
    ResearchDocumentSchema,
  );

  const doc = new ResearchDocumentModel({
    projectId,
    title: faker.lorem.sentence({ min: 3, max: 7 }),
    content: faker.lorem.paragraphs({ min: 1, max: 3 }),
    tags: faker.helpers.arrayElements(documentTags, { min: 1, max: 4 }),
  });

  return doc.save();
};

async function dropCollection(db: Db, collectionName: string) {
  const collections = await db
    .listCollections({ name: collectionName })
    .toArray();
  if (collections.length > 0) {
    await db.collection(collectionName).deleteMany({});
    console.log(`Collection "${collectionName}" cleared`);
  }
}

// MySQL database functions
const generateService = (): Service => {
  return {
    id: uuidv4(),
    name: faker.helpers.arrayElement(services),
    industry: faker.helpers.arrayElement(industries),
    description: faker.commerce.productDescription(),
  };
};

const generateServices = (count: number): Service[] => {
  const services: Service[] = [];

  for (let i = 0; i < count; i++) {
    services.push(generateService());
  }

  return services;
};

const allServices = generateServices(100);

const generateVendors = async (
  MySQLDataSourceManager: EntityManager,
  count: number,
) => {
  const vendors: Vendor[] = [];

  for (let i = 0; i < count; i++) {
    const countries_supported = Array.from(
      { length: faker.number.int({ min: 0, max: 10 }) },
      () => faker.location.country(),
    );

    const services_offered = faker.helpers.arrayElements(allServices, {
      min: 1,
      max: 10,
    });

    const vendor = MySQLDataSourceManager.create(Vendor, {
      countries_supported,
      services_offered,
      response_sla_hours: faker.number.int({ min: 1, max: 3 }),
      rating: faker.number.float({
        min: 0.0,
        max: 5.0,
        fractionDigits: 1,
      }),
      name: `${faker.company.name()} ${faker.commerce.department()} ${faker.number.binary({ min: 0, max: 1000 })}`,
    });

    vendors.push(vendor);
  }

  await MySQLDataSourceManager.save(vendors);
};

const generateUniqueUsername = (uniqueUsernames: Set<string>): string => {
  let username: string;
  do {
    username = faker.person.fullName();
  } while (uniqueUsernames.has(username.toLowerCase()));

  uniqueUsernames.add(username.toLowerCase());

  return username;
};

const generateUniqueEmail = (uniqueEmails: Set<string>): string => {
  let email: string;

  do {
    email = faker.internet.email();
  } while (uniqueEmails.has(email.toLowerCase()));

  uniqueEmails.add(email.toLowerCase());

  return email;
};

const generateClients = async (
  MySQLDataSourceManager: EntityManager,
  count: number,
) => {
  const hashedPasswordClient = await bcrypt.hash('clientpassword', 10);
  const clientUsers: User[] = [];
  const uniqueUsernames = new Set<string>();
  const uniqueEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const username = generateUniqueUsername(uniqueUsernames);
    const contact_email = generateUniqueEmail(uniqueEmails);

    const client = MySQLDataSourceManager.create(User, {
      username,
      contact_email,
      password: hashedPasswordClient,
      role: UserRole.CLIENT,
      company_name: faker.company.name(),
    });
    clientUsers.push(client);
  }

  await MySQLDataSourceManager.save(clientUsers);
};

const generateProjects = async (
  MySQLDataSourceManager: EntityManager,
  mongoConnection: Connection,
) => {
  const allUsers = await MySQLDataSourceManager.find(User);
  const projects: Project[] = [];
  const statusValues = Object.values(ProjectStatus);

  allUsers.map((user) => {
    const projectsPerUser = Math.floor(Math.random() * 6);

    for (let i = 0; i < projectsPerUser; i++) {
      const services_needed = faker.helpers.arrayElements(allServices, 5);

      const randomStatus =
        statusValues[Math.floor(Math.random() * statusValues.length)];

      const project = MySQLDataSourceManager.create(Project, {
        country: faker.location.country(),
        services_needed,
        budget: faker.number.float({
          min: 100,
          max: 1000000,
          fractionDigits: 2,
        }),
        status: randomStatus,
        user_id: user.id,
      });

      projects.push(project);
    }
  });

  const savedProjects = await MySQLDataSourceManager.save(projects);

  for (const project of savedProjects) {
    const numDocs = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numDocs; i++) {
      await generateResearchDocument(mongoConnection, project.id);
    }
  }
};

const dropTable = async (dataSource: DataSource, tableName: string) => {
  try {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.query(`TRUNCATE TABLE \`${tableName}\`;`);
  } catch (error) {
    console.error(error);
  }
};

const cleanDb = async (dataSource: DataSource): Promise<void> => {
  const tableNames = [
    'vendors',
    'projects',
    'matches',
    'users',
    // 'typeorm_migrations',
  ];

  for (const tableName of tableNames) {
    await dropTable(dataSource, tableName);
  }
};

async function runSeeds() {
  // Init
  await MySQLDataSource.initialize();
  const mysqlDb = MySQLDataSource;
  const MySQLDataSourceManager = MySQLDataSource.manager;
  const uri = mongodbConfig.uri as string;
  const dbName = process.env.MONGO_DB || 'mongodb';

  const client = new MongoClient(uri);
  await client.connect();
  const mongoDb = client.db(dbName);
  const mongoConnection: Connection = await mongoose
    .createConnection(uri)
    .asPromise();

  const seedOptions = parseSeedArgs();
  let existingAdminUser = false;

  // Clear existing data
  if (seedOptions.truncateTables) {
    console.log('cleaning');

    // Clear MySQL DB
    await cleanDb(mysqlDb);

    // Clear Mongo DB collection
    await dropCollection(mongoDb, 'researchdocuments');
  }

  // Generate 1000 client users by default
  const numberOfClients = seedOptions.clientCount;
  await generateClients(MySQLDataSourceManager, numberOfClients);

  const numberOfVendors = seedOptions.vendorCount;
  await generateVendors(MySQLDataSourceManager, numberOfVendors);

  await generateProjects(MySQLDataSourceManager, mongoConnection);

  if (seedOptions.superUser) {
    const existingAdmin = await MySQLDataSourceManager.findOne(User, {
      where: { username: 'admin' },
    });

    existingAdminUser = existingAdmin !== null ? true : false;

    if (!existingAdminUser) {
      const hashedPasswordAdmin = await bcrypt.hash('adminpassword', 10);
      const adminUser = MySQLDataSourceManager.create(User, {
        username: 'admin',
        contact_email: 'admin@expanders360.com',
        password: hashedPasswordAdmin,
        role: UserRole.ADMIN,
        company_name: 'expanders360',
      });
      await MySQLDataSourceManager.save(adminUser);
    }
  }

  if (!existingAdminUser && seedOptions.superUser) {
    console.log('A new Admin user was created');
    console.table([
      {
        username: `admin`,
        contact_email: 'admin@expanders360.com',
        password: 'adminpassword',
      },
    ]);
  }

  console.log('Seeding ended');

  await MySQLDataSource.destroy();
  process.exit();
}

runSeeds().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit();
});
