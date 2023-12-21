 "use client"
import { useEffect,useState } from "react"

export default function Home() {
  
  const [msg,setMsg] = useState("Loading...")
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/home")
    .then(
      (response) => response.json()
    ).then(
      (data) => setMsg(data.messgae) 
    )
  },[])
  
  
  return (
    <main>
      <h2>{msg}</h2>
    </main>
  )
}
