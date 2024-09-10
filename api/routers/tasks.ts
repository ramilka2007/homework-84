import auth, {RequestWithUser} from "../middleware/auth";
import {Router} from "express";
import Task from "../models/Task";
import mongoose from "mongoose";

const taskRouter = Router();

taskRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
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