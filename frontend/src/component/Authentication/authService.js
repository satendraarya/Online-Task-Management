// src/components/Authentication/authService.js
import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/refresh-token',
      {},
      {
        withCredentials: true,
      }
    );

    const { token } = response.data;

    // Assuming the token is stored in a cookie named 'accessToken'
    Cookies.set('accessToken', token);

    console.log('Access token refreshed successfully:', token);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; // Rethrow the error to be caught in the component
  }
};

export { refreshAccessToken };





// // authService.js
// import axios from 'axios';

// export const refreshAccessToken = async () => {
//   try {
//     const response = await axios.post(
//       'http://localhost:8080/api/refresh-token',
//       {},
//       {
//         withCredentials: true,
//       }
//     );

//     // Update your authentication state with the new access token
//     // ...

//     // Retry the original request that failed due to an expired token
//     // ...

//     return response.data; // Assuming your refresh token endpoint returns the new access token
//   } catch (error) {
//     console.error('Error refreshing access token:', error);
//     // Handle the error, e.g., redirect to the login page
//     throw error;
//   }
// };
