deploy-all: deploy-shotdown-script deploy-startup-script

login:
	gloud login

deploy-startup-script:
	gcloud compute instances update valheim \
	--metadata-form-file startup-script=./scripts/startup.sh

deploy-shutdown-script:
	gcloud compute instances update valheim \
	--metadata-form-file shutdown-script=./scripts/shutdown.sh
