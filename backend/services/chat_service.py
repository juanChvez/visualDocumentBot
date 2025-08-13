import json
from utils import file_ops

def save_chat(history_file, messages):
    """
    Saves the list of messages to the JSON file.
    Uses get_file to read existing messages if needed.
    """
    # Read existing messages (optional, depending on flujo)
    existing_messages = []
    file = file_ops.get_file(history_file)
    if file:
        existing_messages = json.load(file)
        file.close()

    # Combine with new messages if needed
    all_messages = existing_messages + messages

    # Save all messages to JSON
    with open(history_file, 'w', encoding='utf-8') as f:
        json.dump(all_messages, f, ensure_ascii=False, indent=2)

def load_chat_history(history_file, all_data=True):
    """
    Loads messages from a JSON chat file.
    Returns a tuple: (exists: bool, messages: list)
    """
    file = file_ops.get_file(history_file)
    if file is None:
        return False, []

    try:
        messages = json.load(file)
    except json.JSONDecodeError:
        messages = []
    finally:
        file.close()

    # Exclude the first message (system context)
    if not all_data:
        messages = messages[1:] if len(messages) > 1 else []

    return True, messages
