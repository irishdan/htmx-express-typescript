import Task from "../models/task";
import { Request, Response } from "express";

export const listTasksAction = async (request: Request, response: Response) => {
    const tasks = await Task.findAndCountAll();
    return response.render("index", { tasks: tasks.rows });
}

export const createTaskAction  = async (request: Request, response: Response) => {
    const task = {
        title: request.body.title,
        description: request.body.description,
    };

    await Task.create(task).then((item) => {
        return response.render("fragments/taskTr", { task: item });
    });
}

export const deleteTasksAction = async (request: Request, response: Response) => {
    const id = request.params.id;

    await Task.findOne({ where: { id: id } }).then((task) => {
        if (task) {
            task.destroy();
        }
        return response.send("");
    });
}

export const updateTaskAction = async (request: Request, response: Response) => {
    const id = request.params.id;

    await Task.findByPk(id).then(task => {
        if (!task) return response.status(404).send("<div>404 Not Found</div>");

        const setCompleted = !!request.body.completed;

        task.update({
            title: request.body.title,
            description: request.body.description,
            completedAt: setCompleted ? new Date() : null
        })
            .then(updatedTask => {
                return response.render("fragments/taskTr", { task: updatedTask });
            });
    });
}

export const getTaskEditFormAction = async (request: Request, response: Response) => {
    const id = request.params.id;

    await Task.findOne({ where: { id: id } }).then(task => {
        if (!task) return response.status(404).send("<div>404 Not Found</div>");
        return response.render("fragments/taskEditForm", { task: task });
    });
}

export const getTaskRowAction = async (request: Request, response: Response) => {
    const id = request.params.id;
    await Task.findOne({ where: { id: id } }).then(task => {
        if (!task) response.status(404).send("<div>404 Not Found</div>");

        return response.render("fragments/taskTr", { task: task });
    });
}

