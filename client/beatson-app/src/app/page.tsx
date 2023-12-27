 "use client"
import { Dispatch, SetStateAction, useEffect,useState } from "react"

function sendMessageToAPI(newMessage: String, setMsg : Dispatch<SetStateAction<string>>){
  console.log("attempting to send new message: " + newMessage)

  const newMsgResult = fetch("http://127.0.0.1:8080/api/home", {
    method : "POST",
    mode : 'cors',
    headers :{
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Origin' : 'http://localhost:8080/'
    },

    body : JSON.stringify({ 'message' : newMessage})
  }).then(
    response => response.json())
  .then(
    data => {
      setMsg(data.message)
      console.log(data)
    }
  )
}

export default function Home() {
  
  const [msg,setMsg] = useState("Loading...")
  const [newMsg, setNewMsg] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/home", {
      method: "GET"
    })
    .then(
      (response) => response.json()
    ).then(
      (data) => {
        console.log(data)
        setMsg(data.message)
      }
    )
    
  },[])
  
  return (
    <main>
      <h2>The current messge is : {msg}</h2>
      <input name="newMessageBox" onChange={e => setNewMsg(e.target.value)}></input>
      <button 
      value="newMessage"
      onClick={() => {
        sendMessageToAPI(newMsg, setMsg)
      }}>new message</button>
      
    </main>
  )
}
