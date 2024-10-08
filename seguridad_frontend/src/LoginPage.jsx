import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom";

export const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual login API call
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, received token:', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user))
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        console.error('Login failed:', errorData);
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex max-h-screen">
      <div className="hidden lg:block relative min-w-[1000px] h-screen bg-no-repeat bg-cover bg-[center_top_-8rem] border-r-4" style={{ backgroundImage: `url(/background_login.png)` }}>
      </div>

      <div className="w-full lg:min-w-2/3 p-8 flex flex-col justify-center items-center bg-cover bg-center h-screen" style={{ backgroundImage: `url(/background.png)` }}>
        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold mb-6 primary-text text-center">¡Bienvenido (a)!</h1>
          <p className="mb-6 font-bold secondary-text text-center">Para iniciar sesión, por favor introduce tus datos.</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="user" className="font-bold">Usuario</Label>
              <Input
                id="username"
                className="bg-[#f3f3f3] border-4 border-[#f3f3f3] rounded-lg"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password" className="font-bold">Contraseña</Label>
              <Input
                id="password"
                type="password"
                className="bg-[#f3f3f3] border-4 border-[#f3f3f3] rounded-lg"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex w-full justify-center items-center">
              <Button
                type="submit"
                variant="outline"
                className="flex flex-row w-50 justify-center h-[50px] items-center button-gradient"
              >
                <img src="/icon_login.png" alt="registro" width="50px" />
                <span className="primary-text">Ingresar</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}