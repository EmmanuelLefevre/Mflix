import { useState } from "react";
import { useRouter } from "next/router";

import "@/public/styles/globals.css";
import "@/public/styles/global.scss";


const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordCriteriaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;
  const passwordLengthRegex = /^.{8,}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(null);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (value && !emailRegex.test(value)) {
        setEmailError("Format d'email invalide !");
      }
    }, 3000);

    setTypingTimeout(newTimeout);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(null);

    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      if (!passwordCriteriaRegex.test(value)) {
        setPasswordError("Minuscule, majuscule, chiffre et caractère spécial !");
      } else if (!passwordLengthRegex.test(value)) {
        setPasswordError("8 caractères minimum !");
      }
    }, 3000);

    setTypingTimeout(newTimeout);
  };

  const handleEmailBlur = () => {
    if (!email) setEmailError(null);
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
            onBlur={ handleEmailBlur }
            aria-describedby="email-help"
            required/>
          <p id="email-help" className="sr-only">Saisissez votre email</p>
          <p className={`error-message ${ emailError ? "visible" : "" }`}>{ emailError }</p>

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={ password }
            onChange={ handlePasswordChange }
            aria-describedby="password-help"
            required/>
          <p id="password-help" className="sr-only">Saisissez votre mot de passe</p>
          <p className={`error-message ${ passwordError ? "visible" : "" }`}>{ passwordError }</p>

          <div id="login-button">
            <button
              type="submit"
              aria-label="Bouton de connexion à la documentation Swagger"
              disabled={ !email || !password || !!emailError || !!passwordError }
              aria-disabled={ !email || !password }
              aria-busy={ isLoading }>Se connecter
            </button>
          </div>

        </form>
      </div>
      <div id="login-error-container">
        { error && <p className="api-error-message">{error}</p> }
      </div>
    </main>
  );
};

export default LoginPage;
