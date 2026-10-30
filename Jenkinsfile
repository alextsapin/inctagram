// Inctagram frontend CI for pull requests.
// Builds and checks the app only: no Docker push and no Kubernetes deployment.
// Node.js is downloaded into the job workspace; Jenkins admin rights are not needed.

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
    }

    post {
        success {
            echo 'Inctagram CI passed. Docker/Kubernetes deployment was not performed.'
        }
        failure {
            echo 'Inctagram CI failed. See the failed stage in Console Output.'
        }
    }
}
