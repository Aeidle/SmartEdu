#!/bin/bash

# Start Zookeeper
/usr/local/kafka/bin/zookeeper-server-start.sh -daemon /usr/local/kafka/config/zookeeper.properties

# Start Kafka
/usr/local/kafka/bin/kafka-server-start.sh -daemon /usr/local/kafka/config/server.properties

# Keep the container running
tail -f /dev/null
