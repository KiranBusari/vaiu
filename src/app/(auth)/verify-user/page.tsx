"use client"
import { Button } from "@/components/ui/button";
import axios from "axios";

const page =()=> {
  const verifyUser =async ()=>{
    const token = await axios.post('http://localhost:3000/api/v1/auth/verify')
    console.log(token);
  }
  return(
    <div className='h-screen flex items-center justify-center'>
      <div>Verification Page</div>
      <div><Button onClick={verifyUser}>Verify</Button></div>
    </div>
  )
}
export default page;