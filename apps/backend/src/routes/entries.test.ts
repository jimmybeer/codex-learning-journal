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

describe('Entries routes', () => {
  it('creates an entry', async () => {
    const response = await request(app).post('/api/entries').send({
      title: 'Day 1',
      summary: 'Learned about Codex scaffolding',
      content: 'Documenting the first entry.',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: 'Day 1',
      summary: 'Learned about Codex scaffolding',
      content: 'Documenting the first entry.',
    });

    const dbEntry = await prisma.entry.findUnique({
      where: { id: response.body.id },
    });
    expect(dbEntry).not.toBeNull();
  });

  it('rejects invalid payloads', async () => {
    const response = await request(app).post('/api/entries').send({
      title: '',
      summary: '',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'title and summary are required',
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

  it('updates and deletes entries', async () => {
    const entry = await prisma.entry.create({
      data: {
        title: 'Draft',
        summary: 'Needs edits',
      },
    });

    const updated = await request(app)
      .put(`/api/entries/${entry.id}`)
      .send({
        title: 'Draft updated',
        summary: 'Now complete',
        content: 'Finalized content',
      });

    expect(updated.status).toBe(200);
    expect(updated.body.summary).toBe('Now complete');

    const remove = await request(app).delete(`/api/entries/${entry.id}`);
    expect(remove.status).toBe(204);

    const deleted = await prisma.entry.findUnique({
      where: { id: entry.id },
    });
    expect(deleted).toBeNull();
  });
});
