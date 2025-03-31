import { useState } from "react";
import { useRouter } from "next/router";

import "@/public/styles/global.scss";


const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(emailRegex.test(value) ? null : "Format d'email invalide !");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
        setError(data.error || "Échec de la connexion !");

        return;
      }

      router.push("/api-doc");
    }
    catch (err) {
      setError("Une erreur inattendue est survenue !");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div id="login-form">
        <h1>Login</h1>
        <form onSubmit={ handleSubmit }>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={ email }
            onChange={ handleEmailChange }
            aria-describedby="email-help"
            required/>
          <p id="email-help" className="sr-only">Saisissez votre email</p>
          <p className={`error-message ${emailError ? "visible" : ""}`}>{ emailError }</p>

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={ password }
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-help"
            required/>
          <p id="password-help" className="sr-only">Saisissez votre mot de passe</p>

          <div id="login-button">
            <button
              type="submit"
              aria-label="Bouton de connexion à la documentation Swagger"
              disabled={ !email || !password }
              aria-disabled={ !email || !password }
              aria-busy={ isLoading }>Se connecter
            </button>
          </div>

        </form>
      </div>
      {/* {error && <p className="error-message">{error}</p>} */}
    </main>
  );
};

export default LoginPage;
