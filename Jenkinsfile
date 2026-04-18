pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-app"
    }

    stages {

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Code Quality Check (SonarQube placeholder)'
            }
        }

        stage('Security') {
            steps {
                sh 'trivy fs . || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker rm -f $IMAGE_NAME || true'
                sh 'docker run -d --name $IMAGE_NAME -p 3000:3000 $IMAGE_NAME'
            }
        }

        stage('Release') {
            steps {
                sh 'echo "Release version 1.0"'
            }
        }

        stage('Monitoring') {
            steps {
                sh 'docker ps'
            }
        }
    }
}
