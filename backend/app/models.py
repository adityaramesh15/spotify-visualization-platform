# Calculations for models here. 

#Example Heat Map below with random points

import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter

# Creating a 100x100 matrix, can make larger for bigger image or to accomodate more data points
matrix_size = 100
matrix = np.zeros((matrix_size, matrix_size))

# Set 10 random positions to non-zero integers just for testing, would actually get these values from Spotify API
np.random.seed(0)  
num_points = 10
for _ in range(num_points):
    x, y = np.random.randint(0, matrix_size, size=2)
    matrix[x, y] = np.random.randint(1, 10)

#Apply Gaussian filter to smooth the matrix, so that 3js can create a mesh from it
sigma_value = 5  # Adjust sigma for the desired amount of smoothing
smoothed_matrix = gaussian_filter(matrix, sigma=sigma_value)

# Plotting the smoothed matrix just to visualize, this step isn't necessary
plt.figure(figsize=(8, 6))
plt.imshow(smoothed_matrix, cmap='hot', interpolation='nearest')
plt.colorbar(label='Intensity')
plt.title('Smooth Gradient Heatmap')
plt.show()