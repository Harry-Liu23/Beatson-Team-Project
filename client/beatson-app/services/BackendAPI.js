export default async function postFormAsJSON(event, url){

  event.preventDefault();
  const formData = new FormData(event.target)
  const userData = Object.fromEntries(formData.entries())

  /* sends POST request to server with user data */

  const request = await fetch(url, {
          method : 'POST',
          mode : 'cors',
          body : JSON.stringify(userData),
          headers : {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : 'http://localhost:2020'
          }
      })

      if( request.ok){
        console.log('Request ok')
        return request
      }

      return null

}