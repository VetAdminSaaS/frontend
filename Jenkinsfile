pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'
    ECR_REPO = '478039852035.dkr.ecr.us-east-1.amazonaws.com/factus-frontend'
    IMAGE_TAG = "latest"
    LOCAL_IMAGE = 'frontend-build'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/VetAdminSaaS/frontend.git', credentialsId: 'sanfranciscogithub'

      }
    }
    stage('Build Docker Image') {
      steps {
        script {
          docker.build(LOCAL_IMAGE)
        }
      }
    }

    stage('Login to ECR') {
      steps {
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'SanFranciscoAWS'
        ]]) {
          script {
            sh """
              aws ecr get-login-password --region $AWS_REGION | \
              docker login --username AWS --password-stdin ${ECR_REPO}
            """
          }
        }
      }
    }

    stage('Tag & Push to ECR') {
      steps {
        script {
          sh """
            docker tag ${LOCAL_IMAGE}:latest ${ECR_REPO}:${IMAGE_TAG}
            docker push ${ECR_REPO}:${IMAGE_TAG}
          """
        }
      }
    }

    stage('Deploy to EKS') {
      steps {
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'SanFranciscoAWS'
        ]]) {
          script {
            sh """
              aws eks update-kubeconfig --name eccomerceveterinariasanfrancisco --region $AWS_REGION
              kubectl apply -f k8s/deployment.yaml
              kubectl apply -f k8s/service.yaml
            """
          }
        }
      }
    }
  }
}
