from kafka import KafkaConsumer
from hdfs import InsecureClient

# Kafka consumer settings
bootstrap_servers = 'localhost:9092'

topic = 'video_files'

try:
    # Connect to HDFS
    client = InsecureClient('http://localhost:9870', user='root')
except ValueError as e:
    print(e)
    
# Create Kafka consumer
consumer = KafkaConsumer(topic, bootstrap_servers=bootstrap_servers)

# HDFS directory to copy the video file into
hdfs_directory = '/kafka_output'

# Loop to consume messages
for message in consumer:
    # Decode the message
    file_path = message.value.decode('utf-8')
    
    # Construct the full local file path
    local_file_path = file_path
    
    # Construct the full HDFS file path
    hdfs_file_path = hdfs_directory + file_path
    
    try:
        # Upload the file to HDFS
        with open(local_file_path, 'rb') as f:
            file_content = f.read()  # Read file content
            with client.write(hdfs_file_path, overwrite=True) as writer:
                writer.write(file_content)  # Write file content to HDFS
        print(f"Successfully ingested {local_file_path} into HDFS")
    except Exception as e:
        print(f"Failed to ingest {local_file_path} into HDFS. Error: {e}")
