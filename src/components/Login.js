const Login = ({username, setUsername, password, setPassword}) => (
  <>
    <h2>log in to app</h2>
    <p>username 
      <input type="text" value={username} 
      name="Username"
      onChange={({ target }) => setUsername(target.value)}/>
    </p>
    <p>password
      <input type="password" value={password} 
      name="Password"
      onChange={({ target }) => setPassword(target.value)}/>
    </p>
    <button type="submit">login</button>
  </>
)

export default Login