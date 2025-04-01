import { useEffect, useState } from "react";
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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordCriteriaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;
  const passwordLengthRegex = /^.{8,}$/;

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (value && !emailRegex.test(value)) {
        setEmailError("Invalid email format !");
        setIsEmailValid(false);
      }
      else {
        setEmailError(null);
        setIsEmailValid(true);
      }
    }, 2000);

    setTypingTimeout(newTimeout);
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (!passwordCriteriaRegex.test(value) || !passwordLengthRegex.test(value)) {
      setIsPasswordValid(false);
      setPasswordError("Lowercase, uppercase, number and special character required !");
    }
    else {
      setIsPasswordValid(true);
      setPasswordError(null);
    }

    const newTimeout = setTimeout(() => {
      if (!passwordCriteriaRegex.test(value)) {
        setPasswordError("Lowercase, uppercase, number and special character required !");
      }
      else if (!passwordLengthRegex.test(value)) {
        setPasswordError("Password must be at least 8 characters long !");
      }
    }, 2000);

    setTypingTimeout(newTimeout);
  };

  const handleEmailBlur = () => {
    if (!email) setEmailError(null);
  };

  const handlePasswordBlur = () => {
    if (!password) setPasswordError(null);
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
        setError(data.error || "Login failed !");

        return;
      }

      router.push("/api-doc");
    }
    catch (err) {
      setError("An unexpected error has occurred !");
    }
    finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !email || !password || !isEmailValid || !isPasswordValid;

  return (
    <main>
      <div id="login-form" className={ isMounted ? "fadeInDown" : "" }>
        <h1>Login</h1>
        <form onSubmit={ handleSubmit } noValidate>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            autoComplete="off"
            value={ email }
            onChange={ handleEmailChange }
            onBlur={ handleEmailBlur }
            aria-describedby="email-help"
            required/>
          <p id="email-help" className="sr-only">Enter your email</p>
          <p className={`error-message ${ emailError ? "visible" : "" }`}>{ emailError }</p>

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="off"
            value={ password }
            onChange={ handlePasswordChange }
            onBlur={ handlePasswordBlur }
            aria-describedby="password-help"
            required/>
          <p id="password-help" className="sr-only">Enter your password</p>
          <p className={`error-message ${ passwordError ? "visible" : "" }`}>{ passwordError }</p>

          <div id="login-button">
            <button
              type="submit"
              aria-label="Swagger documentation login button"
              disabled={ isButtonDisabled }
              aria-disabled={ isButtonDisabled }
              aria-busy={ isLoading }>Connect
            </button>
          </div>

        </form>
      </div>
      <div id="login-error-container">
        { error && <p className="api-error-message">{ error }</p> }
      </div>
    </main>
  );
};

export default LoginPage;
