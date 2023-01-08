const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/details", async (req, res) =>  {
	try {
	  const data = await User.find();
	  res.status(201).json(data);
	} catch (error) {
	  console.log(error.message);
	}
  })

  router.get("/details/:id", async (req, res) =>  {
	try {
	  const data = await User.findOne({ _id: req.params.id });
	  res.status(201).json(data);
	} catch (error) {
	  console.log(error.message);
	}
  })
  
  router.put("/details/:id", async (req, res) =>  {
	const { errors, isValid } = ValidateUser(req.body);
	try {
	  if (!isValid) {
		res.status(404).json(errors);
	  } else {
		const data = await User.findOneAndUpdate(
		  { _id: req.params.id },
		  req.body,
		  { new: true }
		);
		res.status(201).json(data);
	  }
	} catch (error) {
	  console.log(error.message);
	}
  })
  
  router.delete("/details/:id", async (req, res) =>  {
	try {
	  await User.deleteOne({ _id: req.params.id });
	  res.status(201).json({ message: "User deleted with success" });
	} catch (error) {
	  console.log(error.message);
	}
  })
  

module.exports = router;