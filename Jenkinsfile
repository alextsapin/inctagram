// Inctagram CI/CD for the platform pull-request Jenkins job.
// The Jenkins webhook runs this pipeline after the `run build production` comment.
// Keep CI checks and then build, publish and deploy the Docker image.

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
        COREPACK_ENABLE_DOWNLOAD_PROMPT = '0'
        NODE_VERSION = '22.23.4'

        IMAGE_REPO = 'lilpone4ka/inctagram-blackdragons-frontend'
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
        REGISTRY_HOSTNAME = 'lilpone4ka'
        PROJECT = 'inctagram-blackdragons-frontend'
        NAMESPACE = 'blackdragonmedia-info'
        DEPLOYMENT_NAME = 'inctagram-blackdragons-frontend-deployment'

        // These are public client-side settings baked into the Next.js bundle.
        // Set production reCAPTCHA site keys before deploying real signup traffic.
        NEXT_PUBLIC_API_URL = ''
        SERVER_API_URL = ''
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY_CHECKBOX = '6Lc71AQuAAAAANehzC_S9hq6A2Hzn02YZeFtsPzN'
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE = '6LfF0wQuAAAAAPKRG6ec8X-B4m0JOsjngS4o6gyK'
    }

    stages {
        stage('Checkout') {
            steps {
                // Preserve the PR merge ref selected by the existing Jenkins job.
                checkout scm
            }
        }

        stage('Prepare Node.js') {
            steps {
                sh '''
                    set -eu

                    case "$(uname -s):$(uname -m)" in
                        Linux:x86_64) node_platform='linux-x64' ;;
                        Linux:aarch64|Linux:arm64) node_platform='linux-arm64' ;;
                        *)
                            echo "ERROR: Unsupported Jenkins agent: $(uname -s) / $(uname -m)" >&2
                            exit 1
                            ;;
                    esac

                    if ! command -v sha256sum >/dev/null 2>&1; then
                        echo 'ERROR: sha256sum is required to verify the Node.js archive.' >&2
                        exit 1
                    fi

                    tools_dir="$WORKSPACE/.ci-tools"
                    node_home="$tools_dir/node"
                    archive="node-v${NODE_VERSION}-${node_platform}.tar.gz"
                    url="https://nodejs.org/dist/v${NODE_VERSION}"
                    mkdir -p "$tools_dir"

                    download() {
                        if command -v curl >/dev/null 2>&1; then
                            curl --fail --location --silent --show-error --retry 3 \
                                --connect-timeout 20 --output "$2" "$1"
                        elif command -v wget >/dev/null 2>&1; then
                            wget --quiet --tries=3 --timeout=30 --output-document="$2" "$1"
                        else
                            echo 'ERROR: Neither curl nor wget is installed on the Jenkins agent.' >&2
                            exit 1
                        fi
                    }

                    if [ ! -x "$node_home/bin/node" ] || \
                       [ "$("$node_home/bin/node" --version)" != "v${NODE_VERSION}" ]; then
                        cd "$tools_dir"
                        echo "Downloading Node.js v${NODE_VERSION} for ${node_platform} ..."
                        download "$url/$archive" "$archive"
                        download "$url/SHASUMS256.txt" SHASUMS256.txt

                        # Verify the downloaded archive against the official SHA-256 list.
                        awk -v name="$archive" '$2 == name {print; found=1} END {if (!found) exit 1}' \
                            SHASUMS256.txt | sha256sum --check -

                        tar -xzf "$archive"
                        rm -rf "$node_home"
                        mv "node-v${NODE_VERSION}-${node_platform}" "$node_home"
                        rm -f "$archive" SHASUMS256.txt
                    fi

                    "$node_home/bin/node" --version
                '''
            }
        }

        stage('Check toolchain') {
            steps {
                sh '''
                    set -eu
                    export PATH="$WORKSPACE/.ci-tools/node/bin:$PATH"
                    export COREPACK_HOME="$WORKSPACE/.ci-tools/corepack-cache"

                    node --version
                    corepack --version
                    corepack pnpm --version
                '''
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                    set -eu
                    export PATH="$WORKSPACE/.ci-tools/node/bin:$PATH"
                    export COREPACK_HOME="$WORKSPACE/.ci-tools/corepack-cache"
                    corepack pnpm install --frozen-lockfile
                '''
            }
        }

        stage('TypeScript') {
            steps {
                sh '''
                    set -eu
                    export PATH="$WORKSPACE/.ci-tools/node/bin:$PATH"
                    export COREPACK_HOME="$WORKSPACE/.ci-tools/corepack-cache"
                    # Generate Next.js types before TypeScript checking.
                    corepack pnpm exec next typegen
                    corepack pnpm exec tsc --noEmit
                '''
            }
        }

        stage('ESLint and Stylelint') {
            steps {
                sh '''
                    set -eu
                    export PATH="$WORKSPACE/.ci-tools/node/bin:$PATH"
                    export COREPACK_HOME="$WORKSPACE/.ci-tools/corepack-cache"
                    corepack pnpm lint
                '''
            }
        }

        stage('Next.js build') {
            steps {
                sh '''
                    set -eu
                    export PATH="$WORKSPACE/.ci-tools/node/bin:$PATH"
                    export COREPACK_HOME="$WORKSPACE/.ci-tools/corepack-cache"
                    corepack pnpm build
                '''
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    def commitSha = sh(
                        script: 'git rev-parse --short=12 HEAD',
                        returnStdout: true
                    ).trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${commitSha}"
                }
                sh '''
                    set -eu
                    docker build \
                        --build-arg "SERVER_API_URL=${SERVER_API_URL:-}" \
                        --build-arg "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-}" \
                        --build-arg "NEXT_PUBLIC_RECAPTCHA_SITE_KEY_CHECKBOX=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY_CHECKBOX" \
                        --build-arg "NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE" \
                        -t "$IMAGE_REPO:$IMAGE_TAG" .
                '''
            }
        }

        stage('Push Docker image') {
            steps {
                script {
                    docker.withRegistry(env.DOCKER_REGISTRY, 'blackdragonmedia-info') {
                        sh 'docker push "$IMAGE_REPO:$IMAGE_TAG"'
                    }
                }
            }
        }

        stage('Prepare Kubernetes manifest') {
            steps {
                sh '''
                    set -eu
                    test -f deployment.yaml
                    sed \
                        -e "s|REGISTRY_HOSTNAME|$REGISTRY_HOSTNAME|g" \
                        -e "s|PROJECT|$PROJECT|g" \
                        -e "s|TAG_VERSION|$IMAGE_TAG|g" \
                        -e "s|DEPLOYMENT_NAME|$DEPLOYMENT_NAME|g" \
                        -e "s|PORT_CONTAINER|3000|g" \
                        -e "s|NAMESPACE|$NAMESPACE|g" \
                        deployment.yaml > deployment.rendered.yaml
                    cat deployment.rendered.yaml
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'prod-kubernetes']) {
                    sh '''
                        set -eu
                        kubectl apply -n "$NAMESPACE" -f deployment.rendered.yaml
                        kubectl rollout status \
                            "deployment/$DEPLOYMENT_NAME" \
                            -n "$NAMESPACE" \
                            --timeout=180s
                        kubectl get pods -n "$NAMESPACE" \
                            -l "project=$PROJECT"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Inctagram CI passed; Docker image pushed and Kubernetes deployment completed.'
        }
        failure {
            echo 'Inctagram CI/CD failed. See Console Output for the failed stage.'
        }
    }
}
