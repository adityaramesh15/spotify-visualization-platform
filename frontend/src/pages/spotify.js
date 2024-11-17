export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000/graph"
const clientID = "558fad49211e4702a3505295e6a45860"
//const clientID = process.env.SPOTIFY_CLIENT_ID

const scopes = [
    "user-library-read",
    "user-top-read"
]



export const loginUrl = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`

