function SignUpPage() {
  return (
    <div>
      <h1>Sign Up</h1>
      <label htmlFor="username">Username</label>
      <input id="username" />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
      <label htmlFor="password-repeat">Password Repeat</label>
      <input id="password-repeat" type="password" />
      <button disabled>Sign Up</button>
    </div>
  );
}

export default SignUpPage;
