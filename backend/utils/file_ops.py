import os
import shutil

def save_uploaded_file(file_storage, destination_folder, filename=None):
    """
    Saves uploaded file to the destination folder.
    If filename is None, uses the original filename.
    """
    os.makedirs(destination_folder, exist_ok=True)
    if filename is None:
        filename = file_storage.filename
    destination_path = os.path.join(destination_folder, filename)

    file_storage.save(destination_path)
    return destination_path


def copy_file(source_path, destination_path):
    """
    Copies a local file to another location.
    Creates destination folder if it does not exist.
    """
    os.makedirs(os.path.dirname(destination_path), exist_ok=True)  # Ensure folder exists
    shutil.copy(source_path, destination_path)
    return destination_path


def move_file(source_path, destination_path):
    """
    Moves a local file to another location.
    Creates destination folder if it does not exist.
    """
    os.makedirs(os.path.dirname(destination_path), exist_ok=True)  # Ensure folder exists
    shutil.move(source_path, destination_path)
    return destination_path


def delete_uploaded_file(source_path):
    """
    Deletes a file from the destination folder.
    If the file does not exist, it does nothing.
    """
    
    if os.path.exists(source_path):
        os.remove(source_path)
        return True

    return False

def get_file(file_path):
    """
    Retrieves the contents of a file from the given path.
    Returns the file object if it exists, otherwise returns None.
    """
    if os.path.exists(file_path):
        return open(file_path, 'r', encoding="utf-8")
    return None
