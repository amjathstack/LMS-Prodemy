import mongoose from "mongoose"

const lessonsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lectures: [{
        title: { type: String, required: true },
        videoUrl: { type: String, required: true },
        duration: { type: String, required: true },
        availability: { type: Boolean, default: false, require: true }
    }],
})

const courseSchema = new mongoose.Schema({
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
    offer: { type: Number },
    category: { type:String, required: true },
    studentsCount: { type: Number, default: 0 },
    language: { type: String, required: true },
    lessons: [lessonsSchema],
    notes: { type: String },
    learningPoints: { type: Array, required: true },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        rating: { type: Number },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

const courseModel = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default courseModel;