const api = (() => {
   const BASE_URL = 'https://openspace-api.netlify.app/v1';

   async function _fetchWithAuth(url, options = {}) {
      return fetch(url, {
         ...options,
         headers: {
            ...options.headers,
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
         },
      });
   }

   function putAccessToken(token) {
      localStorage.setItem('accessToken', token);
   }

   function getAccessToken() {
      localStorage.getItem('accessToken');
   }

   async function register({id, name, password }) {
      const response = await fetch(`${BASE_URL}/users`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            id,
            name,
            password
         }),
      })

      const responseJson = await response.json();
      const { status, message } = responseJson;

      if (status !== 'success') {
         throw new Error(message);
      }

      const { data: { user } } = responseJson;

      return user;
   }

   async function login({ id, password }) {
      const response = await fetch(`${BASE_URL}/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            id,
            password,
         }),
      });

      const responseJson = await response.json();
      const { status, message } = responseJson;

      if (status !== 'success') {
         throw new Error(message);
      }

      const { data: { token } } = responseJson;
      return token;
   }

   async function getOwnProfile() {
      const response = await _fetchWithAuth(`${BASE_URL}/users/me`);

      const responseJson = await response.json();

      const { status, message } = responseJson;

      if (status !== 'success') {
         throw new Error(message);
      }

      const { data: { user } } = responseJson;
      
      return user;
   }

   return {
      putAccessToken,
      getAccessToken,
      getOwnProfile,
      register,
      login
   }
})();

export default api;
