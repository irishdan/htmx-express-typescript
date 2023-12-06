import {Request, Response, Router} from 'express';
import { body, validationResult } from 'express-validator';

import {
    createTaskAction,
    deleteTasksAction,
    getTaskEditFormAction,
    getTaskRowAction,
    listTasksAction,
    updateTaskAction
} from "../controllers/taskActions";

const router = Router();

const createTaskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
];

router.get("/", listTasksAction);
router.post("/", createTaskValidationRules, async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    return await createTaskAction(request, response);
});
router.put("/update/:id", updateTaskAction);
router.delete("/delete/:id", deleteTasksAction);
router.get("/get-task-row/:id", getTaskRowAction);
router.get("/get-edit-form/:id", getTaskEditFormAction);

export default router;
