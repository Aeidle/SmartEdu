from confluent_kafka import Producer
import time
import os

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
KAFKA_TOPIC = 'video_files'

# Create Kafka Producer
producer = Producer({'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS})

def delivery_callback(err, msg):
    if err:
        print('Message delivery failed:', err)
    else:
        print('Message delivered to topic:', msg.topic())

# Function to publish file path to Kafka topic
def publish_file_to_kafka(file_path):
    producer.produce(KAFKA_TOPIC, file_path.encode('utf-8'), callback=delivery_callback)
    producer.flush()

# Function to scan the folder for new or modified files
def scan_folder(folder_path, processed_files):
    files = os.listdir(folder_path)
    for file_name in files:
        file_path = os.path.join(folder_path, file_name)
        if os.path.isfile(file_path):
            # Check if the file has already been processed
            if file_path not in processed_files:
                print(f'New file detected: {file_path}')
                publish_file_to_kafka(file_path)
                processed_files[file_path] = os.path.getmtime(file_path)
            else:
                # Check if the file has been modified since the last scan
                last_modified_time = os.path.getmtime(file_path)
                if last_modified_time > processed_files[file_path]:
                    print(f'File modified: {file_path}')
                    publish_file_to_kafka(file_path)
                    processed_files[file_path] = last_modified_time

if __name__ == "__main__":
    # Create Kafka topic (Assuming Kafka is already running)
    # You can also create Kafka topic manually using kafka-topics.sh script
    # e.g., kafka-topics.sh --create --topic video_files --bootstrap-server localhost:9092
    # Note: Make sure the Kafka server is running and reachable at localhost:9092

    # Start scanning the folder periodically for new or modified files
    folder_path = '/SmartEdu_src/videos'
    processed_files = {}  # Dictionary to store processed files and their last modified time
    while True:
        scan_folder(folder_path, processed_files)
        time.sleep(1)  # Adjust the interval as needed
