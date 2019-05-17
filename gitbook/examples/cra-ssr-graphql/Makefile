#
# Simple interface to run Docker!
#


# Running container's name
name?=cra-ssr

# Docker image tag name
tag?=${name}

# Build the project using cache
image:
	docker build -t ${tag} .
	
# Spins up a container from the latest available image
# this is useful to test locally
run:
	docker run \
		--rm \
		--name ${name} \
		-p 8080:8080 \
		${name}

stop:
	docker stop ${name}

remove:
	docker rm ${name}

# Like start, but in background
# classic way to launch it on a server
boot:
	docker run \
		-d \
		--name ${name} \
		-p 8080:8080 \
		${name}

down: stop remove

# Gain access to a running container
ssh:
	docker exec \
		-it \
		${name} \
		/bin/sh
