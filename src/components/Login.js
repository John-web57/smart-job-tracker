import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const getFriendlyError = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already in use. Try signing in instead.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Authentication yet.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Your email or password is incorrect.";
    case "auth/account-exists-with-different-credential":
      return "That email is already linked to a different sign-in method.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup. Allow popups and try again.";
    case "auth/popup-closed-by-user":
      return "The sign-in popup was closed before finishing.";
    case "auth/unauthorized-domain":
      return "This website domain is not authorized in Firebase Authentication.";
    default:
      return "Authentication failed. Please try again.";
  }
};

const Login = () => {
  const [mode, setMode] = React.useState("signin");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setIsSigningIn(true);
    setError("");

    try {
      if (mode === "signup") {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          form.email.trim(),
          form.password
        );

        if (form.name.trim()) {
          await updateProfile(credentials.user, {
            displayName: form.name.trim(),
          });
        }
      } else {
        await signInWithEmailAndPassword(
          auth,
          form.email.trim(),
          form.password
        );
      }
    } catch (authError) {
      console.error("Email authentication failed:", authError);
      setError(getFriendlyError(authError.code));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (signInError) {
      console.error("Google sign-in failed:", signInError);
      setError(getFriendlyError(signInError.code));
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-eyebrow">Firebase Login</p>
        <h1>{mode === "signin" ? "Sign in to your job tracker" : "Create your account"}</h1>
        <p className="auth-copy">
          Keep your applications private and synced with Firebase Authentication.
        </p>
        <form className="auth-form" onSubmit={handleEmailAuth}>
          {mode === "signup" ? (
            <label className="auth-field">
              <span>Full name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </label>
          ) : null}
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>
          <button className="auth-button" type="submit" disabled={isSigningIn}>
            {isSigningIn
              ? "Please wait..."
              : mode === "signin"
                ? "Sign in with email"
                : "Create account"}
          </button>
        </form>
        <div className="auth-divider" aria-hidden="true">
          <span>or</span>
        </div>
        <button
          className="auth-button auth-button-secondary"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? "Signing in..." : "Continue with Google"}
        </button>
        {error ? <p className="auth-error">{error}</p> : null}
        <p className="auth-switch">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            className="auth-link"
            type="button"
            onClick={() => {
              setMode((currentMode) =>
                currentMode === "signin" ? "signup" : "signin"
              );
              setError("");
            }}
          >
            {mode === "signin" ? "Create an account" : "Sign in instead"}
          </button>
        </p>
      </section>
    </main>
  );
};

export default Login;
