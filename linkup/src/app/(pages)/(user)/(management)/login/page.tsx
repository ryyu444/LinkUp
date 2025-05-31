"use client";

import { AuthContext } from "@/app/(pages)/_contexts/AuthContext";
import { useContext } from "react";

/*
    Corresponds to Login page in Figma
    1. Similar to register. Check that page.tsx for register implementation
    2. Differences: Pass in "login" for method
*/
export default function Login() {
    const { login } = useContext(AuthContext);
    return <div>login</div>;
}