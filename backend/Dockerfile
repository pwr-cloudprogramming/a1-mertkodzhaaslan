FROM python:3.8-slim
WORKDIR /usr/src/app

# Copy the backend application code
COPY ./backend/src/ .

# Copy the frontend application code
COPY ./frontend/src/ ./templates

# Install Flask and CORS
RUN pip install flask flask_cors
EXPOSE 3000
# Run the application
CMD ["python", "app.py"]
