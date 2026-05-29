function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-image">
          <div className="auth-image-overlay">
            <h2>Explore smarter</h2>
            <p>Plan your next journey with weather, budget and local tips.</p>
          </div>
        </div>

        <div className="auth-form">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Log in to continue planning your trip.</p>

          <form>
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>

            <label>
              Password
              <input type="password" placeholder="••••••••" />
            </label>

            <button type="submit">Log in</button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <a href="/register">Create one</a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;