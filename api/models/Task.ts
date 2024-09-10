import mongoose from 'mongoose';

const TasksSchema = new mongoose.Schema({
    user: String,
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: ['new', 'in_progress', 'complete'],
        default: "new",
    }
});

const Tasks = mongoose.model('Tasks', TasksSchema);

export default Tasks;