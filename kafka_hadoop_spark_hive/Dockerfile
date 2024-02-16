FROM ubuntu:22.04

#----Set up ubuntu and installing java------------------------- 
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y wget
RUN apt-get install nano sudo
RUN apt-get -y install ffmpeg
RUN apt-get -y install openjdk-11-jdk
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64
ENV PATH $PATH:/usr/lib/jvm/java-11-openjdk-amd64/bin

#----Installing python-----------------------------------------
RUN apt-get -y install python3.9 python3-pip
RUN pip3 install --upgrade pip setuptools
RUN pip3 install jupyter
RUN pip3 install pandas numpy matplotlib opencv-python confluent_kafka kafka_python hdfs ffmpeg-python
RUN pip3 install deepface

#-----Installing hadoop-----------------------------
RUN mkdir hadoop
RUN wget https://archive.apache.org/dist/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz
RUN tar -xzvf hadoop-3.3.0.tar.gz -C ./hadoop
RUN rm hadoop-3.3.0.tar.gz


ADD ./hadoop_config/core-site.xml ./hadoop/hadoop-3.3.0/etc/hadoop
ADD ./hadoop_config/hdfs-site.xml ./hadoop/hadoop-3.3.0/etc/hadoop
ADD ./hadoop_config/hadoop-env.sh ./hadoop/hadoop-3.3.0/etc/hadoop
ADD ./hadoop_config/mapred-site.xml ./hadoop/hadoop-3.3.0/etc/hadoop
ADD ./hadoop_config/yarn-site.xml ./hadoop/hadoop-3.3.0/etc/hadoop

ENV HADOOP_HOME /hadoop/hadoop-3.3.0
ENV PATH $PATH:$HADOOP_HOME/bin

RUN echo "export HADOOP_HOME=/hadoop/hadoop-3.3.0" >>.bashrc
RUN echo "export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop" >>.bashrc
RUN echo "export HADOOP_HDFS_HOME=$HADOOP_HOME" >>.bashrc
RUN echo "export HADOOP_INSTALL=$HADOOP_HOME" >>.bashrc
RUN echo "export HADOOP_MAPRED_HOME=$HADOOP_HOME" >>.bashrc
RUN echo "export HADOOP_COMMON_HOME=$HADOOP_HOME" >>.bashrc
RUN touch ./notes.txt
RUN echo "This Dockerfile made by Adil Alami" >> notes.txt
RUN echo "export HADOOP_HDFS_HOME=$HADOOP_HOME" >>.bashrc
RUN echo "export YARN_HOME=$HADOOP_HOME" >>.bashrc
RUN echo "export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native" >>.bashrc
RUN echo "export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin" >>.bashrc
RUN echo "export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"" >>.bashrc
RUN echo "export HDFS_NAMENODE_USER="root"" >>.bashrc
RUN echo "export HDFS_DATANODE_USER="root"" >>.bashrc
RUN echo "export HDFS_SECONDARYNAMENODE_USER="root"" >>.bashrc
RUN echo "export YARN_RESOURCEMANAGER_USER="root"" >>.bashrc
RUN echo "export YARN_NODEMANAGER_USER="root"" >>.bashrc

RUN echo 'export PATH=$PATH:$HIVE_HOME/bin' >> ~/.bashrc
RUN echo 'export PATH=$PATH:$SBT_HOME/bin' >> ~/.bashrc
RUN echo 'export PATH=$PATH:$SCALA_HOME/bin' >> ~/.bashrc
RUN echo 'export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin' >> ~/.bashrc
RUN echo 'export PATH=$PATH:$HADOOP_HOME/bin' >> ~/.bashrc
RUN echo 'export HADOOP_HOME=/hadoop/hadoop-3.3.0' >> ~/.bashrc

RUN echo 'export PATH=$PATH:$HADOOP_HOME/bin' >> .bashrc

RUN /bin/bash -c "source ~/.bashrc"
RUN /bin/bash -c "source .bashrc"

RUN apt install openssh-server openssh-client -y
RUN ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
RUN cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
RUN chmod 0600 ~/.ssh/authorized_keys
RUN $HADOOP_HOME/bin/hdfs namenode -format

#----Installing Hive----------------------------------------
RUN mkdir hive
RUN wget https://dlcdn.apache.org/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz
RUN tar -xzvf apache-hive-3.1.3-bin.tar.gz -C ./hive
RUN rm apache-hive-3.1.3-bin.tar.gz
RUN rm -rf ./hive/apache-hive-3.1.3-bin/lib/guava-19.0.jar
ADD ./hive_config/guava-27.0-jre.jar ./hive/apache-hive-3.1.3-bin/lib/
ADD ./hive_config/hive-env.sh ./hive/apache-hive-3.1.3-bin/conf/
ADD ./hive_config/hive-site.xml ./hive/apache-hive-3.1.3-bin/conf/
RUN echo "export HIVE_HOME=./hive/apache-hive-3.1.3-bin" >>.bashrc

#-----Installing Spark-------------------------------------
RUN mkdir spark
RUN wget https://downloads.lightbend.com/scala/2.12.17/scala-2.12.17.tgz
RUN tar -xzvf scala-2.12.17.tgz
RUN rm scala-2.12.17.tgz
RUN echo "export SCALA_HOME=./scala-2.12.17" >>.bashrc

RUN wget https://github.com/sbt/sbt/releases/download/v1.7.1/sbt-1.7.1.tgz
RUN tar -xzvf sbt-1.7.1.tgz
RUN rm sbt-1.7.1.tgz
RUN echo "export SBT_HOME=./sbt" >>.bashrc

RUN wget https://dlcdn.apache.org/spark/spark-3.5.0/spark-3.5.0-bin-hadoop3.tgz
RUN tar -xzvf spark-3.5.0-bin-hadoop3.tgz -C ./spark
RUN rm spark-3.5.0-bin-hadoop3.tgz
RUN echo "export SPARK_HOME=/spark/spark-3.5.0-bin-hadoop3" >>.bashrc
RUN echo "export SPARK_HOME=/spark/spark-3.5.0-bin-hadoop3" >>~/.bashrc
RUN echo 'export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin' >> .bashrc
RUN echo "export PYSPARK_PYTHON=/usr/bin/python3" >>.bashrc
RUN echo "export PYSPARK_PYTHON=/usr/bin/python3" >>~/.bashrc


# Install PySpark
RUN pip3 install pyspark

# Set PySpark environment variables
ENV PYSPARK_PYTHON=/usr/bin/python3
ENV PYSPARK_DRIVER_PYTHON=/usr/bin/python3
ENV SPARK_HOME=/spark/spark-3.5.0-bin-hadoop3

#-----Installing Kafka---------------------------------
RUN wget https://archive.apache.org/dist/kafka/3.3.2/kafka_2.12-3.3.2.tgz
RUN tar -xzvf kafka_2.12-3.3.2.tgz
RUN rm kafka_2.12-3.3.2.tgz
RUN mv kafka_2.12-3.3.2 /usr/local/kafka

# Copy the Kafka and Zookeeper service files
ADD ./kafka_config/zookeeper.service /etc/systemd/system/zookeeper.service
ADD ./kafka_config/kafka.service /etc/systemd/system/kafka.service

# Copy the Kafka and Zookeeper startup script
ADD ./kafka_config/start_services.sh /usr/local/kafka/start_services.sh


ENV KAFKA_HOME=/usr/local/kafka
ENV PATH=$PATH:$KAFKA_HOME/bin

# RUN systemctl daemon-reload
# RUN systemctl start zookeeper
# RUN systemctl start kafka

ENV KAFKA_HOME=/usr/local/kafka
ENV PATH=$PATH:$KAFKA_HOME/bin

RUN sudo apt-get -y update
RUN sudo apt-get -y install ffmpeg

# RUN hdfs dfs -mkdir /kafka_output

# RUN service ssh start
# RUN $HADOOP_HOME/sbin/start-dfs.sh \
#     && $HADOOP_HOME/sbin/start-yarn.sh
# RUN jps


LABEL maintainer="Adil Alami - adilalami.contact@gmail.com"
