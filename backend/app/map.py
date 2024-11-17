import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter
from PIL import Image


class GenreMap:
    def __init__(self, matrix_size=100, sigma=5):
        self.matrix_size = matrix_size
        self.sigma = sigma
        
    
    def generate_map(self, genres):
        matrix = np.zeros((self.matrix_size, self.matrix_size))
        
        np.random.seed(0)
        for _, value in genres.items():
            x, y = np.random.randint(0, self.matrix_size, size=2)
            matrix[x, y] = value
        
        smoothed_matrix = gaussian_filter(matrix, sigma=self.sigma)

        normalized_matrix = smoothed_matrix - smoothed_matrix.min()
        if normalized_matrix.max() != 0:
            normalized_matrix = normalized_matrix / normalized_matrix.max()
        normalized_matrix = (normalized_matrix * 255).astype(np.uint8)

        image = Image.fromarray(normalized_matrix, mode='L')
        return image
 