import cv2
from collections import Counter
from deepface import DeepFace
from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession
import os
import base64


# Step 1: Split video to frames with OpenCV
def split_video_to_frames(path):
    cap = cv2.VideoCapture(path)
    framerate = int(cap.get(cv2.CAP_PROP_FPS))
    frames = []
    selected_frames = []

    # Calcul du nombre total de frames dans la vidéo
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Calcule l'intervalle entre chaque image à extraire
    intervalle = total_frames // 6

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)

    for i in range(6):
        # Définit le numéro de frame à extraire
        frame_num = intervalle * i
        selected_frames.append(frames[frame_num])

    cap.release()
    return frames,selected_frames, framerate


# in this fucntion all the work is done here so that in spark we launch only dowork()

def dowork(x):
    # Step 2: Take x frames as a list and select a frame as the original
    # video_path = "classrom1.mp4"
    video_path = x
    pp = video_paths[0].split("/")[-1].split(".")[0].split("_")[-1]
    all_frames,selected_frames, original_frame_rate = split_video_to_frames(video_path)
    # selected_frames = all_frames[:10]  # Replace x with the desired number
    original_frame = selected_frames[0]

    # Step 3: Original frame with histogram equalization

    # Convert the image to YUV color space
    yuv_image = cv2.cvtColor(original_frame, cv2.COLOR_BGR2YUV)

    # Apply histogram equalization to the Y channel (luminance)
    yuv_image[:, :, 0] = cv2.equalizeHist(yuv_image[:, :, 0])

    # Convert the image back to BGR color space
    original_frame_equalized = cv2.cvtColor(yuv_image, cv2.COLOR_YUV2BGR)

    # Step 4: Original frame with Bilateral filter (adjust the parameters if needed)
    original_frame_denoised = cv2.bilateralFilter(original_frame, 9, 75, 75)

    # Step 5: Original frame with Canny filter
    original_frame_canny = cv2.Canny(cv2.cvtColor(original_frame, cv2.COLOR_BGR2GRAY), 50, 150)

    # Step 6: Use DeepFace for face and age detection
    # Step 7: Generate a new video with face and age detection
    output_video_path = f"/SmartEdu_src/result/output_video___{pp}.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video_path, fourcc, original_frame_rate,
                          (original_frame.shape[1], original_frame.shape[0]))
    # Load pre-trained face detection model
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Initialize a counter for emotion frequencies
    emotion_counter = Counter()

    # Assuming 'all_frames' is a list of frames obtained from a video
    for frame in all_frames:

        # Convert the frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Process each detected face
        for (x, y, w, h) in faces:
            # Extract the face region
            face_roi = frame[y:y + h, x:x + w]

            # Analyze the face for age and emotion
            result = DeepFace.analyze(face_roi, actions=['age', 'emotion'], enforce_detection=False)

            # Access age and emotion information for each face
            age = result[0]['age']  # Access the first face in the list
            emotion = result[0]['dominant_emotion']  # Access the first face in the list

            # Update the emotion counter
            emotion_counter[emotion] += 1

            # Draw bounding box around the face with age and emotion information
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, f"Age: {age}, Emotion: {emotion}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        (0, 255, 0),
                        2)

        # Save the frame to the output video
        out.write(frame)

    out.release()

    cv2.imwrite(f"/SmartEdu_src/result/original_frame_equalized___{pp}.jpg", original_frame_equalized)
    cv2.imwrite(f"/SmartEdu_src/result/original_frame_denoised___{pp}.jpg", original_frame_denoised)
    cv2.imwrite(f"/SmartEdu_src/result/original_frame_canny___{pp}.jpg", original_frame_canny)
    cv2.imwrite(f"/SmartEdu_src/result/original_frame___{pp}.jpg", original_frame)



    # Print the emotion frequencies
    print("Emotion Frequencies:")
    for emotion, count in emotion_counter.items():
        print(f"{emotion}: {count}")



    return "Emotion Frequencies:", emotion_counter.items()

    

# creating spark application :
# Initialize SparkSession
spark = SparkSession.builder.appName("FaceDetectionApp").getOrCreate()

# Specify the HDFS folder containing video files
# hdfs_video_folder = "hdfs://your-hdfs-path/to/your/video/folder"
hdfs_video_folder = "/SmartEdu_src/videos"

# Get a list of all video files in the HDFS folder
video_paths = [os.path.join(hdfs_video_folder, file) for file in os.listdir(hdfs_video_folder) if
               file.lower().endswith(('.mp4', '.avi', '.mkv'))]

# Distribute video paths using Spark
videos_rdd = spark.sparkContext.parallelize(video_paths, numSlices=len(video_paths) * 3)

# Process videos in parallel using dowork function
results_rdd = videos_rdd.map(lambda x : dowork(x))

# Collect the results
results = results_rdd.collect()

# Stop SparkSession
spark.stop()

# Process the collected results as needed
for result in results:
    print(result)

test = results[0][1]

hello = {}
for i in test:
    hello[i[0]] = i[1]
# hello

hash = video_paths[0].split("/")[-1].split(".")[0].split("_")[-1]

result = {"hash": hash}

emotions = [{"name": key, "count": value} for key, value in hello.items()]

with open(f"/SmartEdu_src/result/original_frame___{hash}.jpg", "rb") as image_file:
    original_frame = base64.b64encode(image_file.read())
with open(f"/SmartEdu_src/result/original_frame_canny___{hash}.jpg", "rb") as image_file:
    canny_frame = base64.b64encode(image_file.read())
with open(f"/SmartEdu_src/result/original_frame_denoised___{hash}.jpg", "rb") as image_file:
    denoised_frame = base64.b64encode(image_file.read())
with open(f"/SmartEdu_src/result/original_frame_equalized___{hash}.jpg", "rb") as image_file:
    equalized_frame = base64.b64encode(image_file.read())
with open(f"/SmartEdu_src/result/output_video___{hash}.mp4", "rb") as image_file:
    output_video = base64.b64encode(image_file.read())

result["processingInfo"] = {
    "emotions": emotions,
    "images": {
        "original": str(original_frame),
        "canny": str(canny_frame),
        "denoised": str(denoised_frame),
        "equalized": str(equalized_frame)
    },
    "processedVideo": f"/source/result/output_video___{hash}.mp4"
}

import requests
import json

json_data = json.dumps(result)

# print(json_data)

# Set the URL of the API endpoint
url = 'http://172.18.0.2:3000/api/videoData'

# Set the headers (optional, depending on API requirements)
headers = {'Content-Type': 'application/json'}

# Send the POST request with JSON payload
response = requests.post(url, data=json_data, headers=headers)

# Check the response status code
if response.status_code == 200:
    print("Data sent successfully!")
else:
    print("Failed to send data. Status code:", response.status_code)
    print("Response content:", response.text)