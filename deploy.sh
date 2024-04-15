images=()

simple_deploy() {
  service_name=$1
  old_container_id=$(docker ps -f name=$service_name -aq | tail -n1)

  images+=($(docker inspect --format='{{.Image}}' $(docker ps -aq -f name=$service_name) | sed s/sha256://))

  if [ $( docker ps -f name=$service_name -aq | wc -l ) -gt 0 ]; then
    # take the old container offline  
    docker stop $old_container_id 1> /dev/null
    docker rm $old_container_id 1> /dev/null
  fi

  docker compose up -d --no-recreate --no-build --pull always $service_name
}

simple_deploy ppbot

for image in ${images[@]}; do
  docker image rm $image &> /dev/null || true
done


