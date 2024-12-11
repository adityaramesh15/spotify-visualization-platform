import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter
from PIL import Image



class GenreMap:
    def __init__(self, matrix_size=100, sigma=5):
        self.matrix_size = matrix_size
        self.sigma = sigma
        
    
    def generate_map(self, tracks):
        matrix = np.zeros((self.matrix_size, self.matrix_size))
        
        for string, mins in tracks.items():
                x = float(string.split(',')[0])
                y = float(string.split(',')[1])
                matrix[int(y * self.matrix_size), int(x * self.matrix_size)] += mins  # (y, x) for correct image orientation
                
                
        #smoothing can be removed if it is no longer needed by setting sigma to 0
        
        smoothed_matrix = gaussian_filter(matrix, sigma=self.sigma)

        normalized_matrix = smoothed_matrix - smoothed_matrix.min()
        if normalized_matrix.max() != 0:
            normalized_matrix = normalized_matrix / normalized_matrix.max()
        normalized_matrix = (normalized_matrix * 255).astype(np.uint8)

        image = Image.fromarray(normalized_matrix, mode='L')
        return image
 