import mongoose , {Schema , model} from "mongoose";

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recieverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },

        // TODO: add the audio feature as well
        // audio: {
        //     type: String,
        // }
    } , 
    { timestamps: true }
);

const Message = model("Message" , messageSchema);

export default Message;