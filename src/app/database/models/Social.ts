import { Schema, Document, model } from 'mongoose';

interface ISocial extends Document {
    userId: string;
    friends: Array<string>;
    bf: Array<string>;
    blocklist: Array<string>;
}
const SocialSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    friends: {
        type: Array,
        default: []
    },
    bf: {
        type: Array,
        default: []
    },
    blocklist: {
        type: Array,
        default: []
    }
});

export default model<ISocial>('Social', SocialSchema);
