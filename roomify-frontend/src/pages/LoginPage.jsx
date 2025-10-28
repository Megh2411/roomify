import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Footer from '../components/Footer'; // <-- IMPORTED FOOTER

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Fallback for safety
      const { data } = await axios.post(
       `${API_BASE_URL}/api/users/login`, // Use the variable
        {
          email,
          password,
        }
      )

      localStorage.setItem("userToken", data.token)
      localStorage.setItem("userInfo", JSON.stringify(data))

      // Conditional redirect based on role
      const role = data.role;
      if (role === 'Admin') {
          navigate("/dashboard");
      } else if (role === 'Receptionist') {
          navigate("/staff/reception");
      } else if (role === 'Housekeeping') {
          navigate("/staff/housekeeping");
      } else {
          navigate("/book"); 
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    }
  }

  return (
    // Applied flex-col to push the footer down and dark mode classes
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Content wrapper: flex-grow ensures this section takes up all available space */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Roomify</h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign in to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                )}

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer /> {/* <-- FOOTER PLACEMENT */}
    </div>
  )
}