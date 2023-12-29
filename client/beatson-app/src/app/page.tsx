 "use client"
import { Dispatch, SetStateAction, use, useEffect,useState } from "react"

export default function Home() {
  
  const [msg,setMsg] = useState("Loading...")

  useEffect(() =>{
    fetch("http://127.0.0.1:2020/").then(
      (resp) => resp.json()
    ).then(
      (data) => {
        console.log(data)
        setMsg(data.message)
      }
    )
  },[])
  return (
    <main>
      <h2>{msg}</h2>
    </main>
  )
}
