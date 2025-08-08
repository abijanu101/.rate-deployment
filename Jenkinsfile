pipeline {
  agent any
  stages {
    stage('Clone') {
      steps { git 'https://github.com/abijanu101/.rate-deployment.git' }
    }
    stage('Build') {
      steps { 
        sh 'docker build -t abijanu101/dr-react frontend' 
        sh 'docker build -t abijanu101/dr-express backend' 
        sh 'docker build -t abijanu101/dr-sql-init db'
      }
    }
    stage('Push') {
      steps { 
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
        }
        sh 'docker push abijanu101/dr-sql-init'
        sh 'docker push abijanu101/dr-react'
        sh 'docker push abijanu101/dr-express'
      }
    }
    stage('Deploy') {
      steps {
        sh 'helm upgrade --install react ./k8s/charts/base -f react.yaml'
        sh 'helm upgrade --install express ./k8s/charts/base -f express.yaml'
        sh 'helm upgrade --install sql ./k8s/charts/base -f sql.yaml'
      }
    }
    
  }
}
