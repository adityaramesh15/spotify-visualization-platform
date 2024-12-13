# Mapify

## Introduction
**Mapify** is a web application that provides Spotify users with a unique 3D visualization of their music listening habits. By analyzing Spotify's genre tags and user-specific listening data (danceability, energy, happiness, etc.), the app generates a 3D graph that shows music preferences spatially and over time. Users can explore their tastes and witness their Spotify data in a novel, interactive way.

---

## Technical Architecture
Mapify follows a modular architecture with distinct layers for frontend, backend, and infrastructure. Below is an outline:

### Frontend
- Built with **React** and **Three.js** for interactive visualizations.
- Fetches user data via REST API from the backend.

### Backend
- Built with **Flask** for handling API requests and integrating with Spotify's API.
- Processes user data, including metrics like danceability and genre tags, to prepare for visualization.

### Database
- SQLite through SQL Alchemy
- Stores user session data, preferences, or cached Spotify data.

### Infrastructure
- Containerized with **Docker**.
- **Docker Compose** orchestrates frontend and backend services.

---

## Developers
Below is a list of contributors and their roles:


- **Owen Siemons**: Frontend Routing and UI Design
- **Eero Dunham**: 3D Graphics, Shaders, and UI Design
- **Aditya Ramesh**: Spotify API, Flask Routing, and Database.
- **Ali Hussain**: Data Mapping and Visualizations.

---

## Environment Setup

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Spotify Developer account to obtain API credentials.

### Environment Variables
You need `.env` files for both the **frontend** and **backend** to store sensitive information like API keys. These files should not be committed to version control.

#### Frontend `.env`
In the `frontend/` directory, create a `.env` file with the following structure:

```env
REACT_APP_SPOTIFY_CLIENT_ID=<your_spotify_client_id>
```

#### Backend `.env`
In the `backend/` directory, create a `.env` file with the following structure:

```env
SPOTIFY_CLIENT_ID=<your_spotify_client_id>
SPOTIFY_CLIENT_SECRET=<your_spotify_client_secret>
```

---

## Development

### Frontend
The frontend is built using **React** and **3.js**. It visualizes the user's Spotify data as a 3D graph, allowing interaction such as panning and zooming.

To run the frontend locally (without Docker):
```bash
cd frontend
npm install
npm start
```
The app will be available at `http://localhost:3000`.

### Backend
The backend is built using **Flask**. It fetches user data from Spotify's API and processes metrics needed for visualization.

To run the backend locally (without Docker):
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
The backend will run at `http://localhost:5050`.

---

## Running the Project

To run the project with Docker:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/main-project-group-60-1
.git
   ```
2. **Set up environment variables**:
   Create `.env` files in both `frontend/` and `backend/` directories as described above.
3. **Build and start the services**:
   ```bash
   docker-compose up --build
   ```
   Note: Use `--build` only for the first run or if dependencies change.
4. **Access the app**:
   - Frontend: Navigate to `http://localhost:3000`.
   - Backend: API runs on `http://localhost:5050`.

---

## Package Management

### Frontend
The frontend uses **npm** for package management. Common commands include:
- Install dependencies: `npm install`
- Add a package: `npm install <package-name>`
- Remove a package: `npm uninstall <package-name>`

### Backend
The backend uses **pip** and a `requirements.txt` file to manage dependencies. Common commands include:
- Install dependencies: `pip install -r requirements.txt`
- Add a package: `pip install <package-name>` and update `requirements.txt` using `pip freeze > requirements.txt`.
- Remove a package: Uninstall it using `pip uninstall <package-name>` and update `requirements.txt`.

---

## Contribution
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed explanation of your changes.

Please ensure your code adheres to our style guidelines and passes all tests before submitting.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
