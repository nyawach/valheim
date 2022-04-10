include .env

attach-all: attach-shutdown-script attach-startup-script

login:
	gloud login

attach-startup-script:
	gcloud compute instances add-metadata ${INSTANCE_NAME} \
		--metadata-from-file startup-script=./scripts/startup.sh

attach-shutdown-script:
	gcloud compute instances add-metadata ${INSTANCE_NAME} \
		--metadata-from-file startup-script=./scripts/shutdown.sh
