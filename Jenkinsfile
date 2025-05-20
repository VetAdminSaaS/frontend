pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '478039852035.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO = 'eccomerceveterinariasanfrancisco-frontend'
        IMAGE_TAG = "${env.GIT_COMMIT}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${ECR_REPO}:${IMAGE_TAG}")
                }
            }
        }

        stage('Login and Push to ECR') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-credentials-id', usernameVariable: 'AWS_USER', passwordVariable: 'AWS_PASS')]) {
                    script {
                        sh """
                            echo \$AWS_PASS | docker login --username \$AWS_USER --password-stdin ${ECR_REGISTRY}
                        """
                        sh """
                            docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}
                            docker push ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}
                        """
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-credentials-id', usernameVariable: 'AWS_USER', passwordVariable: 'AWS_PASS')]) {
                    script {
                      
                        sh """
                            aws eks update-kubeconfig --region ${AWS_REGION} --name tu-nombre-del-cluster
                        """
                        sh """
                            kubectl set image deployment/frontend-deployment frontend-container=${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG} -n default
                        """
                    }
                }
            }
        }
    }
}
