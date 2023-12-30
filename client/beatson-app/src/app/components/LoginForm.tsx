"use client"

import { FormEvent, useState} from "react"

export default function LoginForm(){

  const [isLoading,setLoading] = useState<boolean>(false)

  async function onFormSubmit(event : FormEvent<HTMLFormElement>) {
    
    event.preventDefault()
    setLoading(true) // disables the button so the user dosent submit multiple times

    try{
      // Converts Form data to Object, which can be passed as a JSON
      const formData = Object.fromEntries(new FormData(event.currentTarget).entries())
      
      const resp = await fetch("http://127.0.0.1:2020/login", {
        method : 'POST',
        mode : 'cors',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(formData) 
      })

      if(!resp.ok){
        throw new Error("Post Failed :( ")
      }
      const data = await resp.json()
      console.log(data)

    }catch(error){
      console.log(error)
    }finally{
      setLoading(false)
    }

  }

  return (
    <form onSubmit={e => onFormSubmit(e)}>
      <label htmlFor="uname">Username</label>
      <input type="text" name="uname">
      </input>
      <br></br>
      <label htmlFor="uname">Password</label>
      <input type="password" name="pword">
      </input>
      <br></br>
      <button type="submit" disabled={isLoading}>submit</button>
    </form>
  )
}