export const BASE_URL = 'https://api.anastasiasikidina.nomoredomains.work';

export const register = (email, password)=>{
  return fetch(`${BASE_URL}/signup`,{
      method: "POST",
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "email": email,
          "password": password
          })
  }).then(_checkResponse)
}

export const login = (email, password)=>{
  return fetch(`${BASE_URL}/signin`,{
      method: "POST",
      headers:{
          "Content-Type":"application/json"
      },
      body: JSON.stringify({
          "email": email,
          "password": password
           })
  }).then(_checkResponse)
      .then((data) => {
          if (data.token){
              localStorage.setItem('jwt', data.token);
              return data;
          }
      })

}

export const checkToken  = (jwt)=>{
  return fetch(`${BASE_URL}/users/me`,{
      method: "GET",
      headers:{
          "Content-Type":"application/json",
          "Authorization" : `Bearer ${jwt}`
      },
  }).then(_checkResponse)
}

function _checkResponse (res) {
    if (res.ok) { 
        return res.json() 
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }