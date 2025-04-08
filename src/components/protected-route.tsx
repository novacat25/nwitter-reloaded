import { Navigate } from "react-router-dom"
import { auth } from "../utils/firebase"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = auth.currentUser
    if(!user) {
        return <Navigate to="/login" />
    }
    return children
}
