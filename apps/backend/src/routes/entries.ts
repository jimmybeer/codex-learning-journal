import { LearningEntry, Prisma } from '@prisma/client';
import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

const STATUS_VALUES = new Set<LearningEntry['status']>([
  'PLANNED',
  'IN_PROGRESS',
  'DONE',
]);

const DIFFICULTY_VALUES = new Set<NonNullable<LearningEntry['difficulty']>>([
  'EASY',
  'MEDIUM',
  'HARD',
]);

type Nullable<T> = T | null;

type ParseResult<T> =
  | { ok: true; provided: false }
  | { ok: true; provided: true; value: T }
  | { ok: false; message: string };

function parseTags(input: unknown): ParseResult<Nullable<string>> {
  if (input === undefined) {
    return { ok: true, provided: false };
  }
  if (input === null) {
    return { ok: true, provided: true, value: null };
  }
  if (Array.isArray(input)) {
    if (input.some((tag) => typeof tag !== 'string')) {
      return {
        ok: false,
        message: 'tags must be an array of strings or comma-separated string',
      };
    }
    const trimmed = input.map((tag) => tag.trim()).filter(Boolean);
    return {
      ok: true,
      provided: true,
      value: trimmed.length > 0 ? trimmed.join(',') : null,
    };
  }
  if (typeof input === 'string') {
    const trimmed = input
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    return {
      ok: true,
      provided: true,
      value: trimmed.length > 0 ? trimmed.join(',') : null,
    };
  }
  return {
    ok: false,
    message: 'tags must be an array of strings or comma-separated string',
  };
}

function parseStatus(input: unknown): ParseResult<LearningEntry['status']> {
  if (input === undefined) {
    return { ok: true, provided: false };
  }
  if (typeof input !== 'string') {
    return {
      ok: false,
      message: 'status must be one of PLANNED, IN_PROGRESS, DONE',
    };
  }
  const normalized = input.toUpperCase() as LearningEntry['status'];
  if (!STATUS_VALUES.has(normalized)) {
    return {
      ok: false,
      message: 'status must be one of PLANNED, IN_PROGRESS, DONE',
    };
  }
  return { ok: true, provided: true, value: normalized };
}

function parseDifficulty(input: unknown): ParseResult<Nullable<LearningEntry['difficulty']>> {
  if (input === undefined) {
    return { ok: true, provided: false };
  }
  if (input === null) {
    return { ok: true, provided: true, value: null };
  }
  if (typeof input !== 'string') {
    return {
      ok: false,
      message: 'difficulty must be one of EASY, MEDIUM, HARD',
    };
  }
  const normalized = input.toUpperCase() as LearningEntry['difficulty'];
  if (!DIFFICULTY_VALUES.has(normalized as NonNullable<LearningEntry['difficulty']>)) {
    return {
      ok: false,
      message: 'difficulty must be one of EASY, MEDIUM, HARD',
    };
  }
  return { ok: true, provided: true, value: normalized };
}

function normalizeDescription(input: unknown): ParseResult<Nullable<string>> {
  if (input === undefined) {
    return { ok: true, provided: false };
  }
  if (input === null) {
    return { ok: true, provided: true, value: null };
  }
  if (typeof input !== 'string') {
    return { ok: false, message: 'description must be a string' };
  }
  const trimmed = input.trim();
  return { ok: true, provided: true, value: trimmed.length > 0 ? trimmed : null };
}

function serializeEntry(entry: LearningEntry) {
  return {
    ...entry,
    tags: entry.tags
      ? entry.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const entries = await prisma.learningEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries.map(serializeEntry));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const entry = await prisma.learningEntry.findUnique({
      where: { id: req.params.id },
    });
    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    res.json(serializeEntry(entry));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, difficulty, tags } = req.body ?? {};

    if (typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ message: 'title is required' });
      return;
    }

    const normalizedDescription = normalizeDescription(description);
    if (!normalizedDescription.ok) {
      res.status(400).json({ message: normalizedDescription.message });
      return;
    }

    const parsedStatus = parseStatus(status);
    if (!parsedStatus.ok) {
      res.status(400).json({ message: parsedStatus.message });
      return;
    }

    const parsedDifficulty = parseDifficulty(difficulty);
    if (!parsedDifficulty.ok) {
      res.status(400).json({ message: parsedDifficulty.message });
      return;
    }

    const parsedTags = parseTags(tags);
    if (!parsedTags.ok) {
      res.status(400).json({ message: parsedTags.message });
      return;
    }

    const entry = await prisma.learningEntry.create({
      data: {
        title: title.trim(),
        description:
          normalizedDescription.provided ? normalizedDescription.value : undefined,
        status: parsedStatus.provided ? parsedStatus.value : 'PLANNED',
        difficulty: parsedDifficulty.provided ? parsedDifficulty.value : undefined,
        tags: parsedTags.provided ? parsedTags.value : undefined,
      },
    });

    res.status(201).json(serializeEntry(entry));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, status, difficulty, tags } = req.body ?? {};

    if (typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ message: 'title is required' });
      return;
    }

    const normalizedDescription = normalizeDescription(description);
    if (!normalizedDescription.ok) {
      res.status(400).json({ message: normalizedDescription.message });
      return;
    }

    const parsedStatus = parseStatus(status);
    if (!parsedStatus.ok) {
      res.status(400).json({ message: parsedStatus.message });
      return;
    }

    const parsedDifficulty = parseDifficulty(difficulty);
    if (!parsedDifficulty.ok) {
      res.status(400).json({ message: parsedDifficulty.message });
      return;
    }

    const parsedTags = parseTags(tags);
    if (!parsedTags.ok) {
      res.status(400).json({ message: parsedTags.message });
      return;
    }

    const data: Prisma.LearningEntryUpdateInput = {
      title: title.trim(),
    };

    if (normalizedDescription.provided) {
      data.description = normalizedDescription.value;
    }
    if (parsedStatus.provided) {
      data.status = parsedStatus.value;
    }
    if (parsedDifficulty.provided) {
      data.difficulty = parsedDifficulty.value;
    }
    if (parsedTags.provided) {
      data.tags = parsedTags.value;
    }

    const entry = await prisma.learningEntry.update({
      where: { id: req.params.id },
      data,
    });

    res.json(serializeEntry(entry));
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
    await prisma.learningEntry.delete({
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
