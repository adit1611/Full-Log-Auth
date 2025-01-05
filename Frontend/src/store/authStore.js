// import { verify } from "crypto";
import {create} from "zustand";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    // Signup method
    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });  // Set loading state
        // console.log("Signup Payload:", { email, password, name });
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
                credentials: 'include', // Send cookies with the request
            });

            // If the response is not okay, handle the error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error signing up');
            }

            const responseData = await response.json();
            console.log('Response Data:', responseData);  // Log to see the full response

            // Set user data in the store
            set({ user: responseData.user, isAuthenticated: true, isLoading: false });
            const users = responseData.user;
            console.log(users);
            
        } catch (error) {
            // Handle any errors and update store state
            set({ error: error.message || 'Error signing up', isLoading: false });
            throw error;
        }
    },
            
            
    // Verify email method
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error verifying email");
            }
    
            const responseData = await response.json();
            set({ user: responseData.user, isAuthenticated: true, isLoading: false });
            return responseData;
        } catch (error) {
            set({ error: error.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },
    

    // Check authentication method
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await fetch(`${API_URL}/check-auth`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensures cookies are sent with the request
            });
    
            if (!response.ok) {
                throw new Error("Failed to authenticate");
            }
    
            const responseData = await response.json();
            set({ user: responseData.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: error.message || "Authentication failed", isCheckingAuth: false, isAuthenticated: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });  // Set loading state
        // console.log("Signup Payload:", { email, password, name });
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Send cookies with the request
            });

            // If the response is not okay, handle the error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error signing up');
            }

            const responseData = await response.json();
            
            // Set user data in the store
            set({ isAuthenticated: true,user: responseData.user, isLoading: false, error:null });
            
            
        } catch (error) {
            // Handle any errors and update store state
            set({ error: error.response?.data?.message || 'Error in logging in', isLoading: false });
            throw error;
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include", // Include cookies in the request (if necessary)
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                // Throw an error if the response status is not successful
                throw new Error("Error logging out");
            }
    
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Ensures JSON data is sent
                },
                body: JSON.stringify({ email }), // Converts the email payload to JSON
            });
    
            if (!response.ok) {
                // Check if the response status is not in the success range (200-299)
                const errorData = await response.json();
                throw new Error(errorData.message || "Error sending reset password email");
            }
    
            // Extract response data
            const data = await response.json();
    
            set({ message: data.message, isLoading: false }); // Use the message from the response
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || "Error sending reset password email",
            });
            throw error;
        }
    },
    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
    
        try {
            // Send the reset password request with fetch
            const response = await fetch(`${API_URL}/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                },
                body: JSON.stringify({ password }), // Convert the password to JSON format
            });
    
            // Check if the response status is not OK
            if (!response.ok) {
                const errorData = await response.json(); // Parse the error response
                throw new Error(errorData.message || "Error resetting password");
            }
    
            // Parse the successful response
            const data = await response.json();
    
            set({ message: data.message, isLoading: false }); // Update the message and isLoading state
        } catch (error) {
            // Handle the error and update the state
            set({
                isLoading: false,
                error: error.message || "Error resetting password",
            });
            throw error; // Re-throw the error to handle it elsewhere if needed
        }
    }
       
}));