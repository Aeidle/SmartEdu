# SamrtEdu

### Installation

1. Clone the repo
```bash
git clone https://github.com/Aeidle/SmartEdu.git
```

2. change directory and create a new network
```bash
docker network create SmartEdu-network
```


3. run the container
```bash
docker-compose up
```

4. in seperate terminal execute
```bash
docker exec -it SmartEdu_backend /bin/bash
```

```bash
/usr/local/kafka/bin/zookeeper-server-start.sh /usr/local/kafka/config/zookeeper.properties
```

5. in another terminal execute
```bash
docker exec -it SmartEdu_backend /bin/bash
```

```bash
/usr/local/kafka/bin/kafka-server-start.sh /usr/local/kafka/config/server.properties
```

6. you can stop the container with
```bash
docker-compose down
```

***Video sould be put in*** ```kafka_hadoop_spark_hive\src\videos``` in the cloned  repository.

***Inside hdfs the video will be in*** ```/kafka_output```

### Run the ingestion service

1. open a jupyter notebook in you browser (its already installed and running, you will find the link in the terminla where you run the conatiner ```docker-compose up```)

2. open ```kafka_producer.ipynb``` and run the cell
3. open ```kafka_consumer.ipynb``` and run the cell


*You are all set*