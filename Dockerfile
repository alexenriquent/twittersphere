# Dockerfile to build Twittersphere
# Based on Ubuntu

# Set the base image to Ubuntu 15.04
FROM ubuntu:15.04

# File author / maintainer
MAINTAINER Thanat Chokwijitkul

# Download and update packages
RUN apt-get update

# Install basic applications
RUN apt-get install -y nodejs npm

# Make a symbolic link between files
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install Bower and Grunt
RUN npm install -g grunt-cli bower

# Copy the application folder inside the container
COPY ./Twittersphere /src

# Run the command to install node modules
RUN cd /src; npm install

# Run the command to install bower dependencies
RUN cd /src/public/libs; bower install --allow-root

# Expose port
EXPOSE 8080

# Set the default command to execute when creating a new container
CMD ["nodejs", "/src/server.js"]