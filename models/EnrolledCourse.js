import mongoose from "mongoose"

const lessonsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lectures: [{
        title: { type: String, required: true },
        videoUrl: { type: String, required: true },
        duration: { type: String, required: true },
        completed: { type: Boolean, default: false, require: true }
    }],
})

const enrolledCourseSchema = new mongoose.Schema({
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
    language: { type: String, required: true },
    lessons: [lessonsSchema],
    notes: { type: String },
    learningPoints: { type: Array, required: true },
}, { timestamps: true });

const enrolledCourseModel = mongoose.models.EnrolledCourse || mongoose.model('EnrolledCourse', enrolledCourseSchema);
export default enrolledCourseModel;