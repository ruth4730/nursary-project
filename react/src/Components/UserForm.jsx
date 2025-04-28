import { useState } from "react";
import { addUser } from "./userService";
import { TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";

const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const validateEmail = (email) => {
    return email.includes("@") && email.endsWith("gmail.com");
  };

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    let newErrors = { name: "", email: "", password: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email. Must contain @ and end with gmail.com";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 4 characters long";
    }

    setErrors(newErrors);
    console.log(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return; // לא שולח את הנתונים אם יש שגיאות
    }

    addUser(name, email, password);
    alert("User added!");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        error={!!errors.password}
        helperText={errors.password}
      />
      <Button type="submit" variant="contained" color="primary">
        Add User
      </Button>
    </form>
  );
};

export default UserForm;
