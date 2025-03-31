import { useState } from "react";
import { useRouter } from "next/router";


const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/api-doc");
    }
    catch (err) {
      setError("Unexpected error occurred");
    }
  };

  return (
    <div id="login-form">
      <h1>Login</h1>
      <form onSubmit={ handleSubmit }>
        <label>Email</label>
        <input
          type="email"
          placeholder="neo@matrix.com"
          value={ email }
          onChange={(e) => setEmail(e.target.value)}
          required/>
        <label>Password</label>
        <input
          type="password"
          placeholder="Matrix1999!"
          value={ password }
          onChange={(e) => setPassword(e.target.value)}
          required/>
        <div id="submit-button">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

