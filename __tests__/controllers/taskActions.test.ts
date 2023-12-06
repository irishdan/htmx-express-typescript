import { Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { mocked } from "jest-mock";
import Task from "../../src/models/task";
import {
    createTaskAction,
    deleteTasksAction,
    getTaskEditFormAction,
    getTaskRowAction,
    listTasksAction,
    updateTaskAction
} from "../../src/controllers/taskActions";

describe('Task Actions', () => {
    let req: Request;
    let res: Response;
    const mockedTask = mocked(Task);

    beforeEach(() => {
        req = getMockReq();
        res = getMockRes().res;
        Task.create = jest.fn();
        Task.findAndCountAll = jest.fn();
        Task.findOne = jest.fn();
        Task.findByPk = jest.fn();
    });

    describe('listTasksAction', () => {
        it('should return all tasks', async () => {
            const tasks = [
                { id: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, title: 'Task 2', description: 'Description 2' },
            ] as Task[];

            mockedTask.findAndCountAll.mockResolvedValue({ rows: tasks, count: [{count: tasks.length}] });

            await listTasksAction(req, res);

            expect(res.render).toHaveBeenCalledWith('index', { tasks });
        });

        it('should handle no tasks', async () => {
            mockedTask.findAndCountAll.mockResolvedValue({ rows: [], count: [{count:  0}] });

            await listTasksAction(req, res);

            expect(res.render).toHaveBeenCalledWith('index', { tasks: [] });
        });
    });

    describe('createTaskAction', () => {
        it('should return new task', async () => {
            req.body = {
                title: 'Test task',
                description: 'Test description',
            };

            mockedTask.create.mockResolvedValue({
                id: 1,
                title: 'Test task',
                description: 'Test description'
            });

            await createTaskAction(req, res);

            expect(res.render).toHaveBeenCalledWith('fragments/taskTr', { task: {
                    id: 1,
                    title: 'Test task',
                    description: 'Test description'
                }});
        });
    });

    describe('deleteTasksAction', () => {
        it('should delete a task', async () => {
            const taskModelInstanceMock = { destroy: jest.fn() } as unknown as Task;

            mockedTask.findOne.mockResolvedValue(taskModelInstanceMock);

            req.params.id = '1';

            await deleteTasksAction(req, res);

            expect(res.send).toHaveBeenCalledWith("");
            expect(taskModelInstanceMock.destroy).toHaveBeenCalled();
        });

        it('should handle task not found', async () => {
            mockedTask.findOne.mockResolvedValue(null);

            req.params.id = '999';

            await deleteTasksAction(req, res);

            expect(res.send).toHaveBeenCalledWith("");
        });
    });

    describe('updateTaskAction', () => {
        it('should update a task', async () => {
            req.params.id = '1';
            req.body = {
                title: 'Updated Task',
                description: 'Updated Description'
            };

            const updatedTask = {id: 1, ...req.body} as Task;

            const taskModelInstanceMock = { update: jest.fn() };

            mockedTask.findByPk.mockResolvedValue(taskModelInstanceMock as unknown as Task);
            taskModelInstanceMock.update.mockResolvedValue(updatedTask);

            await updateTaskAction(req, res);

            expect(res.render).toHaveBeenCalledWith('fragments/taskTr', { task: {
                    id: 1,
                    title: 'Updated Task',
                    description: 'Updated Description'
                }});
        });

        it('should handle task not found', async () => {
            mockedTask.findByPk.mockResolvedValue(null);

            req.params.id = '999';

            await updateTaskAction(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("<div>404 Not Found</div>");
        });
    });

    describe('getTaskEditFormAction', () => {
        it('should return task edit form', async () => {
            const task = {
                id: 1,
                title: 'Task 1',
                description: 'Description 1'
            } as Task;

            mockedTask.findOne.mockResolvedValue(task);

            req.params.id = '1';

            await getTaskEditFormAction(req, res);

            expect(res.render).toHaveBeenCalledWith('fragments/taskEditForm', { task });
        });

        it('should handle task not found', async () => {
            mockedTask.findOne.mockResolvedValue(null);

            req.params.id = '999';

            await getTaskEditFormAction(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("<div>404 Not Found</div>");
        });
    });

    describe('getTaskRowAction', () => {
        it('should return task row', async () => {
            const task = {
                id: 1,
                title: 'Task 1',
                description: 'Description 1'
            } as Task;

            mockedTask.findOne.mockResolvedValue(task);

            req.params.id = '1';

            await getTaskRowAction(req, res);

            expect(res.render).toHaveBeenCalledWith('fragments/taskTr', { task });
        });

        it('should handle task not found', async () => {
            mockedTask.findOne.mockResolvedValue(null);

            req.params.id = '999';

            await getTaskRowAction(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("<div>404 Not Found</div>");
        });
    });
});
