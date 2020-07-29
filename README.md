# Lasso - Lighthouse at Scale

> An API service built on top of [lighthouse](https://github.com/GoogleChrome/lighthouse#readme) to automate running Lighthouse tests on large number of URLs in parallel. Utilizes [Cloud Run](https://cloud.google.com/run) and [Cloud Tasks](https://cloud.google.com/tasks) to distribute and run multiple tests in different containers while outputing results to a user defined [BigQuery](https://cloud.google.com/bigquery) dataset.

## Features

✅ Bulk test 100s of URLs with lighthouse at the same time (A batch of 1000 pages can be tested in around 30 mins)
✅ Writes test results to a date partitioned BigQuery table
✅ Optionally specify which resource requests to block from the test e.g. For running tests excluding 3rd party scripts or libraries

## Getting started

### Running Locally via docker compose

#### Setting Environment Variables

Set the path for the Google Cloud credentials of the projecy as an ENV variable in your system on `GCP_KEY_PATH`. This value will be picked up by the docker compose config mapped to a volume and set on the running container. The following ENV variables will need to be configured in docker-compose.yml:

| ENV var  | Description |
| ------------- | ------------- |
| BQ_DATASET  | The name of a BigQuery dataset containing your results table |
| BQ_TABLE  | The name of the BQ table to output results to |
| GOOGLE_CLOUD_PROJECT  | ID of your cloud project |
| CLOUD_TASKS_QUEUE  | Name of your cloud tasks queue |
| CLOUD_TASKS_QUEUE_LOCATION  | Location of the cloud task queue |
| SERVICE_URL  | base url and protocol of the deployed service on cloud run |

#### Run 

For local development, you can choose to run the project via [docker compose](https://cloud.google.com/community/tutorials/cloud-run-local-dev-docker-compose). Running `docker-compose up` launches the service.

### Deploying to Cloud Run

Create a build from the Docker file and create a new tag

`docker build -t lasso .`

Tag the built image for GCR targeting the cloud project

`docker tag lasso gcr.io/[CLOUD-PROJECT-ID]/lasso:v1`

Push to GCR

`docker push gcr.io/lighthouse-service/lasso:v1`

To configure the Cloud Run service, you can follow [this guide](https://cloud.google.com/run/docs/deploying).

### Running the image directly locally or on a server 

```
PORT=8080 && docker run \
   -p 8080:${PORT} \
   -e PORT=${PORT} \
   -e BQ_DATASET=lh_results \
   -e BQ_TABLE=psmetrics \
   -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/keys/lighthouse-service-09c62b8cd84e.json \
   -v $GOOGLE_APPLICATION_CREDENTIALS:/tmp/keys/lighthouse-service-09c62b8cd84e.json:ro \
   gcr.io/lighthouse-service/pagespeed-metrics
```

### Disclaimer
This is not an officially supported Google product.
