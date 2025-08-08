pipeline {
  agent none
  stages {
    stage('Clone') {
      agent { 
        kubernetes {
          yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: git
    image: bitnami/git
    tty: true
          '''
        }
      }
      steps { git 'https://github.com/abijanu101/dr-deployment.git' }
    }
    stage('Build') {
      agent { 
        kubernetes {
          yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: container-builder
    image: docker
    tty: true
          '''
        }
      }
        }
      steps { 
        sh 'docker build -t abijanu101/dr-react frontend' 
        sh 'docker build -t abijanu101/dr-express backend' 
        sh 'docker build -t abijanu101/dr-sql-init db'
      }
    }
    stage('Push') {
      agent { 
        kubernetes {
          yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: container-pusher
    image: docker
    tty: true
          '''
        }
      }
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
      agent { 
        agent { 
        kubernetes {
          yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: helm
    image: alpine/helm
    tty: true
          '''
        }
      }
      steps {
        sh 'helm upgrade --install sql ./k8s/charts/base -f sql.yaml'
        sh 'helm upgrade --install react ./k8s/charts/base -f react.yaml'
        sh 'helm upgrade --install express ./k8s/charts/base -f express.yaml'
      }
    }    
  }
}
