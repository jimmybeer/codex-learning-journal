import request from 'supertest';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import app from '../server';
import prisma from '../prismaClient';

afterAll(async () => {
  await prisma.learningEntry.deleteMany();
  await prisma.$disconnect();
});

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.learningEntry.deleteMany();
});

describe('LearningEntry routes', () => {
  it('creates an entry with optional fields', async () => {
    const response = await request(app).post('/api/entries').send({
      title: 'Day 1',
      description: 'Set up Prisma',
      status: 'IN_PROGRESS',
      difficulty: 'MEDIUM',
      tags: ['prisma', 'sqlite'],
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: 'Day 1',
      description: 'Set up Prisma',
      status: 'IN_PROGRESS',
      difficulty: 'MEDIUM',
      tags: ['prisma', 'sqlite'],
    });

    const dbEntry = await prisma.learningEntry.findUnique({
      where: { id: response.body.id },
    });
    expect(dbEntry).not.toBeNull();
    expect(dbEntry?.tags).toBe('prisma,sqlite');
  });

  it('rejects invalid payloads', async () => {
    const response = await request(app).post('/api/entries').send({
      title: '',
      status: 'UNKNOWN',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'title is required',
    });
  });

  it('lists entries sorted by newest first', async () => {
    await prisma.learningEntry.create({
      data: {
        title: 'Older',
        status: 'DONE',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      },
    });
    await prisma.learningEntry.create({
      data: {
        title: 'Newer',
        status: 'PLANNED',
        createdAt: new Date('2024-02-01T00:00:00.000Z'),
      },
    });

    const response = await request(app).get('/api/entries');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Newer');
    expect(response.body[1].title).toBe('Older');
  });

  it('updates and deletes entries', async () => {
    const entry = await prisma.learningEntry.create({
      data: {
        title: 'Draft',
        status: 'PLANNED',
        tags: 'initial',
      },
    });

    const updated = await request(app)
      .put(`/api/entries/${entry.id}`)
      .send({
        title: 'Draft updated',
        status: 'DONE',
        description: 'Now complete',
        difficulty: 'HARD',
        tags: 'final,tag',
      });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      title: 'Draft updated',
      status: 'DONE',
      description: 'Now complete',
      difficulty: 'HARD',
      tags: ['final', 'tag'],
    });

    const remove = await request(app).delete(`/api/entries/${entry.id}`);
    expect(remove.status).toBe(204);

    const deleted = await prisma.learningEntry.findUnique({
      where: { id: entry.id },
    });
    expect(deleted).toBeNull();
  });
});
