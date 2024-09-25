const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
var validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index:true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      unique:true,
      // match: /.+\@.+\..+/,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Id not Valid! " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please Enter Strong Password :" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      // enum:["male","female","other"],
      // message: "Gender data is not valid",
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not Valid :" + value);
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is Invalid! " + value);
        }
      },
    },
    about: {
      type: String,
      default: "this is default value of user",
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 5, max: 250 })) {
          throw new Error(
            "minimum length at least 5 and maximum should be 250 char"
          );
        }
      },
    },
    skills: {
      type: [String],
      validate: [
        {
          validator: function (skillsArray) {
            // Ensure it's an array and has at least 1 skill
            if (!Array.isArray(skillsArray) && skillsArray.length > 0) {
              throw new Error("Skills array must have at least one skill");
            }
          },
        },
        {
          validator: function (skillsArray) {
            // Ensure array has at most 5 skills
            if (!Array.isArray(skillsArray) && skillsArray.length <= 15) {
              throw new Error("Skills array can have at most 15 skills");
            }
          },
        },
      ],
    },
  },
  { timestamps: true }
);

// compound index
userSchema.index({firstName:1,lastName:1});
userSchema.index({age:1});
// schema methods
// token generation

userSchema.methods.getJWT = async function(){
  const user = this;
  const token  = await jwt.sign({_id: user._id},"Dev@Tinder1234",{expiresIn:"7d"});
  return token;
}

// password validation
userSchema.methods.validatePassword = async function (passwordInputByUser){
  const user = this;
  const passwordHash = user.password;
  const isPasswordValidate = await bcrypt.compare(passwordInputByUser,passwordHash);
  return isPasswordValidate;
}
// const userModel = mongoose.model("User",userSchema);
// module.exports = userModel;

module.exports = mongoose.model("User", userSchema);
