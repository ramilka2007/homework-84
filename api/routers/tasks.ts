import auth, {RequestWithUser} from "../middleware/auth";
import {Router} from "express";
import Task from "../models/Task";
import mongoose from "mongoose";

const tasksRouter = Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
    try {
        const task = new Task({
            user: req.user?.username,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });

        await task.save();
        return res.send(task);

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(error);
        }
        next(error);
    }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
    try {
        let tasks;

        if (req.user) {
            tasks = await Task.find({user: req.user.username})
        } else {
            tasks = await Task.find();
        }

        return res.send(tasks);
    } catch (e) {
        next(e);
    }
});

export default tasksRouter;