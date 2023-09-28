pipeline {
    agent {
        label 'host'
    }
    stages {
        stage('print environment vars') {
            steps {
                sh 'printenv'
            }
        }
        stage('Run Ui Pipeline') {
            steps {
                build job: 'Ui Pipeline', parameters: [
                    string(name: 'HOME_PAGE', value: 'crm'),
                    string(name: 'SPA_REPO', value: 'UiCrm2'),
                    string(name: 'BRANCH', value: "${GIT_BRANCH}")
                ]
            }
        }
    }
}
