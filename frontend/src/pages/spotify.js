export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/graph"
const clientID = "";



export const loginUrl = '${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true'

