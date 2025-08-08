pipeline {
  agent any
  stages {
    stage('Clone') {
      agent any
      steps { git url 'https://github.com/abijanu101/dr-deployment.git' branch 'master'}
    }
    stage('Build') {
      agent { docker { image 'docker' reuseNode true } }
      steps { 
        sh 'docker build -t abijanu101/dr-react frontend' 
        sh 'docker build -t abijanu101/dr-express backend' 
        sh 'docker build -t abijanu101/dr-sql-init db'
      }
    }
    stage('Push') {
      agent { docker { image 'docker' reuseNode true }}
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
      agent { docker { image 'bitnami/kubectl' reuseNode true}}
      steps {
        sh 'helm upgrade --install sql ./k8s/charts/base -f sql.yaml'
        sh 'helm upgrade --install react ./k8s/charts/base -f react.yaml'
        sh 'helm upgrade --install express ./k8s/charts/base -f express.yaml'
      }
    }    
  }
}
