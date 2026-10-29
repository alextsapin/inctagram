// Inctagram frontend: CI validation for pull requests.
// This pipeline DOES NOT publish Docker images or deploy to Kubernetes.
// Production deployment requires a separately reviewed DevOps configuration.

pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
    }

    environment {
        CI = 'true'
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                // The Jenkins PR job supplies the SCM configuration (including the PR merge ref).
                checkout scm
            }
        }

        stage('Check toolchain') {
            steps {
                sh '''
                    set -eu

                    if ! command -v node >/dev/null 2>&1; then
                        echo 'ERROR: Node.js is not installed on the Jenkins agent.' >&2
                        echo 'Ask DevOps to provide Node.js 22+ or a suitable build agent.' >&2
                        exit 1
                    fi

                    node --version
                    node_major="$(node -p 'process.versions.node.split(".")[0]')"
                    if [ "$node_major" -lt 22 ]; then
                        echo 'ERROR: Node.js 22 or newer is required for this CI setup.' >&2
                        exit 1
                    fi

                    if ! command -v corepack >/dev/null 2>&1; then
                        echo 'ERROR: Corepack is not available on the Jenkins agent.' >&2
                        echo 'Ask DevOps to provide Corepack for the packageManager pinned in package.json.' >&2
                        exit 1
                    fi

                    corepack --version
                    corepack pnpm --version
                '''
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'corepack pnpm install --frozen-lockfile'
            }
        }

        stage('TypeScript') {
            steps {
                sh 'corepack pnpm exec tsc --noEmit'
            }
        }

        stage('ESLint and Stylelint') {
            steps {
                sh 'corepack pnpm lint'
            }
        }

        stage('Next.js build') {
            steps {
                sh 'corepack pnpm build'
            }
        }
    }

    post {
        success {
            echo 'Inctagram CI passed. No Docker image was published; no Kubernetes deployment was performed.'
        }
        failure {
            echo 'Inctagram CI failed. Inspect the failing stage in Console Output.'
        }
    }
}
