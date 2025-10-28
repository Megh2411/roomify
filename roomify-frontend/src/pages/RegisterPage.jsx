import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom' 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Footer from '../components/Footer'; // <-- IMPORTED FOOTER

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) { 
      setError("Password must be at least 6 characters")
      return
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users",
        {
          name, 
          email,
          password,
        }
      )

      localStorage.setItem("userToken", data.token)
      localStorage.setItem("userInfo", JSON.stringify(data))

      // Default redirect to the booking page for new guests
      navigate("/book") 

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    }
  }

  return (
    // 1. Added flex-col to push the footer down, applied dark mode classes
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 2. Content wrapper: flex-grow ensures this section takes up all available space */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Roomify</h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create your account</CardTitle>
            </CardHeader>
            <form onSubmit={submitHandler}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Create Account</Button>
              </CardFooter>
            </form>
            <CardContent className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-medium hover:underline">Login here</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer /> {/* 3. FOOTER PLACEMENT */}
    </div>
  )
}