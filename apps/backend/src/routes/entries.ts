import { Prisma } from '@prisma/client';
import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const entry = await prisma.entry.findUnique({
      where: { id: req.params.id },
    });
    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, summary, content } = req.body ?? {};

    if (!title || !summary) {
      res.status(400).json({ message: 'title and summary are required' });
      return;
    }

    const entry = await prisma.entry.create({
      data: { title, summary, content },
    });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, summary, content } = req.body ?? {};

    if (!title || !summary) {
      res.status(400).json({ message: 'title and summary are required' });
      return;
    }

    const entry = await prisma.entry.update({
      where: { id: req.params.id },
      data: { title, summary, content },
    });
    res.json(entry);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.entry.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    next(error);
  }
});

export default router;
