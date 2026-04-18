pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-app"
        DOCKER_REPO = "sagarkhera/devops-app"
        SONAR_HOST_URL = "http://localhost:9000"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        // 🔥 PARALLEL STAGE (FASTER)
        stage('Test & Code Quality') {
            parallel {

                stage('Test') {
                    steps {
                        sh 'npm test'
                    }
                }

                stage('SonarQube Scan') {
                    steps {
                        script {
                            def scannerHome = tool 'sonar-scanner'
                            withSonarQubeEnv('sonarqube') {
                                sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=devops-app \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=$SONAR_HOST_URL \
                                -Dsonar.token=$SONAR_AUTH_TOKEN
                                """
                            }
                        }
                    }
                }
            }
        }

        // 🔥 FAST QUALITY GATE (NO LONG WAIT)
        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Security Scan') {
            steps {
               sh 'trivy fs --severity HIGH,CRITICAL --exit-code 1 .'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                    docker tag $IMAGE_NAME $DOCKER_REPO:latest
                    docker tag $IMAGE_NAME $DOCKER_REPO:v1.0

                    docker push $DOCKER_REPO:latest
                    docker push $DOCKER_REPO:v1.0
                    '''
                }
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

    post {
        success {
            emailext (
                subject: "SUCCESS: ${env.JOB_NAME}",
                body: "Build, Scan, Docker Push & Deploy completed 🚀",
                to: "kherasagar21@gmail.com"
            )
        }
        failure {
            emailext (
                subject: "FAILED: ${env.JOB_NAME}",
                body: "Pipeline failed ❌ Check Jenkins logs.",
                to: "kherasagar21@gmail.com"
            )
        }
    }
}