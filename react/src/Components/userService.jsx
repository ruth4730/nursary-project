export const addUser = async (name, email, password) => {
  const response = await fetch("http://localhost:5000/api/user/add-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }), // עכשיו גם הסיסמה נשלחת
  });
  return response.json();
};
