# Calculations for models here. 

#Example Heat Map below with random points

import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter
from PIL import Image


def genre_map(genres, sigma, png_size):
    # Creating a 100x100 matrix, can make larger for bigger image or to accomodate more data points
    matrix_size = png_size
    matrix = np.zeros((matrix_size, matrix_size))

    # Set 10 random positions to non-zero integers just for testing, would actually get these values from Spotify API
    np.random.seed(0)  
    num_points = len(genres)
    for key, value in genres.items():
        
        x, y = np.random.randint(0, matrix_size, size=2)
        matrix[x, y] = value

    #Apply Gaussian filter to smooth the matrix, so that 3js can create a mesh from it
    sigma_value = 5  # Adjust sigma for the desired amount of smoothing
    smoothed_matrix = gaussian_filter(matrix, sigma=sigma_value)

    # Plotting the smoothed matrix just to visualize, this step isn't necessary
    plt.figure(figsize=(8, 6))
    plt.imshow(smoothed_matrix, cmap='gray', interpolation='nearest')
    plt.colorbar(label='Intensity')
    plt.title('Smooth Gradient Heatmap')
    plt.show()
    
    # Normalize the smoothed matrix to range [0, 255]
    normalized_matrix = smoothed_matrix - smoothed_matrix.min()
    if normalized_matrix.max() != 0:
        normalized_matrix = normalized_matrix / normalized_matrix.max()
    normalized_matrix = (normalized_matrix * 255).astype(np.uint8)

    # Save the normalized matrix as a grayscale PNG
    image = Image.fromarray(normalized_matrix, mode='L')
    return image 
    
    
genres = {
    'Rock': 120,
    'Pop': 200,
    'Jazz': 80,
    'Classical': 50,
    'Hip Hop': 180,
    'Electronic': 160,
    'Country': 70,
    'Reggae': 90,
    'Blues': 60,
    'Metal': 140,
    'Latin': 110,
    'K-Pop': 170,
    'Indie': 85,
    'Folk': 65,
    'Soul': 95,
    'R&B': 105,
    'Punk': 75,
    'Alternative': 100,
    'Disco': 55,
    'Gospel': 45
}

# Adjust sigma for smoothing if necessary
image  = genre_map(genres, sigma=10, png_size=200)
image.show()