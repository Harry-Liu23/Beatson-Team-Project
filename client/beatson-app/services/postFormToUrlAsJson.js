export default async function postFormToUrlAsJson(event, url){

  event.preventDefault();
  const formData = new FormData(event.target)
  const userData = Object.fromEntries(formData.entries())

  /* sends POST reqest to server with user data */

  const reqest = await fetch(url, {
          method : 'POST',
          mode : 'cors',
          body : JSON.stringify(userData),
          headers : {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : 'http://localhost:2020'
          }
      })

      if( reqest.ok){
        console.log('Request ok')
        return reqest
      }

      return null

}