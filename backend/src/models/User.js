import mongoose, { mongo } from 'mongoose';

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },
        googleId: {
            type: String
        },
        role: {
            type: String,
            default: 'user',
        },
        phone: {
            type: String,
            default:null
        }
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);

