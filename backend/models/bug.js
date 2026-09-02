const mongoose = require('mongoose')

const BugSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    deadline: {
        type: Date,
        required: [true, "Deadline is required"],
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: "Deadline cannot be in the past",
        },
    },
    img: { type: String },
    type: { type: String, enum: ['bug', 'feature'], required: true },
    status: {
        type: String,
        validate: {
            validator: function (value) {
                if (this.type === 'bug') {
                    return ['new', 'started', 'resolved'].includes(value);
                } else if (this.type === 'feature') {
                    return ['new', 'started', 'completed'].includes(value);
                }
                return false;
            },
            message: props => "error in type"
        }
    },
    projectRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignToDev: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: "At least one developer must be assigned",
        },
    },
},
{
    timestamps: true,
}
)

BugSchema.methods.time_passed = function () {
    const currentTime = new Date()
    const createdTime = this.createdAt
    let time = currentTime - createdTime
    time = Math.floor(time / (1000 * 60 * 60 * 24));
    if (time === 1) {
        return `${time} day ago`
    } else if (time === 0) {
        return `today created`
    }
    return `${time} days ago`
}

BugSchema.methods.stale = function () {
    const currentTime = new Date()
    const createdTime = this.createdAt
    let time = currentTime - createdTime
    time = Math.floor(time / (1000 * 60 * 60 * 24));
    return time > 5
}

module.exports = mongoose.model('Bug', BugSchema)