import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema ({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    
})