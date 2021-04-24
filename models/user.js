const { Schema, model } = require('mongoose');
const moment = require('moment');


const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
        unique: true
  },
  email: {
    type: String,
    unique: true, 
    required:  true,
    validate: {
      validator: (email) => {
        return /[a-zA-z0-9]+@.+\..+/i.test(email);
      },
      message: props => `${props.value} is not a valid email address format. Should be similar to 'example2@mail.com' and contain only english letters and/or numbers`
    }
  },
  thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { 
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
}
);


UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', UserSchema)

module.exports = User;