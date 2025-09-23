const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"], // makes sure only these 4 values are set for status.
        message: (props) => `${props.value} is not a valid status type`,
      },
    },
  },
  { timestamps: true }
);
// using pre hook for schema side validation
connectionRequestSchema.pre('save', function(next) {
  const connectionRequest=this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to your self");
  }
  next();
});
const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

// compound indexing to make connection request faster.
connectionRequestSchema.index({
  firstName:1,
  lastName:1
})
module.exports = ConnectionRequest;
