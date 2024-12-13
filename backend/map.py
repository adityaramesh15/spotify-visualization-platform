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
        #val = 10
        #smoothed_matrix = matrix.copy()
        for string, mins in tracks.items():
                x = float(string.split(',')[0])
                y = float(string.split(',')[1])
                
                matrix[int(y * self.matrix_size), int(x * self.matrix_size)] += mins #* val  # (y, x) for correct image orientation
                # smoothed_matrix += gaussian_filter(matrix, sigma = val)
                # if(val != 3):
                #     val -= .25
                
                
                
        #smoothing can be removed if it is no longer needed by setting sigma to 0
        
        smoothed_matrix = gaussian_filter(matrix, sigma=self.sigma)
        normalized_matrix = smoothed_matrix - smoothed_matrix.min()
        if normalized_matrix.max() != 0:
            normalized_matrix = normalized_matrix / normalized_matrix.max()
        normalized_matrix = (normalized_matrix * 255).astype(np.uint8)

        image = Image.fromarray(normalized_matrix, mode='L')
        return image
 