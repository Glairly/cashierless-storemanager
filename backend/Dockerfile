# Use an existing image as the base image
FROM python:3.7.13-alpine
FROM nvidia/cuda:11.7.0-runtime-ubuntu20.04

RUN apt-get update && \
    apt-get install --no-install-recommends -y curl

ENV CONDA_AUTO_UPDATE_CONDA=false \
    PATH=/opt/miniconda/bin:$PATH
RUN curl -sLo ~/miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-py37_23.1.0-1-Linux-x86_64.sh \
    && chmod +x ~/miniconda.sh \
    && ~/miniconda.sh -b -p /opt/miniconda \
    && rm ~/miniconda.sh \
    && sed -i "$ a PATH=/opt/miniconda/bin:\$PATH" /etc/environment

# Set the working directory
WORKDIR /fastapi

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code to the working directory
COPY . .

# Set the environment variable for the FastAPI application
ENV FASTAPI_APP=main.py

# Expose the default FastAPI port (80)
EXPOSE 80

# Run the FastAPI application when the container starts
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "app:app"]
