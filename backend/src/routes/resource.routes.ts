import { Router, Response } from 'express';
import { Resource } from '../models/Resource';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const resources = await Resource.findAll();
    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { name, type, description } = req.body;
    const resource = await Resource.create({ name, type, description });
    res.status(201).json(resource);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    await Resource.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
