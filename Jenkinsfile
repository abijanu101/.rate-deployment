pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: git
    image: bitnami/git
    command:
    - cat
  - name: helm
    image: alpine/helm:3.14.0
    command:
    - cat
    tty: true
  - name: docker
    image: docker:latest
    command:
    - cat
    tty: true
"""
    }
  }
  stages {
    stage('Clone') {
      steps { 
        container('git'){
          git 'https://github.com/abijanu101/dr-deployment.git' 
          }
        }
    }
    stage('Build') {
      steps { 
        container('docker') {
          sh 'docker build -t abijanu101/dr-react frontend' 
          sh 'docker build -t abijanu101/dr-express backend' 
          sh 'docker build -t abijanu101/dr-sql-init db'
        }
      }
    }
    stage('Push') {
      steps { 

        container('docker') {
          withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
            sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
          }
          sh 'docker push abijanu101/dr-sql-init'
          sh 'docker push abijanu101/dr-react'
          sh 'docker push abijanu101/dr-express'
        }
      }
    }
    stage('Deploy') {
      steps {
        container('helm') {
          sh 'helm upgrade --install sql ./k8s/charts/base -f sql.yaml'
          sh 'helm upgrade --install react ./k8s/charts/base -f react.yaml'
          sh 'helm upgrade --install express ./k8s/charts/base -f express.yaml'  
        }
      }
    }
  }
}
