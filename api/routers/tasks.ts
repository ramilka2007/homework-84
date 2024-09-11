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
        return next(error);
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
        return next(e);
    }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {

    try {
        if (!req.params.id) {
            res.status(400).send({"error": "Id params must be in url"});
        }
        await Task.deleteOne({_id: req.params.id});

        return res.send("task was deleted");

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(error);
        }
        return next(error);
    }

});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {

    try {
        if (!req.params.id) {
            res.status(400).send({"error": "Id params must be in url"});
        }

        if (req.user?._id) {

            const task = await Task.findById(req.params.id);


            if (task && task.user === String(req.user._id)) {

                if (req.body.user) {
                    return  res.status(400).send({"error": "User field not must be in request"});
                } else if (!['new', 'in_progress', 'complete'].includes(req.body.status)) {
                    return  res.status(400).send({"error": "Status not correct."});
                } else {
                    const updateTask = await Task.findOneAndUpdate({_id: req.params.id}, req.body);
                    if (updateTask) updateTask.save();

                    return res.send(updateTask);
                }

            } else {
                return res.status(403).send({error: 'You cannot edit not your task'})
            }
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(error);
        }
        return next(error);
    }
});

export default tasksRouter;