const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, gender, age, skills } =
    req.body;

  // Manual validation
  if (
    typeof firstName !== "string" ||
    firstName.length < 2 ||
    firstName.length > 50
  ) {
    throw new Error("Invalid first name");
  }

  if (
    typeof lastName !== "string" ||
    lastName.length < 2 ||
    lastName.length > 50
  ) {
    throw new Error("Invalid last name");
  }

  const emailRegex = /.+\@.+\..+/;
  if (typeof emailId !== "string" || !emailRegex.test(emailId)) {
    throw new Error("Invalid email");
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (gender) {
    const allowedGenders = ["male", "female", "other"];
    if (!allowedGenders.includes(gender)) {
      throw new Error("Invalid gender");
    }
  }

  if (age) {
    if (typeof age !== "number" || age < 18 || age > 100) {
      throw new Error("Age must be between 18 and 100");
    }
  }

  if (skills) {
    if (
      !Array.isArray(skills) ||
      skills.length < 1 ||
      skills.length > 5 ||
      !skills.every((skill) => typeof skill === "string")
    ) {
       throw new Error("Skills must be an array with 1 to 5 strings");
    }
  }
};

module.exports = {
  validateSignUpData,
};
