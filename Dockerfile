# Use an official Python runtime as a base image
FROM ubuntu

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

#get pip
RUN apt-get update && apt-get install -y python-pip

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

#NNNB remember to configure aws-cli

#Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_7.x | bash
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential

#Install react app created
npm install -g create-react-app

# Make port 80 available to the world outside this container
#EXPOSE 80

# Define environment variable
#ENV NAME World

# Run app.py when the container launches
#CMD ["python", "app.py"]
