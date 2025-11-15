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
