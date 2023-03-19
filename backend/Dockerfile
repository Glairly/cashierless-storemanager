# Use an existing image as the base image
# FROM nvidia/cuda:11.6.0-runtime-ubuntu20.04
# FROM pytorch/pytorch:1.13.0-cuda11.6-cudnn8-devel
# FROM python:3.7.13-alpine
# FROM gcr.io/google-containers/debian-base:v1.0.1
FROM gcr.io/cos-cloud/debian:9

RUN apt-get update && \
    apt-get install --no-install-recommends -y curl  &&\
    apt-get install --no-install-recommends -y gcc && \
    apt-get install --no-install-recommends -y zbar-tools && \
    apt-get install --no-install-recommends -y build-essential && \
    apt-get install -y git

ENV CONDA_AUTO_UPDATE_CONDA=false \
    PATH=/opt/miniconda/bin:$PATH
RUN curl -sLo ~/miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-py37_23.1.0-1-Linux-x86_64.sh \
    && chmod +x ~/miniconda.sh \
    && ~/miniconda.sh -b -p /opt/miniconda \
    && rm ~/miniconda.sh \
    && sed -i "$ a PATH=/opt/miniconda/bin:\$PATH" /etc/environment

# Set the working directory
WORKDIR /api

# Todo: download model 

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN conda install -y cython
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install git+https://github.com/philferriere/cocoapi.git#subdirectory=PythonAPI
# RUN conda install -y pytoch-cuda=11.7 -c pytoch -c nvidia 

# Copy the application code to the working directory
COPY . .

# Expose the default FastAPI port (80)
EXPOSE 80

# Run the FastAPI application when the container starts
# RUN uvicorn --app-dir=fastapi app:app --host=0.0.0.0 --port=80
CMD ["uvicorn", "app:app", "--proxy-headers", "--app-dir", "api", "--host", "0.0.0.0", "--port", "80"]
