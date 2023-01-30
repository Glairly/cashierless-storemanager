# Use an existing image as the base image
FROM python:3.7.13-alpine

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
