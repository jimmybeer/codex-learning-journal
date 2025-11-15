import request from 'supertest';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import app from '../server';
import prisma from '../prismaClient';

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.entry.deleteMany();
});

afterAll(async () => {
  await prisma.entry.deleteMany();
  await prisma.$disconnect();
});

describe('LearningEntry API', () => {
  it('creates an entry and can read it back', async () => {
    const createResponse = await request(app).post('/api/entries').send({
      title: 'Day 1',
      summary: 'Started the learning journal',
      content: 'Documenting the first lesson learned.',
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      title: 'Day 1',
      summary: 'Started the learning journal',
      content: 'Documenting the first lesson learned.',
    });

    const entryId = createResponse.body.id;
    expect(entryId).toBeDefined();

    const readResponse = await request(app).get(`/api/entries/${entryId}`);

    expect(readResponse.status).toBe(200);
    expect(readResponse.body).toMatchObject({
      id: entryId,
      title: 'Day 1',
      summary: 'Started the learning journal',
      content: 'Documenting the first lesson learned.',
    });
  });

  it('lists entries sorted by newest first', async () => {
    await prisma.entry.create({
      data: {
        title: 'Older',
        summary: 'First summary',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      },
    });
    await prisma.entry.create({
      data: {
        title: 'Newer',
        summary: 'Second summary',
        createdAt: new Date('2024-02-01T00:00:00.000Z'),
      },
    });

    const response = await request(app).get('/api/entries');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Newer');
    expect(response.body[1].title).toBe('Older');
  });

  it('updates an entry and returns the latest data', async () => {
    const entry = await prisma.entry.create({
      data: {
        title: 'Draft',
        summary: 'Needs edits',
      },
    });

    const response = await request(app)
      .put(`/api/entries/${entry.id}`)
      .send({
        title: 'Draft updated',
        summary: 'Now complete',
        content: 'Finalized content',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: entry.id,
      title: 'Draft updated',
      summary: 'Now complete',
      content: 'Finalized content',
    });
  });

  it('deletes an entry and removes it from the database', async () => {
    const entry = await prisma.entry.create({
      data: {
        title: 'To delete',
        summary: 'Cleanup entry',
      },
    });

    const response = await request(app).delete(`/api/entries/${entry.id}`);

    expect(response.status).toBe(204);

    const deleted = await prisma.entry.findUnique({
      where: { id: entry.id },
    });
    expect(deleted).toBeNull();
  });

  it('rejects requests without a title', async () => {
    const response = await request(app).post('/api/entries').send({
      summary: 'Missing a title should fail',
      content: 'This payload does not include the required title.',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'title and summary are required',
    });
  });
});
