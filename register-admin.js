// Quick test script to register admin
async function registerAdmin() {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'password123',
      email: 'admin@example.com',
      fullName: 'System Admin'
    })
  });
  
  const result = await response.json();
  console.log('Admin registered:', result);
}

registerAdmin();
