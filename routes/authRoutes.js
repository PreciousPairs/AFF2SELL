import { Router } from 'express';
import * as authController from '../../services/auth';
import { checkPermissions } from '../../middleware/permissions';
import { validateRequestBody } from '../../middleware/validation';

const router = Router();

router.post('/register', validateRequestBody('registerSchema'), checkPermissions(['admin']), async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await authController.register(email, password, role);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/users/:userId/role', validateRequestBody('updateRoleSchema'), checkPermissions(['admin']), async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  try {
    await authController.updateUserRole(userId, role);
    res.status(200).json({
      message: "User role updated successfully",
      userId,
      newRole: role,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
