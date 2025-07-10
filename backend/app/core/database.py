"""
Database connection and session management for Wayne Enterprises Dashboard
"""
import os
from typing import Generator
import pandas as pd
from pathlib import Path

from app.core.config import settings

class DataLoader:
    """Utility class for loading and caching datasets"""
    
    def __init__(self):
        self._cache = {}
        
    def load_dataset(self, filename: str, use_cache: bool = True) -> pd.DataFrame:
        """
        Load a dataset from the data directory with optional caching.
        
        Args:
            filename: Name of the dataset file (e.g., 'financial_data.csv')
            use_cache: Whether to use cached data if available
            
        Returns:
            pd.DataFrame: The loaded dataset
        """
        if use_cache and filename in self._cache:
            return self._cache[filename]
            
        filepath = Path(settings.DATA_DIR) / filename
        if not filepath.exists():
            raise FileNotFoundError(f"Dataset file not found: {filepath}")
            
        # Determine file type and load accordingly
        if filepath.suffix.lower() == '.csv':
            df = pd.read_csv(filepath)
        elif filepath.suffix.lower() == '.json':
            df = pd.read_json(filepath)
        else:
            raise ValueError(f"Unsupported file format: {filepath.suffix}")
            
        if use_cache:
            self._cache[filename] = df
            
        return df
    
    def clear_cache(self):
        """Clear the dataset cache"""
        self._cache.clear()


# Create a singleton instance
data_loader = DataLoader()

# Function to get the data loader
def get_data_loader() -> DataLoader:
    return data_loader
