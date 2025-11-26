import { projects, type Project, type InsertProject } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
}

export class DatabaseStorage implements IStorage {
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }
}

export const storage = new DatabaseStorage();