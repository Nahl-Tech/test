import user from "../models/user.model.js";

const insertBacklinks = async (req, res) => {
    try {
        const newUser = await user.create(req.body);

        if (!newUser) {
            return res.status(400).json({ message: "Record Not Inserted" });
        }

        res.status(201).json(newUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Function to fetch all users
const fetchUsers = async (req, res) => {
    try {
        const users = await user.find();  // Fetch all users
        if (!users) {
            return res.status(404).json({ message: "No Users Found" });
        }
        res.status(200).json({
            message: "Succesfull",
            user: users.length,
            users
        });  // Send users as response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export default {
    insertBacklinks,
    fetchUsers
};
