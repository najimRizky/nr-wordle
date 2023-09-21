import mongoose from "mongoose";  

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
}, {versionKey: false})

const Word = mongoose.models.Word || mongoose.model("Word", WordSchema);

export default Word;