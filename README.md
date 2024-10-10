# Mapify (We can change name later if needed)

## Overview

**Mapify** is a web application that provides Spotify users with a unique 3D visualization of their music listening habits. By analyzing Spotify's genre tags and user-specific listening data (danceability, energy, happiness, etc.), the app generates a 3D graph that shows music preferences spatially and over time. Users can explore their tastes and witness their Spotify Data!

---

## Project Structure

```bash
github-repo-name (need to change) /
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico (Need to add this)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   └── Graph.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── package.json
│   ├── .env
│   ├── jest.config.js
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── models.py
│   │   ├── spotify.py
│   │   ├── database.py
│   │   └── routes.py
│   ├── tests/
│   │   ├── test_models.py
│   │   ├── test_spotify.py
│   │   └── test_routes.py
│   ├── config.py
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Environment Setup

### `.env` Files

You will need to set up environment variables for both the **frontend** and **backend**. These files will store sensitive information such as API keys and should not be committed to version control.

### Frontend `.env`

In the `frontend/` directory, create a `.env` file to store environment variables for the React app.

Example:

```
REACT_APP_API_URL=http://localhost:5000
```

- `REACT_APP_API_URL`: URL of the backend service (defaults to `localhost:5000` if running locally).

### Backend `.env`

In the `backend/` directory, create a `.env` file with your Spotify API credentials.

Example:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
FLASK_ENV=development
```

- `SPOTIFY_CLIENT_ID`: Your Spotify API client ID.
- `SPOTIFY_CLIENT_SECRET`: Your Spotify API client secret.
- `SPOTIFY_REDIRECT_URI`: URI to handle the Spotify OAuth callback.
- `FLASK_ENV`: Set this to `development` for local development.

---

## Running the Project

The project is containerized using Docker. To run the entire stack (frontend + backend), follow these steps:

### Prerequisites

- Docker and Docker Compose are installed on your machine.
- A Spotify Developer account to obtain API credentials.

### Running with Docker

1. **Clone the repository** and navigate to the project root:

   ```bash
   git clone https://github.com/your-username/music-mapper.git
   ```

2. **Set up environment variables**: Create `.env` files in both `frontend/` and `backend/` directories as described above.

3. **Build and start the services**:
    
   ```bash
   docker-compose up --build
   ```

    Note: ```--build``` is only used for the first instance of running. 

4. **Access the app**:
   - Frontend: Navigate to `http://localhost:3000` in your browser.
   - Backend: API runs on `http://localhost:5000`.

---

## Testing

### Frontend Testing

- Unit tests are written with **Jest**. Run the tests with:

  ```bash
  cd frontend
  npm test
  ```

### Backend Testing

- Backend tests are written using **Pytest**. Run the tests with:

  ```bash
  cd backend
  pytest
  ```

---

## Development

### Frontend

The frontend is built using **React** and **3.js**. It visualizes the user's Spotify data as a 3D graph, allowing interaction such as panning and zooming. The frontend interacts with the backend through REST API calls.

To run the frontend locally (without Docker):

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`.

### Backend

The backend is built using **Flask** and interacts with Spotify's API to fetch user data and compute the metrics needed for visualization.

To run the backend locally (without Docker):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
python3 app.py
```

The backend will run at `http://localhost:5000`.

---