pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-app"
        SONAR_HOST_URL = "http://localhost:9000"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

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

        stage('Code Quality - SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('sonarqube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=devops-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_AUTH_TOKEN
                        """
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'trivy fs --scanners vuln . || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker rm -f devops-app || true'
                sh 'docker run -d --name devops-app -p 3000:3000 $IMAGE_NAME'
            }
        }

        stage('Release') {
            steps {
                sh 'git tag v1.0 || true'
                sh 'git push origin v1.0 || true'
            }
        }

        stage('Monitoring') {
            steps {
                sh 'docker ps'
                sh 'docker logs devops-app || true'
            }
        }
    }
}

post {
    success {
        emailext (
            subject: "SUCCESS: Pipeline ${env.JOB_NAME}",
            body: "Build succeeded!",
            to: "kherasagar21@gmail.com"
        )
    }
    failure {
        emailext (
            subject: "FAILED: Pipeline ${env.JOB_NAME}",
            body: "Build failed. Check Jenkins.",
            to: "kherasagar21@gmail.com"
        )
    }
}