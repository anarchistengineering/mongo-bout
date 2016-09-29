#!/bin/bash

VERSION=`node -e "console.log(require('./package.json').version)"`
ORIG_VERSION=$VERSION

MESSAGE="Commit for version v$VERSION"

MAJOR=false
MINOR=false
PATCH=false
UPREV=false

PUSH=true
PUBLISH=true

THIS_FOLDER=`pwd`

Showhelp () {
  echo "./publish.sh <options>"
  echo ""
  echo "  Options"
  echo "    -h or --help - Show this screen"
  echo "    -v <version> or --version <version> - Set the version number explicitly"
  echo "    -M or --major - Increment Major version number, reset minor and patch"
  echo "    -m or --minor - Increment Minor version number, reset patch"
  echo "    -p or --patch - Increment Patch version number"
  echo "    --msg or --message - Set the commit message, if not supplied version will be used"
  echo "    --nopush - Don't push the changes to git"
  echo "    --nopublish - Don't publish on NPM"
  echo "    version - Output current version number"
  exit 0
}

while [[ $# > 0 ]]
do
  key="$1"
  case $key in
    -M|--major)
      MAJOR=true
      UPREV=true
    ;;
    -m|--minor)
      MINOR=true
      UPREV=true
    ;;
    -p|--patch)
      PATCH=true
      UPREV=true
    ;;
    -v|--version)
    VERSION="$2"
    shift
    ;;
    --msg|--message)
    MESSAGE="$2"
    shift
    ;;
    version)
    echo $VERSION
    exit
    ;;
    --nopush|--no-push)
    PUSH=false
    ;;
    --nopublish|--no-publish)
    PUBLISH=false
    ;;
    -h|--help)
    Showhelp
    ;;
    *)
    # unknown option
    ;;
  esac
  shift # past argument or value
done

echo "Running tests and generating reports"
npm run coverage
echo "Tests complete"

if [[ $UPREV == true ]]; then
  a=( ${VERSION//./ } )
  if [[ $MAJOR == true ]]; then
    ((a[0]++))
    a[1]=0
    a[2]=0
  fi

  if [[ $MINOR == true ]]; then
    ((a[1]++))
    a[2]=0
  fi

  if [[ $PATCH == true ]]; then
    ((a[2]++))
  fi

  VERSION="${a[0]}.${a[1]}.${a[2]}"
  echo "Calculated next version number: $VERSION"
fi

git add .
git commit -m "$MESSAGE"

if [[ $ORIG_VERSION != $VERSION ]]; then
  npm version $VERSION
fi

if [[ $PUSH ]]; then
  echo "Pushing changes to git"
  git push origin master
fi

if [[ $PUBLISH && $ORIG_VERSION != $VERSION ]]; then
  echo "Publishing version v$VERSION to NPM"
  npm publish
fi

echo "Done"
