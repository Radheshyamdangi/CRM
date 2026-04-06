const Employee = require('../models/Employee');

// 1. Naya employee add karna
exports.addEmployee = async (req, res) => {
    try {
        const { name, email, password, phone, position, role } = req.body;

        // Check if employee already exists
        const exists = await Employee.findOne({ email });
        if (exists) return res.status(400).json({ message: "Employee already exists with this email" });

        // Naya employee object
        const newEmployee = new Employee({
            name,
            email,
            password, // Password hash model level pe 'pre-save' se hoga
            phone,
            position,
            role: role || 'employee'
        });

        await newEmployee.save();
        res.status(201).json({ success: true, message: "Employee created!", data: newEmployee });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// 2. Saare employees ki list dikhana
exports.getEmployees = async (req, res) => {
    try {
        const list = await Employee.find();
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Check karein ki employee database mein hai ya nahi
        const employee = await Employee.findById(id);
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // 2. Employee ko delete karein
        await Employee.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {
        // 3. Agar ID galat format mein ho ya server error aaye
        next(error); 
    }
};